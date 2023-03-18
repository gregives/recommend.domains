import { NextRequest, NextResponse } from "next/server";
import { Readable } from "node:stream";
import { Configuration, OpenAIApi } from "openai";

export type Domain = {
  available: boolean;
  currency: string;
  definitive: boolean;
  domain: string;
  period?: number;
  price?: number;
};

const domainNamesToCheck: string[] = [];
const domainNamesThatHaveBeenChecked: Record<string, Domain> = {};

async function checkDomainNamesAvailability() {
  if (domainNamesToCheck.length === 0) {
    return;
  }

  const availability = await fetch(
    `${process.env.GODADDY_URL}/v1/domains/available`,
    {
      method: "POST",
      headers: {
        Authorization: `sso-key ${process.env.GODADDY_API_KEY}:${process.env.GODADDY_API_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        domainNamesToCheck.splice(0, domainNamesToCheck.length)
      ),
    }
  ).then((response) => response.json());

  for (const domain of availability.domains) {
    domainNamesThatHaveBeenChecked[domain.domain] = domain;
  }
}

let currentDomainNameAvailabilityCheck: Promise<void>;
setInterval(() => {
  currentDomainNameAvailabilityCheck = checkDomainNamesAvailability();
}, 1000);

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

const tlds: { name: string; type: "COUNTRY_CODE" | "GENERIC" }[] = await fetch(
  `${process.env.GODADDY_URL}/v1/domains/tlds`,
  {
    headers: {
      Authorization: `sso-key ${process.env.GODADDY_API_KEY}:${process.env.GODADDY_API_SECRET}`,
    },
  }
).then((response) => response.json());

const domainRegex = new RegExp(
  `[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\\.(?:${tlds
    .map(({ name }) => name.replace(/\./g, "\\."))
    .join("|")})`,
  "gi"
);

const textEncoder = new TextEncoder();

export async function POST(request: NextRequest) {
  let { description }: { description: string } = await request.json();

  // Make sure description is 100 characters or less
  description = description.slice(0, 100);

  const stream = new ReadableStream({
    async start(controller) {
      const response = await openai.createChatCompletion(
        {
          model: "gpt-3.5-turbo",
          stream: true,
          messages: [
            {
              role: "user",
              content: `List some suitable domain names for my project in CSV format. Description of my project: "${description}"`,
            },
          ],
        },
        {
          responseType: "stream",
        }
      );

      const stream = response.data as unknown as Readable;

      let completeResponse = "";
      const domainNamesFound: string[] = [];

      stream.on("data", async (chunk) => {
        try {
          const data = chunk
            .toString()
            .trim()
            .replace(/^data: /, "");

          if (data.includes("[DONE]")) {
            // Wait until all domain availability checks have finished
            await new Promise((resolve) => setTimeout(resolve, 2000));

            controller.close();
            return;
          }

          const [choice] = JSON.parse(data).choices;

          // Add delta to complete response
          completeResponse += choice.delta.content;

          // Find new domain names in the complete response
          const newDomainNames = [
            ...(completeResponse.matchAll(domainRegex) ?? []),
          ]
            .map(([domainName]) => domainName.toLowerCase())
            .filter(
              (domainName) =>
                domainName.length < 25 && !domainNamesFound.includes(domainName)
            );

          domainNamesFound.push(...newDomainNames);
          domainNamesToCheck.push(...newDomainNames);

          // Wait for the next domain name availability check to start
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Wait until the check has finished
          await currentDomainNameAvailabilityCheck;

          const availableDomains = newDomainNames
            .map((domainName) => domainNamesThatHaveBeenChecked[domainName])
            .filter((domain) => domain !== undefined && domain.available);

          if (availableDomains.length > 0) {
            console.log(availableDomains);
          }

          controller.enqueue(
            textEncoder.encode(JSON.stringify(availableDomains) + ",")
          );
        } catch {
          // This usually happens at the end of the stream
        }
      });

      stream.on("error", (error) => {
        controller.error(error);
      });
    },
  });

  return new NextResponse(stream);
}
