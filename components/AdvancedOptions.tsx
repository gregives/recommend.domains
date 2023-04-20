import { useId, useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox, RadioGroup } from "@headlessui/react";
import { tlds } from "@/constants/tlds";
import newGithubIssueUrl from "new-github-issue-url";

export type Options = {
  tlds: string[];
  numberOfWords: 0 | 1 | 2 | 3 | 4;
};

type AdvancedOptionsProperties = {
  options: Options;
  onChange: (options: Options) => void;
  onClose: () => void;
};

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export function AdvancedOptions({
  options,
  onChange,
  onClose,
}: AdvancedOptionsProperties) {
  const suggestionId = useId();
  const [query, setQuery] = useState("");
  const [suggestion, setSuggestion] = useState("");

  const filteredTlds = (
    query === ""
      ? tlds
      : tlds.filter((tld) => {
          return tld.toLowerCase().includes(query.toLowerCase());
        })
  ).sort();

  return (
    <div>
      <Combobox
        as="div"
        value={options.tlds}
        onChange={(tlds) => {
          onChange({
            ...options,
            tlds,
          });
          setQuery("");
        }}
        multiple
      >
        <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
          Top-level domains
        </Combobox.Label>
        {options.tlds.length > 0 && (
          <div className="flex flex-wrap -mx-1.5 -my-1.5 pt-3 pb-1.5">
            {options.tlds.map((tld) => (
              <span
                key={tld}
                className="mx-1.5 my-1.5 inline-flex items-center rounded-xl bg-primary-100 py-1.5 pl-2.5 pr-1.5 text-sm font-medium text-primary-700"
              >
                {tld}
                <button
                  type="button"
                  onClick={() => {
                    onChange({
                      ...options,
                      tlds: options.tlds.filter((t) => t !== tld),
                    });
                  }}
                  className="ml-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:bg-primary-500 focus:text-white focus:outline-none"
                >
                  <span className="sr-only">Remove {tld}</span>
                  <svg
                    className="h-2.5 w-2.5"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 8 8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeWidth="1.5"
                      d="M1 1l6 6m0-6L1 7"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="relative mt-2">
          <Combobox.Input
            className="w-full border-0 bg-white rounded-xl pl-3 py-2 md:pl-4 md:py-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600"
            onChange={(event) => setQuery(event.target.value)}
            value={query}
            placeholder=".com"
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-xl px-3 focus:outline-none">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
          {filteredTlds.length > 0 && (
            <Combobox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredTlds.slice(0, 20).map((tld) => (
                <Combobox.Option
                  key={tld}
                  value={tld}
                  className={({ active }) =>
                    classNames(
                      "relative cursor-default select-none pl-3 py-2 md:pl-4 md:py-3 pr-10",
                      active ? "bg-primary-600 text-white" : "text-gray-900"
                    )
                  }
                >
                  {({ active, selected }) => (
                    <>
                      <span
                        className={classNames(
                          "block truncate",
                          selected && "font-semibold"
                        )}
                      >
                        {tld}
                      </span>
                      {selected && (
                        <span
                          className={classNames(
                            "absolute inset-y-0 right-0 flex items-center pr-3",
                            active ? "text-white" : "text-primary-600"
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))}
              {filteredTlds.length > 20 && (
                <div className="relative cursor-default select-none pl-3 py-2 md:pl-4 md:py-3 pr-10 text-gray-400">
                  Another {(filteredTlds.length - 20).toLocaleString()}{" "}
                  top-level{" "}
                  {filteredTlds.length - 20 === 1
                    ? "domain matches"
                    : "domains match"}{" "}
                  this filter
                </div>
              )}
            </Combobox.Options>
          )}
        </div>
      </Combobox>
      <RadioGroup
        value={options.numberOfWords}
        onChange={(numberOfWords) => {
          onChange({
            ...options,
            numberOfWords,
          });
        }}
        className="mt-4"
      >
        <RadioGroup.Label className="block text-sm font-medium leading-6 text-gray-900">
          Number of words (beta)
        </RadioGroup.Label>
        <div className="mt-2 grid grid-cols-5 gap-3">
          {([0, 1, 2, 3, 4] as const).map((option) => (
            <RadioGroup.Option
              key={option}
              value={option}
              className={({ active, checked }) =>
                classNames(
                  active ? "ring-2 ring-primary-600 ring-offset-2" : "",
                  checked
                    ? "bg-primary-600 text-white hover:bg-primary-500"
                    : "ring-1 ring-inset ring-gray-300 bg-white text-gray-900 hover:bg-gray-50",
                  "cursor-pointer focus:outline-none flex items-center justify-center rounded-xl px-3 py-2 md:px-4 md:py-3 leading-5 text-base flex-1"
                )
              }
            >
              <RadioGroup.Label as="span">
                {option === 0 ? "Any" : option}
              </RadioGroup.Label>
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
      <button
        onClick={onClose}
        className="flex justify-center items-center shadow-lg shadow-primary-600/20 w-full mt-6 py-2 px-4 font-display text-white rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 enabled:hover:from-primary-500 enabled:hover:to-primary-400 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-80"
      >
        Save
      </button>
      <div className="mt-8">
        <label
          htmlFor={suggestionId}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Would you like to see more options?
        </label>
        <div className="mt-2 mb-4">
          <textarea
            rows={4}
            id={suggestionId}
            className="block w-full resize-none rounded-xl px-3 py-2 md:px-4 md:py-3 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600"
            onChange={(event) => setSuggestion(event.target.value)}
            value={suggestion}
          />
        </div>
        <a
          href={newGithubIssueUrl({
            user: "gregives",
            repo: "recommend.domains",
            title: "Suggestion for advanced options",
            body: suggestion,
          })}
          className="flex justify-center items-center shadow-inner shadow-primary-600/10 w-full mt-6 py-2 px-4 font-display text-primary-800 rounded-xl bg-primary-100 hover:bg-primary-50 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-80"
        >
          Send suggestion
        </a>
      </div>
    </div>
  );
}
