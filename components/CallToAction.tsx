export function CallToAction({ theme }: { theme: "normal" | "shopify" }) {
  return (
    <div className="mt-16 mb-24 -mx-6 sm:mx-0 lg:-mx-16">
      <div className="relative isolate overflow-hidden bg-primary-600 px-6 py-24 text-center shadow-2xl shadow-primary-600/50 sm:rounded-3xl sm:px-16">
        <h2 className="mx-auto text-white max-w-2xl text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
          Find your perfect domain name today
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-primary-100">
          Describe your {theme === "shopify" ? "business" : "project"} in a few
          words and we’ll generate a list of domain names for you to choose
          from! Find your perfect domain name today{" "}
          <strong className="font-semibold">for free</strong>.
        </p>
        <a
          href={theme === "shopify" ? "/shopify" : "/"}
          className="inline-flex mt-12 bg-white py-2.5 px-5 md:py-4 md:px-6 md:text-xl font-display font-medium rounded-xl text-primary-800 shadow-lg shadow-white/30 hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Get started
        </a>
        <svg
          viewBox="0 0 1024 1024"
          className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
          aria-hidden="true"
        >
          <circle
            cx={512}
            cy={512}
            r={512}
            fill="url(#827591b1-ce8c-4110-b064-7cb85a0b1217)"
          />
          <defs>
            <radialGradient id="827591b1-ce8c-4110-b064-7cb85a0b1217">
              <stop stopColor="var(--color-primary-100)" />
              <stop offset={1} stopColor="var(--color-primary-100)" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
