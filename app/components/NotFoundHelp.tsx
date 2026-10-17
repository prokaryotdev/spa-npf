"use client";

import { useId } from "react";
import { usePathname } from "next/navigation";
import Link from "../i18n/Link";
import { useLang, useT } from "../i18n/client";
import { localize } from "../i18n/localize";
import { stripLocale } from "../i18n/path";
import { nearest } from "../search-index";
import { ArrowRight, FileIcon, SearchIcon, ServicesIcon } from "./icons";

/** The address that missed, as the visitor typed it, without the language. */
function useMissed() {
  const { rest } = stripLocale(usePathname() ?? "/");
  try {
    return decodeURI(rest);
  } catch {
    return rest;
  }
}

/** Shows the visitor the address that missed, so a typo is plain to see. */
export function MissedAddress() {
  const t = useT();
  return (
    <p className="npf-small mt-6 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-npf-steel">
      {t("You asked for")}
      <code className="max-w-full truncate rounded-chip bg-npf-cloud px-2.5 py-1 text-npf-ink ring-1 ring-npf-hairline ring-inset">
        {useMissed()}
      </code>
    </p>
  );
}

/**
 * The pages the address was most likely after. The site's own search finds
 * them, strictly, so a row is a real guess and never a scatter of half
 * matches; with none it says so rather than guess.
 */
export function ClosestPages() {
  const t = useT();
  const lang = useLang();
  const id = useId();
  const hits = localize(nearest(useMissed()), lang);

  if (!hits.length)
    return (
      <div className="flex items-start gap-4 rounded-card border border-npf-hairline px-6 py-6">
        <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-npf-chip text-npf-blue">
          <SearchIcon className="size-5" />
        </span>
        <div>
          <h2 className="npf-h5 text-npf-ink">
            {t("Nothing on the site is close to that address")}
          </h2>
          <p className="npf-small mt-1 text-npf-body">
            {t("Search above, or start from one of the pages below.")}
          </p>
        </div>
      </div>
    );

  return (
    <section
      aria-labelledby={id}
      className="overflow-hidden rounded-card border border-npf-hairline"
    >
      <h2
        id={id}
        className="npf-h5 border-b border-npf-hairline bg-npf-mist px-5 py-3.5 text-npf-blue-deep"
      >
        {t("Did you mean")}
      </h2>
      <ul className="divide-y divide-npf-hairline">
        {hits.map((hit) => {
          const Icon = hit.section === "Services" ? ServicesIcon : FileIcon;
          return (
            <li key={hit.href}>
              <Link
                href={hit.href}
                className="npf-row-link group flex items-center gap-4 px-5 py-4 focus-visible:-outline-offset-2 active:bg-npf-cloud"
              >
                <span className="npf-disc">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="npf-h5 block text-npf-ink transition-colors group-hover:text-npf-blue">
                    {hit.title}
                  </span>
                  <span className="npf-small mt-0.5 block truncate text-npf-steel">
                    {hit.href}
                  </span>
                </span>
                <ArrowRight className="npf-go" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
