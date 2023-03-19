"use client";

import { useForm } from "react-hook-form";
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import type { Domain } from "./api/domains/route";
import Image from "next/image";
import { ArrowPathIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { affiliates } from "@/constants/affiliates";
import { useDynamicPlaceholder } from "@/components/useDynamicPlaceholder";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";

const textDecoder = new TextDecoder();

export default function Home() {
  const domains = useRef<Domain[]>([]);
  const [, setDomains] = useState<Domain[]>([]);

  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [slideOverOpen, setSlideOverOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain>();

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      description: "",
    },
  });

  useDynamicPlaceholder("description", watch("description").length > 0);

  const loadDomains = async (description: string) => {
    const response = await fetch("/api/domains", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description,
      }),
    });

    if (response.body === null) {
      return;
    }

    const reader = response.body.getReader();
    let completeResponse = "";

    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      completeResponse += textDecoder.decode(value);

      // Domains are separated by |
      for (const text of completeResponse.split("|")) {
        try {
          const newDomain = JSON.parse(text);

          if (
            !domains.current.find(({ domain }) => domain === newDomain.domain)
          ) {
            if (domains.current.length === 0) {
              setTimeout(() => {
                const results = document.getElementById("results");
                if (results !== null) {
                  window.scrollTo(0, results.offsetTop - 32);
                }
              }, 100);
            }

            domains.current = [...domains.current, newDomain];
          }

          // This forces the component to render
          setDomains(domains.current);
        } catch {
          // Only streamed part of a chunk
        }
      }
    }
  };

  const loadInitialDomains = handleSubmit(async ({ description }) => {
    if (domains.current.length > 0) {
      setTimeout(() => {
        const form = document.getElementById("form");
        if (form !== null) {
          window.scrollTo(0, form.offsetTop);
        }
      }, 100);
    }
    domains.current = [];
    setLoadingInitial(true);
    await loadDomains(description);
    setLoadingInitial(false);
  });

  const loadMoreDomains = handleSubmit(async ({ description }) => {
    setLoadingMore(true);
    await loadDomains(description);
    setLoadingMore(false);
  });

  return (
    <main>
      <div>
        <section className="relative px-6 pt-14 lg:px-8">
          <div className="absolute z-10 inset-x-0 -top-40 transform-gpu overflow-hidden blur-3xl sm:-top-80">
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
                Describe your project in a few words and we’ll generate a list
                of domain names for you to choose from! Find your perfect domain
                name today <strong className="font-semibold">for free</strong>.
              </p>
            </div>
          </div>
        </section>
        <section
          id="form"
          className={`${
            domains.current.length === 0 ? "relative" : "sticky"
          } z-20 top-0 pt-5 px-6 lg:px-8 -mt-36 sm:-mt-52 lg:-mt-60 mb-6`}
        >
          <form className="mx-auto max-w-4xl" onSubmit={loadInitialDomains}>
            <label htmlFor="description" className="sr-only">
              Description
            </label>
            <input
              id="description"
              className="block w-full px-4 py-3 md:px-6 md:py-4 rounded-xl border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              maxLength={100}
              {...register("description", {
                maxLength: 100,
              })}
            />
            <button
              type="submit"
              className="flex justify-center items-center shadow-xl shadow-indigo-600/30 w-full mt-4 py-2.5 px-5 md:py-4 md:px-6 md:text-xl font-display text-white rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 enabled:hover:from-purple-400 enabled:hover:to-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600 disabled:opacity-80"
              disabled={loadingInitial}
            >
              {loadingInitial && (
                <ArrowPathIcon className="animate-spin mr-4 w-[1.2em] h-[1.2em]" />
              )}
              Find my perfect domain name
            </button>
          </form>
        </section>
        <div
          className={`${
            domains.current.length === 0 ? "relative" : "sticky"
          } top-0 -mt-4 sm:mt-8 md:mt-4 lg:mt-12 h-36 md:h-44 bg-white shadow-xl shadow-indigo-900/30`}
        ></div>
        {domains.current.length > 0 && (
          <section id="results" className="px-6 lg:px-8 bg-indigo-600">
            <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
              <ul role="list" className="space-y-6">
                {domains.current.map((domain) => (
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
                  <ArrowPathIcon className="animate-spin mr-4 w-[1.2em] h-[1.2em]" />
                )}
                Generate more
              </button>
            </div>
          </section>
        )}
      </div>
      <Features />
      <Footer />
      <Transition.Root show={slideOverOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
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
