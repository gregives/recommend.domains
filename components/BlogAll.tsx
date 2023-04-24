import { articles as slugs } from "@/app/sitemap";
import Image from "next/image";

export async function BlogAll({
  theme,
}: {
  theme: "normal" | "shopify";
  // @ts-expect-error
}): JSX.Element {
  const articles = (
    await Promise.all(slugs.map((slug) => import(`@/blog/${slug}.mdx`)))
  )
    .map(({ metadata }, index) => ({
      ...metadata,
      slug: slugs[index],
    }))
    .filter(({ slug }) => theme === "shopify" || !slug.includes("shopify"))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-display font-bold tracking-tight text-gray-900 sm:text-4xl">
            We are domain experts
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Learn how to find the perfect domain name for your website.
          </p>
          <div className="mt-10 space-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16">
            {articles.map((article) => (
              <article key={article.slug}>
                <div className="group relative max-w-xl">
                  <time
                    dateTime={new Date(article.date).toISOString()}
                    className="block text-sm leading-6 text-gray-600"
                  >
                    {new Date(article.date).toLocaleDateString("en-GB", {
                      dateStyle: "long",
                    })}
                  </time>
                  <h2 className="mt-2 text-lg font-display font-semibold text-gray-900 group-hover:text-gray-600">
                    <a
                      href={`/blog/${article.slug}`}
                      className="rounded-md focus:outline-none focus-visible:outline-2 focus-visible:outline-primary-600 dark:focus-visible:outline-primary-200"
                    >
                      <span className="absolute inset-0" />
                      {article.title}
                    </a>
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-gray-600">
                    {article.description}
                  </p>
                </div>
                <div className="mt-4 flex">
                  <a
                    href={`https://github.com/${article.author}`}
                    className="relative flex gap-x-2.5 text-sm font-semibold leading-6 text-gray-900 rounded-full focus:outline-none focus-visible:outline-2 focus-visible:outline-primary-600 dark:focus-visible:outline-primary-200"
                  >
                    <Image
                      src={`https://github.com/${article.author}.png?size=24`}
                      alt=""
                      className="h-6 w-6 flex-none rounded-full bg-gray-50"
                      width={24}
                      height={24}
                    />
                    {article.author}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
