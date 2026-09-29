"use client";

import Image from "next/image";
import Link from "../i18n/Link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "../i18n/Link";
import {
  createContext,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Service } from "../content-services";
import {
  ArrowRight,
  CardIcon,
  ClockIcon,
  SearchIcon,
  ServicesIcon,
} from "./icons";
import { useLang, useT } from "../i18n/client";
import { search } from "../search-index";

export type ServiceRow = Pick<
  Service,
  | "slug"
  | "name"
  | "category"
  | "icon"
  | "description"
  | "mostUsed"
  | "feeSummary"
  | "turnaround"
> & { importance: number };

/**
 * All 92 services on one page.
 *
 * The search sits in the page head (ServiceSearch, sharing the query
 * through ServiceQuery). Here, the most used first in their own row, then
 * the rest by importance. Search and the package chips do the finding, so no
 * A-to-Z index.
 *
 * Filtering runs on the rows the page sent down. They stay in English so
 * the package compares against the same values in every language; t()
 * translates them at render.
 */
export default function ServiceCatalogue({
  services,
  categories,
}: {
  services: ServiceRow[];
  categories: string[];
}) {
  const t = useT();
  const lang = useLang();
  const id = useId();
  const params = useSearchParams();
  const router = useRouter();
  // The homepage's five suites are links into this page with the package
  // already chosen, so the URL seeds the filter. It is read once: rewriting it
  // on every keystroke would put a history entry behind each letter typed.
  const [query, setQuery] = useContext(QueryContext);
  const [category, setCategory] = useState(() => {
    const wanted = params.get("package");
    return wanted && categories.includes(wanted) ? wanted : "";
  });

  // The site search does the matching (both languages, hooks, typos) and the
  // ranking; its order is this grid's order while there is a query.
  const rank = useMemo(() => {
    const byslug = new Map<string, number>();
    search(query).forEach((hit, i) => {
      const slug = hit.href.split("/app/services/")[1];
      if (slug && !byslug.has(slug)) byslug.set(slug, i);
    });
    return byslug;
  }, [query]);
  const q = query.trim();

  const visible = useMemo(
    () =>
      services.filter(
        (s) =>
          (!category || s.category === category) &&
          (!q || rank.has(s.slug)),
      ),
    [services, q, rank, category],
  );

  const filtered = Boolean(q || category);

  // Best match first while searching; otherwise most used first, then by
  // importance, then by the name the reader sees (Hausa sorts as Hausa).
  const sorted = useMemo(
    () =>
      [...visible].sort((a, b) =>
        q
          ? rank.get(a.slug)! - rank.get(b.slug)!
          : Number(b.mostUsed) - Number(a.mostUsed) ||
            a.importance - b.importance ||
            t(a.name).localeCompare(t(b.name), lang),
      ),
    [visible, q, rank, t, lang],
  );
  // Only while browsing: a search or filter ranks its own results.
  const featured = filtered ? [] : sorted.filter((s) => s.mostUsed);
  const rest = filtered ? sorted : sorted.filter((s) => !s.mostUsed);

  const clear = () => {
    setQuery("");
    setCategory("");
    // Otherwise a reload would restore the package from the URL.
    if (params.get("package")) router.replace("/app/services");
  };

  const chips = [
    { value: "", label: t("All packages"), count: services.length },
    ...categories.map((name) => ({
      value: name,
      label: t(name),
      count: services.filter((s) => s.category === name).length,
    })),
  ];

  return (
    <>
      <div className="bg-white pb-(--npf-section-y)">
        <div className="npf-container">
          <PackageTabs
            label={t("Package")}
            chips={chips}
            value={category}
            onChange={setCategory}
          />

          {/* Once anything is filtered, the count and a way back. */}
          <p
            aria-live="polite"
            className="flex items-baseline gap-x-4 not-empty:mt-6"
          >
            {filtered ? (
              <>
                <span className="npf-body text-npf-steel">
                  <span className="font-semibold text-npf-blue-deep tabular-nums">
                    {visible.length}
                  </span>{" "}
                  {t("of {total} services", { total: services.length })}
                </span>
                <button
                  type="button"
                  onClick={clear}
                  className="npf-small -my-3 inline-flex min-h-11 items-center font-medium text-npf-blue underline underline-offset-4 transition-colors hover:text-npf-blue-deep"
                >
                  {t("Clear filters")}
                </button>
              </>
            ) : null}
          </p>

          {visible.length === 0 ? (
            <div className="mt-12 flex flex-col items-center rounded-tile bg-npf-paper px-6 py-16 text-center">
              <span className="grid size-14 place-items-center rounded-full bg-white shadow-card">
                <SearchIcon className="size-6 text-npf-blue" />
              </span>
              <p className="npf-body mt-5 max-w-[46ch] text-npf-body">
                {t(
                  "No service matches those filters. Try clearing one of them, or",
                )}{" "}
                <Link
                  href="/app/home/contactUs"
                  className="font-medium text-npf-blue underline underline-offset-2"
                >
                  {t("contact us")}
                </Link>
                .
              </p>
              <button
                type="button"
                onClick={clear}
                className="npf-btn npf-btn-secondary mt-6"
              >
                {t("Clear filters")}
              </button>
            </div>
          ) : null}

          {/* While browsing, the few most people come for lead in their own
              row; everything else follows by importance. */}
          {featured.length ? (
            <section aria-labelledby={`${id}-top`} className="mt-10">
              <h2 id={`${id}-top`} className="npf-h4 text-npf-blue-deep">
                {t("Most used")}
              </h2>
              {/* Short on a phone: five full cards would fill the screen. */}
              <ul className="mt-5 grid gap-4 max-sm:[&_[data-desc]]:hidden md:grid-cols-2 lg:grid-cols-6">
                {featured.map((service, i) => (
                  <li
                    key={service.slug}
                    className={`${i < 2 ? "lg:col-span-3" : "lg:col-span-2"} md:last:odd:col-span-2 lg:last:odd:col-span-2`}
                  >
                    <ServiceCard service={service} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {rest.length ? (
            <section
              aria-labelledby={featured.length ? `${id}-all` : undefined}
              className={featured.length ? "mt-16" : "mt-8"}
            >
              {featured.length ? (
                <h2 id={`${id}-all`} className="npf-h4 text-npf-blue-deep">
                  {t("All services")}
                </h2>
              ) : null}
              <ul className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {rest.map((service) => (
                  <li key={service.slug}>
                    <ServiceCard service={service} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </>
  );
}

const QueryContext = createContext<[string, (q: string) => void]>([
  "",
  () => {},
]);

/**
 * Holds the search text, so the box can sit in the page head (PageShell's
 * `lead`) while the catalogue it filters sits below.
 */
export function ServiceQuery({ children }: { children: React.ReactNode }) {
  const state = useState("");
  return <QueryContext value={state}>{children}</QueryContext>;
}

/** The search box, for the page head. */
export function ServiceSearch() {
  const t = useT();
  const id = useId();
  const [query, setQuery] = useContext(QueryContext);
  return (
    <div className="mt-8 max-w-3xl md:mt-10">
      <label htmlFor={`${id}-q`} className="sr-only">
        {t("Search services")}
      </label>
      <div className="flex h-15 items-center gap-3 rounded-full bg-white px-6 shadow-card ring-1 ring-npf-hairline transition-shadow ring-inset focus-within:ring-2 focus-within:ring-npf-blue-mid">
        <SearchIcon className="size-5 shrink-0 text-npf-blue" />
        <input
          id={`${id}-q`}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("Certificate, fine, permit…")}
          className="h-full min-w-0 flex-1 bg-transparent text-base text-npf-ink outline-none placeholder:text-npf-steel md:text-lg"
        />
      </div>
    </div>
  );
}

/**
 * One service as a card. The fee and turnaround sit on a ruled foot pinned
 * to the bottom, so across a row of cards they line up whatever the
 * description's length.
 */
function ServiceCard({ service }: { service: ServiceRow }) {
  const t = useT();
  return (
    <Link
      href={`/app/services/${service.slug}`}
      className="group flex h-full flex-col rounded-card bg-white p-5 ring-1 ring-npf-hairline transition-[box-shadow,translate,scale] duration-(--dur-hover) ease-(--ease-out) ring-inset hover:-translate-y-0.5 hover:shadow-card hover:ring-transparent active:scale-[0.99] active:duration-(--dur-press) motion-reduce:hover:translate-y-0"
    >
      <span className="flex">
        <span className="grid size-12 shrink-0 place-items-center rounded-chip bg-npf-cloud transition-colors duration-(--dur-hover) group-hover:bg-npf-chip">
          {service.icon ? (
            <Image
              src={service.icon}
              alt=""
              width={26}
              height={26}
              className="size-6.5"
            />
          ) : (
            <ServicesIcon className="size-6 text-npf-blue-ink" />
          )}
        </span>
      </span>

      <span className="npf-h5 mt-4 text-npf-ink transition-colors group-hover:text-npf-blue">
        {t(service.name)}
      </span>
      {service.description ? (
        // No `block`: line-clamp sets its own display value.
        <span data-desc className="npf-small mt-1.5 line-clamp-2 text-npf-body">
          {t(service.description)}
        </span>
      ) : null}

      <span className="mt-auto pt-5">
        <span className="npf-small flex items-center gap-x-5 border-t border-npf-hairline pt-4">
          <span className="inline-flex items-center gap-1.5 font-medium text-npf-ink tabular-nums">
            <CardIcon className="size-4 shrink-0 text-npf-steel" />
            {t(service.feeSummary)}
          </span>
          <span className="inline-flex items-center gap-1.5 text-npf-steel">
            <ClockIcon className="size-4 shrink-0" />
            {t(service.turnaround)}
          </span>
          <ArrowRight className="ms-auto size-4.5 shrink-0 text-npf-blue transition-transform group-hover:translate-x-[3px] rtl:-scale-x-100 rtl:group-hover:-translate-x-[3px]" />
        </span>
      </span>
    </Link>
  );
}

/**
 * The packages as quiet outlined pills, each count in a small badge, the
 * chosen one filled navy. From lg up they wrap at their own width; below
 * that, a swipe row that keeps the choice in view.
 */
function PackageTabs({
  label,
  chips,
  value,
  onChange,
}: {
  label: string;
  chips: { value: string; label: string; count: number }[];
  value: string;
  onChange: (value: string) => void;
}) {
  const track = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useLayoutEffect(() => {
    const el = track.current;
    const on = el?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (el && on && el.scrollWidth > el.clientWidth)
      el.scrollTo({
        left: on.offsetLeft - (el.clientWidth - on.offsetWidth) / 2,
        behavior: first.current ? "auto" : "smooth",
      });
    first.current = false;
  }, [value]);

  return (
    <div
      ref={track}
      role="group"
      aria-label={label}
      className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0"
    >
      {chips.map((chip) => {
        const on = value === chip.value;
        return (
          <button
            key={chip.value || "all"}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(chip.value)}
            className={`flex min-h-11 shrink-0 items-center gap-2.5 rounded-full ps-4 pe-2 text-sm font-medium whitespace-nowrap ring-1 ring-inset transition-[background-color,color,box-shadow,scale] duration-(--dur-hover) ease-(--ease-out) active:scale-[0.97] active:duration-(--dur-press) ${
              on
                ? "bg-npf-blue-deep text-white ring-npf-blue-deep"
                : "bg-white text-npf-body ring-npf-hairline hover:text-npf-ink hover:ring-npf-ink/25"
            }`}
          >
            {chip.label}
            <span
              className={`grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-xs font-semibold tabular-nums transition-colors duration-(--dur-hover) ${on ? "bg-white/15 text-white" : "bg-npf-cloud text-npf-steel"}`}
            >
              {chip.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
