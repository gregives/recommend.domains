import { Features } from "@/components/Features";
import { BlogPreview } from "@/components/BlogPreview";
import { Footer } from "@/components/Footer";
import { Main } from "@/components/Main";
import { log } from "./api/log";

export default async function Home() {
  const numberOfDomainsGenerated = await log.count();

  return (
    <main>
      <Main
        theme="normal"
        numberOfDomainsGenerated={numberOfDomainsGenerated}
      />
      <Features theme="normal" />
      <BlogPreview theme="normal" />
      <Footer />
    </main>
  );
}
