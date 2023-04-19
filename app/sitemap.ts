import { MetadataRoute } from "next";

export const articles = [
  "10-tips-for-a-killer-domain-name",
  "find-the-perfect-domain-name",
  "how-to-brainstorm-domain-names",
  "how-to-choose-the-right-domain-name-extension",
  "the-dos-and-donts-of-choosing-a-domain-name",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: "https://recommend.domains",
      lastModified: new Date(),
    },
    {
      url: "https://recommend.domains/shopify",
      lastModified: new Date(),
    },
    ...articles.map((slug) => ({
      url: `https://recommend.domains/blog/${slug}`,
      lastModified: new Date(),
    })),
  ];
}
