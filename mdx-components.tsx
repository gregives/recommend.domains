import type { MDXComponents } from "mdx/types";
import { CallToAction } from "@/components/CallToAction";
import { Metadata } from "@/components/Metadata";

export function Anchor(properties: JSX.IntrinsicElements["a"]) {
  return (
    <a
      className="text-indigo-600 rounded focus:outline-none focus-visible:outline-2 focus-visible:outline-indigo-600"
      {...properties}
    />
  );
}

export function Heading1(properties: JSX.IntrinsicElements["h1"]) {
  return (
    <h1
      className="text-4xl leading-snug md:text-5xl md:leading-snug lg:text-6xl lg:leading-snug font-display font-bold tracking-tight text-gray-900 mb-16 lg:-mx-16 md:text-center"
      {...properties}
    />
  );
}

export function Heading2(properties: JSX.IntrinsicElements["h2"]) {
  return (
    <h2
      className="text-2xl font-bold tracking-tight text-gray-900 mt-8 mb-6"
      {...properties}
    />
  );
}

export function Heading3(properties: JSX.IntrinsicElements["h2"]) {
  return (
    <h3 className="text-lg font-bold text-gray-900 mt-6 mb-4" {...properties} />
  );
}

export function Paragraph(properties: JSX.IntrinsicElements["p"]) {
  return <p className="mb-6" {...properties} />;
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: Anchor,
    h1: Heading1,
    h2: Heading2,
    h3: Heading3,
    p: Paragraph,
    CallToAction,
    Metadata,
    ...components,
  };
}
