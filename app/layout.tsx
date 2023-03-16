import "focus-visible";
import "./globals.css";

import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { Inter, Space_Grotesk } from "next/font/google";

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
              href="#"
              className="flex items-center -my-0.5 -mx-2 py-0.5 px-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              <GlobeAltIcon className="h-5 w-5 mr-2 -ml-2" aria-hidden="true" />
              recommend.domains
            </a>
            <a
              href="https://github.com/gregives/recommend.domains"
              className="text-indigo-600 bg-gradient-to-br from-indigo-50 to-indigo-100 -my-0.5 -mx-2 py-0.5 px-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              Star on GitHub
            </a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
