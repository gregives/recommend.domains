import { Features } from "@/components/Features";
import { BlogPreview } from "@/components/BlogPreview";
import { Footer } from "@/components/Footer";
import { Main } from "@/components/Main";

export default function Home() {
  return (
    <main>
      <Main theme="normal" />
      <Features theme="normal" />
      <BlogPreview theme="normal" />
      <Footer />
    </main>
  );
}
