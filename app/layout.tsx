import "focus-visible";
import "./globals.css";

import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { Analytics } from "@vercel/analytics/react";
import { Inter, Space_Grotesk } from "next/font/google";
import { useId } from "react";

const inter = Inter({
  variable: "--font-inter",
  display: "swap",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  display: "swap",
  subsets: ["latin"],
});

export const metadata = {
  title: "Recommend Domains",
  description:
    "Use artificial intelligence to find the perfect domain name for your next project.",
  openGraph: {
    title: "Recommend Domains",
    description:
      "Use artificial intelligence to find the perfect domain name for your next project.",
    url: "https://recommend.domains",
    siteName: "Recommend Domains",
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
    title: "Recommend Domains",
    description:
      "Use artificial intelligence to find the perfect domain name for your next project.",
    images: ["https://recommend.domains/opengraph.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gradientId = useId();

  return (
    <html
      lang="en"
      className={`scroll-smooth ${inter.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="text-base md:text-lg">
        <header className="text-sm md:text-base absolute inset-x-0 top-0 z-50">
          <nav
            className="flex items-center justify-between p-6 lg:px-8"
            aria-label="Global"
          >
            <a
              href="/"
              className="flex items-center -my-0.5 -mx-2 py-0.5 px-2 rounded-full focus:outline-none focus-visible:outline-2 focus-visible:outline-indigo-600"
            >
              <GlobeAltIcon className="h-5 w-5 mr-2 -ml-2" aria-hidden="true" />
              recommend.domains
            </a>
            <a
              href="https://github.com/gregives/recommend.domains"
              className="text-indigo-600 bg-gradient-to-br from-indigo-50 to-indigo-100 -my-0.5 -mx-2 py-0.5 px-2 rounded-full focus:outline-none focus-visible:outline-2 focus-visible:outline-indigo-600"
            >
              Star on GitHub
            </a>
          </nav>
        </header>
        <div className="absolute -z-10 inset-x-0 -top-40 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <svg
            className="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
            viewBox="0 0 1155 678"
          >
            <path
              fill={`url(#${gradientId})`}
              fillOpacity=".3"
              d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
            />
            <defs>
              <linearGradient
                id={gradientId}
                x1="1155.49"
                x2="-78.208"
                y1=".177"
                y2="474.645"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#9089FC" />
                <stop offset={1} stopColor="#FF80B5" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
