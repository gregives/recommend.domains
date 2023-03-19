import { NextRequest, NextResponse } from "next/server";

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

  let { description }: { description: string } = await request.json();

  // Make sure description is 100 characters or less
  description = description.slice(0, 100);

  const stream = new ReadableStream({
    async start(controller) {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            stream: true,
            messages: [
              {
                role: "user",
                content: `List some suitable domain names for my project in CSV format. Description of my project: "${description}"`,
              },
            ],
          }),
        }
      );

      if (response.body === null) {
        return;
      }

      const reader = response.body.getReader();

      let completeResponse = "";
      const domainNamesFound: string[] = [];
      const pendingPromises: Promise<void>[] = [];

      readWhile: while (true) {
        const { value, done } = await reader.read();

        if (done) {
          break readWhile;
        }

        const lines = textDecoder.decode(value).split(/\n+/);

        for (let data of lines) {
          data = data.trim().replace(/^data: /, "");

          if (data.includes("[DONE]")) {
            break readWhile;
          }

          try {
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
                  domainName.length < 25 &&
                  !domainNamesFound.includes(domainName)
              );

            domainNamesFound.push(...newDomainNames);

            console.log(newDomainNames);

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
              }
            );

            pendingPromises.push(pendingPromise);
          } catch {
            // Ignore lines that we fail to parse
          }
        }
      }

      // Wait for all availability checks to finish
      await Promise.all(pendingPromises);

      // Wait a bit more for all the chunks to send
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Close the stream
      controller.close();
    },
  });

  return new NextResponse(stream);
}
