import { NextRequest, NextResponse } from "next/server";
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
import { Options } from "@/components/AdvancedOptions";
import { log } from "../log";

export type Domain = {
  available: boolean;
  definitive: boolean;
  domain: string;
  period?: number;
  price?: number;
  currency?: string;
};

async function getAvailableDomains(domainNames: string[]) {
  if (domainNames.length === 0) {
    return [];
  }

  const response = await fetch(
    `${process.env.GODADDY_URL}/v1/domains/available`,
    {
      method: "POST",
      cache: "no-store",
      headers: {
        Authorization: `sso-key ${process.env.GODADDY_API_KEY}:${process.env.GODADDY_API_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(domainNames),
    }
  );

  // If GoDaddy are throttling us then we assume all domains are available
  if (!response.ok) {
    return domainNames.map<Domain>((domainName) => ({
      available: true,
      definitive: false,
      domain: domainName,
    }));
  }

  const availability: { domains: Domain[] } = await response.json();

  return availability.domains.filter((domain) => domain.available);
}

let domainRegex: RegExp;

async function initialize() {
  if (domainRegex) {
    return;
  }

  const tlds: { name: string; type: "COUNTRY_CODE" | "GENERIC" }[] =
    await fetch(`${process.env.GODADDY_URL}/v1/domains/tlds`, {
      headers: {
        Authorization: `sso-key ${process.env.GODADDY_API_KEY}:${process.env.GODADDY_API_SECRET}`,
      },
    }).then((response) => response.json());

  domainRegex = new RegExp(
    `[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\\.(?:${tlds
      .map(({ name }) => name.replace(/\./g, "\\."))
      .join("|")})`,
    "gi"
  );
}

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

export async function POST(request: NextRequest) {
  await initialize();

  let { description, options }: { description: string; options: Options } =
    await request.json();

  // Make sure description is 100 characters or less
  description = description.slice(0, 100);

  let prompt = "List some suitable domain names for my project in CSV format. ";

  if (options.tlds.length > 0) {
    const lastTld = options.tlds.pop();
    prompt += `Suggest domain names that end in ${options.tlds.join(", ")}${
      options.tlds.length > 0 ? ` or ${lastTld}` : lastTld
    }. `;
  }

  if (options.numberOfWords > 0) {
    prompt += `Suggest domain names that are ${options.numberOfWords} word${
      options.numberOfWords !== 1 ? "s" : ""
    } long. `;
  }

  prompt += `Description of my project: "${description}"`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      stream: true,
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  const responseBody = response.body;

  if (responseBody === null) {
    throw new Error("Invalid response from OpenAI");
  }

  let completeResponse = "";
  const domainNamesFound: string[] = [];
  const pendingPromises: Promise<void>[] = [];

  const stream = new ReadableStream({
    async start(controller) {
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === "event") {
          const data = event.data;

          try {
            const [choice] = JSON.parse(data).choices;

            if (choice.delta.content === undefined) {
              return;
            }

            // Add delta to complete response
            completeResponse += choice.delta.content;

            // Find new domain names in the complete response
            const newDomainNames = [
              ...(completeResponse.matchAll(domainRegex) ?? []),
            ]
              .map(([domainName]) => domainName.toLowerCase())
              .filter(
                (domainName) =>
                  domainName.length < 25 &&
                  !domainNamesFound.includes(domainName)
              );

            domainNamesFound.push(...newDomainNames);

            const pendingPromise = getAvailableDomains(newDomainNames).then(
              (availableDomains) => {
                // Return available domains separated by |
                if (availableDomains.length > 0) {
                  controller.enqueue(
                    textEncoder.encode(
                      availableDomains
                        .map((availableDomain) =>
                          JSON.stringify(availableDomain)
                        )
                        .join("|") + "|"
                    )
                  );
                }

                log.queue(
                  availableDomains.map((availableDomain) => ({
                    description,
                    suggestion: availableDomain.domain,
                    options: JSON.stringify(options),
                  }))
                );
              }
            );

            pendingPromises.push(pendingPromise);
          } catch {
            // Ignore lines that we fail to parse
          }
        }
      }

      const parser = createParser(onParse);

      for await (const chunk of responseBody as any) {
        parser.feed(textDecoder.decode(chunk));
      }

      // Wait for all availability checks to finish
      await Promise.all(pendingPromises);

      // Send logs
      await log.flush();

      // Close the stream
      controller.close();
    },
  });

  return new NextResponse(stream);
}

export const runtime = "edge";
