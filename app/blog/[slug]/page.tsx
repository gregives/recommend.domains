import { Footer } from "@/components/Footer";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  try {
    const { metadata } = await import(`@/blog/${params.slug}.mdx`);

    return {
      title: metadata.title,
      description: metadata.description,
      openGraph: {
        title: metadata.title,
        description: metadata.description,
      },
      twitter: {
        title: metadata.title,
        description: metadata.description,
      },
    };
  } catch {
    return {};
  }
}

export default async function Article({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  try {
    const { default: Content } = await import(`@/blog/${params.slug}.mdx`);

    return (
      <main>
        <div className="px-6 pb-32 pt-40 lg:px-8">
          <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
            <Content />
          </div>
        </div>
        <Footer />
      </main>
    );
  } catch {
    notFound();
  }
}
