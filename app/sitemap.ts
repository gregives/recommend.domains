import { MetadataRoute } from "next";

export const articles = [
  "10-tips-for-a-killer-domain-name",
  "find-the-perfect-domain-name",
  "how-to-brainstorm-domain-names",
  "how-to-choose-the-right-domain-name-extension",
  "the-benefits-of-using-a-shopify-domain-name-generator",
  "the-dos-and-donts-of-choosing-a-domain-name",
  "how-to-optimize-your-shopify-domain-name-for-seo",
  "how-to-use-a-free-domain-name-generator",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: "https://www.recommend.domains",
      lastModified: new Date(),
    },
    {
      url: "https://www.recommend.domains/shopify",
      lastModified: new Date(),
    },
    ...articles.map((slug) => ({
      url: `https://www.recommend.domains/blog/${slug}`,
      lastModified: new Date(),
    })),
  ];
}
