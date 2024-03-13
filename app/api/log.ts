import { stringify } from "csv-stringify/sync";

const GIST_ID = "c3b6755871063529ad9d3067a2751462";

type Log = {
  description: string;
  suggestion: string;
  options: string;
  timestamp: number;
};

const logs: Log[] = [];

function queue(logsToQueue: Omit<Log, "timestamp">[]) {
  logs.push(
    ...logsToQueue.map((log) => ({
      ...log,
      timestamp: Date.now(),
    }))
  );
}

let numberOfDomainsGenerated = 0;

async function flush() {
  const logsToSend = logs.splice(0, logs.length);

  if (logsToSend.length === 0) {
    return;
  }

  if (process.env.GITHUB_TOKEN === undefined) {
    // Used as a fallback in case process.env.GITHUB_TOKEN is undefined
    numberOfDomainsGenerated += 1;
    return;
  }

  const gist = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
  }).then((response) => response.json());

  const filename =
    new Date(logsToSend[0].timestamp).toISOString().slice(0, 10) + ".csv";
  const file = gist.files[filename];

  const content =
    (file === undefined
      ? "Description,Suggestion,Timestamp,Options\n"
      : file.content) +
    stringify(
      logsToSend.map(({ description, suggestion, timestamp, options }) => [
        description,
        suggestion,
        timestamp,
        options,
      ])
    );

  await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    method: "PATCH",
    cache: "no-store",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({
      files: {
        [filename]: {
          content,
        },
      },
    }),
  });
}

async function count() {
  if (process.env.GITHUB_TOKEN === undefined) {
    return numberOfDomainsGenerated;
  }

  const gist = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
    next: {
      revalidate: 3600,
    },
  }).then((response) => response.json());

  numberOfDomainsGenerated = 10000;
  for (const file of Object.values(gist.files)) {
    // @ts-ignore
    numberOfDomainsGenerated += file.content.split("\n").length - 1;
  }

  return numberOfDomainsGenerated;
}

export const log = {
  count,
  flush,
  queue,
};
