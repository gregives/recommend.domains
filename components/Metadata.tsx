import { Heading1, Paragraph } from "@/mdx-components";

export type Metadata = {
  title: string;
  description: string;
  author: string;
  date: string;
};

export function Metadata({ metadata }: { metadata: Metadata }) {
  return (
    <>
      <time
        dateTime={new Date(metadata.date).toISOString()}
        className="block mb-8 text-sm md:text-base text-gray-500 md:text-center"
      >
        {new Date(metadata.date).toLocaleDateString("en-GB", {
          dateStyle: "long",
        })}
      </time>
      <Heading1 className="text-4xl leading-snug md:text-5xl md:leading-snug lg:text-6xl lg:leading-snug font-display font-bold tracking-tight text-gray-900 mb-16 lg:-mx-16 md:text-center">
        {metadata.title}
      </Heading1>
      <Paragraph className="mb-6">{metadata.description}</Paragraph>
    </>
  );
}
