import { NextRequest, NextResponse } from "next/server";

export type Domain = {
  available: boolean;
  currency: string;
  definitive: boolean;
  domain: string;
  period?: number;
  price?: number;
};

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

export default async function domains(request: NextRequest) {
  let { description } = await request.json();

  // Make sure description is 100 characters or less
  description = description.slice(0, 100);

  const completion = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `List some suitable domain names for my project in CSV format. Description of my project: "${description}"`,
        },
      ],
    }),
  }).then((response) => response.json());

  const domainNames: string[] = [];

  for (const choice of completion.choices) {
    domainNames.push(
      ...[...(choice.message?.content.matchAll(domainRegex) ?? [])]
        .map(([domainName]) => domainName.toLowerCase())
        .filter((domainName) => domainName.length < 25)
    );
  }

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

export const runtime = "edge";
