import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

export type Domain = {
  available: boolean;
  currency: string;
  definitive: boolean;
  domain: string;
  period?: number;
  price?: number;
};

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
    .map(({ name }) => name.replaceAll(".", "\\."))
    .join("|")})`,
  "gi"
);

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

export async function POST(request: Request) {
  const { description } = await request.json();

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `List some good domain names for my website. Description of my website: "${description}"`,
      },
    ],
  });

  // Pick first choice from completion
  const [choice] = completion.data.choices;

  const domainNames = [
    ...(choice.message?.content.matchAll(domainRegex) ?? []),
  ].map(([domainName]) => domainName.toLowerCase());

  domainNamesToCheck.push(...domainNames);

  // Wait for the next domain name availability check to start
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Wait until the check has finished
  await currentDomainNameAvailabilityCheck;

  const availableDomains = domainNames
    .map((domainName) => domainNamesThatHaveBeenChecked[domainName])
    .filter((domain) => domain !== undefined && domain.available);

  return NextResponse.json(availableDomains);
}