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

console.debug(tlds);

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
  const { description, limit = 20 } = await request.json();

  console.debug(description);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `List ${limit} suitable domain names for my website, no longer than 20 characters each. Description of my website: "${description}"`,
      },
    ],
  });

  console.debug(completion);

  const domainNames: string[] = [];

  for (const choice of completion.data.choices) {
    domainNames.push(
      ...[...(choice.message?.content.matchAll(domainRegex) ?? [])]
        .map(([domainName]) => domainName.toLowerCase())
        .filter((domainName) => domainName.length < 25)
    );
  }

  console.debug(domainNames);

  domainNamesToCheck.push(...domainNames);

  // Wait for the next domain name availability check to start
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Wait until the check has finished
  await currentDomainNameAvailabilityCheck;

  console.debug(domainNamesToCheck);
  console.debug(domainNamesThatHaveBeenChecked);

  const availableDomains = domainNames
    .map((domainName) => domainNamesThatHaveBeenChecked[domainName])
    .filter(
      (domain) => domain !== undefined && domain.available && domain.definitive
    );

  console.debug(availableDomains);

  return NextResponse.json(availableDomains);
}
