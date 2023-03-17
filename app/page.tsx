"use client";

import { useForm } from "react-hook-form";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import type { Domain } from "./api/domains/route";
import Image from "next/image";
import {
  ArrowPathIcon,
  CreditCardIcon,
  DocumentCheckIcon,
  ShoppingCartIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { affiliates } from "@/constants/affiliates";

const features = [
  {
    name: "Available domains only",
    description:
      "We check with GoDaddy to make sure that all of the domain names we suggest to you are available. We don’t want to waste your time.",
    icon: DocumentCheckIcon,
  },
  {
    name: "Multiple registrars",
    description:
      "We don’t expect you to use the same registrar as we do. That’s why we give you the option to buy your perfect domain name from Namecheap, Domain.com, Google Domains, GoDaddy and bluehost.",
    icon: ShoppingCartIcon,
  },
  {
    name: "No credit card required",
    description:
      "Recommend Domains is 100% free and always will be. If you'd like to support the site, starring the GitHub repository would be very much appreciated!",
    icon: CreditCardIcon,
  },
];

function GitHubIcon(properties: JSX.IntrinsicElements["svg"]) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...properties}>
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function TwitterIcon(properties: JSX.IntrinsicElements["svg"]) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...properties}>
      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
    </svg>
  );
}

export default function Home() {
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [domains, setDomains] = useState<Domain[]>([]);

  const [slideOverOpen, setSlideOverOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain>();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      description: "",
    },
  });

  const loadInitialDomains = handleSubmit(async ({ description }) => {
    setLoadingInitial(true);

    const newDomains: Domain[] = await fetch("/api/domains", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description,
      }),
    }).then((response) => response.json());

    setLoadingInitial(false);
    setDomains(newDomains);

    // Wait for results section to appear
    setTimeout(() => {
      const results = document.getElementById("results");

      if (results !== null) {
        results.scrollIntoView();
      }
    }, 100);
  });

  const loadMoreDomains = handleSubmit(async ({ description }) => {
    setLoadingMore(true);

    const newDomains: Domain[] = await fetch("/api/domains", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description,
      }),
    }).then((response) => response.json());

    setLoadingMore(false);
    setDomains([
      ...domains,
      ...newDomains.filter(
        ({ domain: newDomain }) =>
          domains.find(({ domain }) => domain === newDomain) === undefined
      ),
    ]);
  });

  return (
    <main>
      <section className="relative px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <svg
            className="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
            viewBox="0 0 1155 678"
          >
            <path
              fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
              fillOpacity=".3"
              d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
            />
            <defs>
              <linearGradient
                id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
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
        <div className="mx-auto max-w-4xl -mt-16 py-32 sm:py-48 lg:py-56">
          <div className="flex flex-col items-center text-center">
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <div className="relative rounded-full py-1 px-3 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                More than 10,000 domain names generated
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl font-display">
              Find the{" "}
              <span className="text-indigo-600">perfect domain name</span> for
              your next project
            </h1>
            <p className="max-w-3xl mt-10 mb-16 leading-7 md:leading-8 text-gray-600">
              Describe your website in a few words and we’ll generate a list of
              domain names for you to choose from! Find your perfect domain name
              today <strong className="font-semibold">for free</strong>.
            </p>
            <form className="w-full">
              <label htmlFor="description" className="sr-only">
                Description
              </label>
              <input
                id="description"
                className="block w-full px-4 py-3 md:px-6 md:py-4 rounded-xl border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                maxLength={100}
                placeholder="Website to sell handmade jewelry"
                {...register("description", {
                  maxLength: 100,
                })}
              />
              <button
                type="button"
                className="flex justify-center items-center shadow-xl shadow-indigo-600/30 w-full mt-8 py-2.5 px-5 md:py-4 md:px-6 md:text-xl font-display text-white rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 enabled:hover:from-purple-400 enabled:hover:to-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600 disabled:opacity-80"
                disabled={loadingInitial}
                onClick={loadInitialDomains}
              >
                {loadingInitial && (
                  <ArrowPathIcon className="animate-spin mr-8 w-[1.2em] h-[1.2em]" />
                )}
                Find my perfect domain name
              </button>
            </form>
          </div>
        </div>
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <svg
            className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
            viewBox="0 0 1155 678"
          >
            <path
              fill="url(#ecb5b0c9-546c-4772-8c71-4d3f06d544bc)"
              fillOpacity=".3"
              d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
            />
            <defs>
              <linearGradient
                id="ecb5b0c9-546c-4772-8c71-4d3f06d544bc"
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
      </section>
      {domains.length > 0 && (
        <section id="results" className="relative px-6 lg:px-8 bg-indigo-600">
          <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
            <ul role="list" className="space-y-6">
              {domains.map((domain) => (
                <li
                  key={domain.domain}
                  className="rounded-xl bg-white px-4 py-3 md:px-6 md:py-4 shadow flex items-stretch sm:items-center"
                >
                  <div className="flex-1 flex flex-col sm:flex-row justify-between mr-4">
                    <span>{domain.domain}</span>
                    <span className="text-gray-400 sm:text-gray-500">
                      {domain.price !== undefined &&
                        `$${domain.price / 1000000}`}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="-my-1 -mr-2 md:-my-2 md:-mr-4 py-2 px-4 font-display rounded-md bg-gradient-to-br from-indigo-500 to-indigo-600 enabled:hover:from-indigo-400 enabled:hover:to-indigo-500 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => {
                      setSelectedDomain(domain);
                      setSlideOverOpen(true);
                    }}
                  >
                    Buy
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="flex justify-center items-center w-full mt-6 py-2.5 px-5 md:py-4 md:px-6 md:text-xl font-display text-white rounded-xl bg-gradient-to-br from-white/10 to-white/20 enabled:hover:from-white/20 enabled:hover:to-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-600 focus-visible:ring-white disabled:opacity-80"
              disabled={loadingMore}
              onClick={loadMoreDomains}
            >
              {loadingMore && (
                <ArrowPathIcon className="animate-spin mr-8 w-[1.2em] h-[1.2em]" />
              )}
              Generate more
            </button>
          </div>
        </section>
      )}
      <section className="bg-gray-900 py-32 sm:py-48 lg:py-56">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Generated by artificial intelligence
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              We use{" "}
              <a
                className="text-indigo-400"
                href="https://openai.com/blog/chatgpt"
                target="_blank"
              >
                ChatGPT
              </a>{" "}
              to generate the perfect domain name for your website. We then
              check the domain name with{" "}
              <a
                className="text-indigo-400"
                href="https://www.godaddy.com/en-uk"
                target="_blank"
              >
                GoDaddy
              </a>{" "}
              to make sure that it is available.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                    <feature.icon
                      className="h-5 w-5 flex-none text-indigo-400"
                      aria-hidden="true"
                    />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto text-base leading-7 text-gray-300">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
      <footer className="bg-gray-900" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mx-auto max-w-7xl px-6 pb-8 lg:pb-16 lg:px-8">
          <div className="border-t border-white/10 pt-8 flex items-center justify-between">
            <p className="text-xs leading-5 text-gray-400">
              &copy; {new Date().getFullYear()} Greg Ives. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="https://github.com/gregives/recommend.domains"
                className="text-gray-500 hover:text-gray-400"
              >
                <span className="sr-only">GitHub</span>
                <GitHubIcon className="h-6 w-6" aria-hidden="true" />
              </a>
              <a
                href="https://twitter.com/gregiv_es"
                className="text-gray-500 hover:text-gray-400"
              >
                <span className="sr-only">Twitter</span>
                <TwitterIcon className="h-6 w-6" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </footer>
      <Transition.Root show={slideOverOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setSlideOverOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-80 transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-500"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-500"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4">
                        <button
                          type="button"
                          className="rounded-md text-gray-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                          onClick={() => setSlideOverOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <Dialog.Title className="leading-6 text-gray-900">
                          {selectedDomain?.domain}
                        </Dialog.Title>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6 space-y-4">
                        <p className="text-sm text-gray-400 mb-8">
                          Some of these are affiliate links, which means we may
                          earn a commission at no additional cost to you. It
                          helps us to keep the site running!
                        </p>
                        {affiliates.map((affiliate) => (
                          <a
                            key={affiliate.id}
                            target="_blank"
                            href={`${affiliate.href}${selectedDomain?.domain}`}
                            className={`block bg-gradient-to-br ${affiliate.bg} rounded-xl p-8 h-28`}
                            onClick={(event) => {
                              // @ts-ignore
                              event.target.href = `/api/redirect?href=${affiliate.href}${selectedDomain?.domain}`;
                            }}
                          >
                            <span className="sr-only">{affiliate.name}</span>
                            <Image
                              className="w-full h-full object-contain pointer-events-none"
                              alt=""
                              src={affiliate.logo}
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </main>
  );
}
