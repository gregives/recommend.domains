import { Features } from "@/components/Features";
import { Blog } from "@/components/Blog";
import { Footer } from "@/components/Footer";
import { Main } from "@/components/Main";

export default function Home() {
  return (
    <main>
      <Main theme="normal" />
      <Features theme="normal" />
      <Blog theme="normal" />
      <Footer />
    </main>
  );
}
