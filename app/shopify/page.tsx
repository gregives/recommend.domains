import { Features } from "@/components/Features";
import { Blog } from "@/components/Blog";
import { Footer } from "@/components/Footer";
import { Main } from "@/components/Main";

export const metadata = {
  title: "Shopify Domain Name Generator",
  description:
    "Use artificial intelligence to find the perfect domain name for your Shopify store.",
  openGraph: {
    title: "Shopify Domain Name Generator",
    description:
      "Use artificial intelligence to find the perfect domain name for your Shopify store.",
    url: "https://recommend.domains",
    siteName: "Shopify Domain Name Generator",
    images: [
      {
        url: "https://recommend.domains/opengraph.jpg",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopify Domain Name Generator",
    description:
      "Use artificial intelligence to find the perfect domain name for your Shopify store.",
    images: ["https://recommend.domains/opengraph.jpg"],
  },
};

export default function Shopify() {
  return (
    <main>
      <Main version="shopify" />
      <Features version="shopify" />
      <Blog />
      <Footer />
    </main>
  );
}
