import { Footer } from "@/components/Footer";
import { notFound } from "next/navigation";

export default async function Post({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  try {
    const Content = (await import(`./markdown/${params.slug}.mdx`)).default;

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
