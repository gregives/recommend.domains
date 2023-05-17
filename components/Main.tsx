"use client";

import { useForm } from "react-hook-form";
import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import type { Domain } from "@/app/api/domains/route";
import Image from "next/image";
import {
  ArrowPathIcon,
  XMarkIcon,
  Cog8ToothIcon,
} from "@heroicons/react/24/outline";
import { affiliates } from "@/constants/affiliates";
import { useDynamicPlaceholder } from "@/components/useDynamicPlaceholder";
import { AdvancedOptions, Options } from "@/components/AdvancedOptions";

const textDecoder = new TextDecoder();

export function Main({
  theme,
  numberOfDomainsGenerated,
}: {
  theme: "normal" | "shopify";
  numberOfDomainsGenerated: number;
}) {
  const domains = useRef<Domain[]>([]);
  const [, setDomains] = useState<Domain[]>([]);

  const [error, setError] = useState<string>();
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain>();
  const [options, setOptions] = useState<Options>({
    tlds: [],
    numberOfWords: 0,
  });

  const [showOptions, setShowOptions] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      description: "",
    },
  });

  useDynamicPlaceholder("description", watch("description").length === 0);

  const loadDomains = async (description: string) => {
    setError(undefined);

    const response = await fetch("/api/domains", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description,
        options,
      }),
    });

    if (!response.ok || response.body === null) {
      setError("Something went wrong, try again?");
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
                  window.scrollTo(0, results.offsetTop - 48);
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

    if (domains.current.length === 0) {
      setError("No domains found, try again?");
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
    <section>
      <div>
        <div className="relative px-6 pt-14 lg:px-8">
          <div className="mx-auto max-w-4xl -mt-8 py-32 sm:py-48 lg:py-56">
            <div className="flex flex-col items-center text-center">
              <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                <div className="relative rounded-full py-1 px-3 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10">
                  {numberOfDomainsGenerated.toLocaleString()} domain names
                  generated
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl font-display">
                Find the{" "}
                <span className="text-primary-600">perfect domain name</span>{" "}
                for your{" "}
                {theme === "shopify" ? "Shopify store" : "next project"}
              </h1>
              <p className="max-w-3xl mt-10 mb-16 leading-7 md:leading-8 text-gray-600">
                Describe your{" "}
                {theme === "shopify" ? "Shopify store" : "project"} in a few
                words and we’ll generate a list of domain names for you to
                choose from! Find your perfect domain name today{" "}
                <strong className="font-semibold">for free</strong>.
              </p>
            </div>
          </div>
        </div>
        <div
          id="form"
          className={`${
            domains.current.length === 0 ? "relative" : "sticky"
          } z-20 top-0 px-6 lg:px-8 -mt-36 sm:-mt-52 lg:-mt-60 mb-6`}
        >
          <form
            className="mx-auto max-w-4xl pt-5 bg-white rounded-b-xl"
            onSubmit={loadInitialDomains}
          >
            <label htmlFor="description" className="sr-only">
              Description
            </label>
            <input
              id="description"
              className="block w-full px-4 py-3 md:px-6 md:py-4 rounded-xl border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-600"
              maxLength={100}
              required
              {...register("description", {
                maxLength: 100,
                required: true,
              })}
            />
            <button
              type="submit"
              className={`flex justify-center items-center shadow-lg w-full mt-4 py-2.5 px-5 md:py-4 md:px-6 md:text-xl font-display text-white rounded-xl bg-gradient-to-br  focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-80 ${
                error
                  ? "shadow-red-600/30 from-rose-600 to-red-600 enabled:hover:from-rose-500 enabled:hover:to-red-500 focus-visible:outline-red-600"
                  : "shadow-primary-600/30 from-primary-500 to-primary-600 enabled:hover:from-primary-400 enabled:hover:to-primary-500 focus-visible:outline-primary-600"
              }`}
              disabled={loadingInitial}
            >
              {loadingInitial && (
                <ArrowPathIcon className="animate-spin mr-4 w-5 h-5" />
              )}
              {error ? error : "Find my perfect domain name"}
            </button>
          </form>
        </div>
        <div className="relative px-6 lg:px-8 -mt-2 mb-2">
          <div className="mx-auto max-w-4xl">
            <button
              onClick={() => setShowOptions(true)}
              type="button"
              className="flex justify-center items-center shadow-inner w-full mt-4 py-2.5 px-5 md:py-4 md:px-6 md:text-xl font-display text-gray-800 rounded-xl bg-gray-100 enabled:hover:bg-gray-200 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-80"
            >
              <Cog8ToothIcon className="mr-4 w-6 h-6" />
              Advanced options
            </button>
          </div>
        </div>
        <div
          className={`${
            domains.current.length === 0 ? "relative" : "sticky"
          } top-0 h-36 md:h-44 bg-white shadow-xl shadow-primary-900/30`}
        ></div>
        {domains.current.length > 0 && (
          <div id="results" className="px-6 lg:px-8 bg-primary-600">
            <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
              <ul role="list" className="space-y-6">
                {domains.current.map((domain) => (
                  <li
                    key={domain.domain}
                    className="rounded-xl bg-white px-4 py-3 md:px-6 md:py-4 shadow flex items-center"
                  >
                    <div className="flex-1 flex flex-col sm:flex-row justify-between mr-4">
                      <span>{domain.domain}</span>
                      {domain.price !== undefined && (
                        <span className="text-gray-400 sm:text-gray-500">
                          ${domain.price / 1000000}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="-my-1 -mr-2 md:-my-2 md:-mr-4 py-2 px-4 self-stretch font-display rounded-md bg-gradient-to-br text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 from-primary-500 to-primary-600 enabled:hover:from-primary-400 enabled:hover:to-primary-500 focus-visible:outline-primary-600"
                      onClick={() => {
                        setSelectedDomain(domain);
                        setShowCheckout(true);
                      }}
                    >
                      Buy
                    </button>
                  </li>
                ))}
              </ul>
              {!loadingInitial && (
                <button
                  type="button"
                  className="flex justify-center items-center w-full mt-6 py-2.5 px-5 md:py-4 md:px-6 md:text-xl font-display text-white rounded-xl bg-gradient-to-br from-white/10 to-white/20 enabled:hover:from-white/20 enabled:hover:to-white/30 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-offset-primary-600 focus-visible:outline-white disabled:opacity-80"
                  disabled={loadingMore}
                  onClick={loadMoreDomains}
                >
                  {loadingMore && (
                    <ArrowPathIcon className="animate-spin mr-4 w-5 h-5" />
                  )}
                  Generate more
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Transition.Root show={showOptions} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setShowOptions(false)}
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
            <div className="fixed inset-0 bg-black bg-opacity-20 transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="leading-6 text-gray-900">
                            Advanced options
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-primary-600"
                              onClick={() => setShowOptions(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <AdvancedOptions
                          options={options}
                          onChange={(options) => setOptions(options)}
                          onClose={() => setShowOptions(false)}
                        />
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <Transition.Root show={showCheckout} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setShowCheckout(false)}
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
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="leading-6 text-gray-900">
                            {selectedDomain?.domain}
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-primary-600"
                              onClick={() => setShowCheckout(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6 space-y-4">
                        <p className="text-sm text-gray-400 mb-8">
                          Some of these are affiliate links, which means we may
                          earn a commission at no additional cost to you. It
                          helps us to keep the site running!
                        </p>
                        {[...affiliates]
                          .sort(({ id }) =>
                            theme === "shopify" && id === "SHOPIFY" ? -1 : 0
                          )
                          .map((affiliate) => (
                            <a
                              key={affiliate.id}
                              target="_blank"
                              href={`${affiliate.href}${selectedDomain?.domain}`}
                              className={`block bg-gradient-to-br rounded-xl p-8 h-28 focus:outline-none focus-visible:outline-2 ${affiliate.className}`}
                              onClick={(event) => {
                                const encodedHref = encodeURIComponent(
                                  affiliate.href + selectedDomain?.domain
                                );

                                // @ts-ignore
                                event.target.href = `/api/redirect?href=${encodedHref}`;
                              }}
                            >
                              <span className="sr-only">{affiliate.name}</span>
                              <Image
                                className="w-full h-full object-contain pointer-events-none"
                                alt=""
                                src={affiliate.logo}
                                loading="eager"
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
    </section>
  );
}
