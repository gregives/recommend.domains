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

async function flush() {
  const logsToSend = logs.splice(0, logs.length);

  if (logsToSend.length === 0) {
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

export const log = {
  flush,
  queue,
};
