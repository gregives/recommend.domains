import { articles as slugs } from "@/sitemap";
import Image from "next/image";
import Link from "next/link";

export async function Blog() {
  const [featuredArticle, ...articles] = (
    await Promise.all(slugs.map((slug) => import(`@/blog/${slug}.mdx`)))
  )
    .map(({ metadata }, index) => ({
      ...metadata,
      slug: slugs[index],
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-12 px-6 sm:gap-y-16 lg:grid-cols-2 lg:px-8">
        <article className="mx-auto w-full max-w-2xl lg:mx-0 lg:max-w-lg">
          <time
            dateTime={new Date(featuredArticle.date).toISOString()}
            className="block text-sm leading-6 text-gray-600"
          >
            {new Date(featuredArticle.date).toLocaleDateString("en-GB")}
          </time>
          <h2 className="mt-4 text-3xl font-display font-bold tracking-tight text-gray-900 sm:text-4xl">
            {featuredArticle.title}
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            {featuredArticle.description}
          </p>
          <div className="mt-4 flex flex-col justify-between gap-6 sm:mt-8 sm:flex-row-reverse sm:gap-8 lg:mt-4 lg:flex-col">
            <div className="flex">
              <Link
                href={`/blog/${featuredArticle.slug}`}
                className="text-sm font-semibold leading-6 text-indigo-600 rounded-full focus:outline-none focus-visible:outline-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-200"
              >
                Continue reading <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
            <div className="flex lg:border-t lg:border-gray-900/10 lg:pt-8">
              <a
                href={`https://github.com/${featuredArticle.author}`}
                className="flex gap-x-2.5 text-sm font-semibold leading-6 text-gray-900 rounded-full focus:outline-none focus-visible:outline-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-200"
              >
                <Image
                  src={`https://github.com/${featuredArticle.author}.png?size=24`}
                  alt=""
                  className="h-6 w-6 flex-none rounded-full bg-gray-50"
                  width={24}
                  height={24}
                />
                {featuredArticle.author}
              </a>
            </div>
          </div>
        </article>
        <div className="mx-auto w-full max-w-2xl border-t border-gray-900/10 pt-12 sm:pt-16 lg:mx-0 lg:max-w-none lg:border-t-0 lg:pt-0">
          <div className="-my-12 divide-y divide-gray-900/10">
            {articles.map((article) => (
              <article key={article.slug} className="py-12">
                <div className="group relative max-w-xl">
                  <time
                    dateTime={new Date(article.date).toISOString()}
                    className="block text-sm leading-6 text-gray-600"
                  >
                    {new Date(article.date).toLocaleDateString("en-GB")}
                  </time>
                  <h2 className="mt-2 text-lg font-display font-semibold text-gray-900 group-hover:text-gray-600">
                    <a
                      href={`/blog/${article.slug}`}
                      className="rounded-md focus:outline-none focus-visible:outline-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-200"
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
                    className="relative flex gap-x-2.5 text-sm font-semibold leading-6 text-gray-900 rounded-full focus:outline-none focus-visible:outline-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-200"
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
