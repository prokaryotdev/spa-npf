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
  ArrowDown,
  ArrowRight,
  CardIcon,
  ClockIcon,
  SearchIcon,
  ServicesIcon,
} from "./icons";
import { useLang, useT } from "../i18n/client";

export type ServiceRow = Pick<
  Service,
  | "slug"
  | "name"
  | "category"
  | "icon"
  | "description"
  | "audiences"
  | "mostUsed"
  | "feeSummary"
  | "turnaround"
>;

const AUDIENCES = ["Individuals", "Visitors", "Business", "Students"];

/**
 * All 92 services on one page.
 *
 * The search sits in the page head (ServiceSearch, sharing the query
 * through ServiceQuery). Here, one grid: the most used first, then by name.
 * Search and the package chips do the finding, so no A-to-Z index.
 *
 * Filtering runs on the rows the page sent down. They stay in English so
 * category and audience compare against the same values in every language;
 * t() translates them at render.
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
  const [audience, setAudience] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return services.filter((s) => {
      if (category && s.category !== category) return false;
      if (audience && !s.audiences.includes(audience)) return false;
      if (!q) return true;
      return `${s.name} ${t(s.name)} ${s.description} ${t(s.description)} ${s.category ?? ""} ${t(s.category ?? "")}`
        .toLowerCase()
        .includes(q);
    });
  }, [services, query, category, audience, t]);

  const filtered = Boolean(query.trim() || category || audience);

  // Most used first, then by the name the reader sees (Hausa sorts as Hausa).
  const sorted = useMemo(
    () =>
      [...visible].sort(
        (a, b) =>
          Number(b.mostUsed) - Number(a.mostUsed) ||
          t(a.name).localeCompare(t(b.name), lang),
      ),
    [visible, t, lang],
  );
  const clear = () => {
    setQuery("");
    setCategory("");
    setAudience("");
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
          {/* One toolbar: packages on the left, who you are on the right. */}
          <div className="grid gap-4 rounded-tile bg-npf-cloud p-3 md:p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-8">
            <PackageTabs
              label={t("Package")}
              chips={chips}
              value={category}
              onChange={setCategory}
            />

            <div className="flex items-center gap-3 border-t border-npf-ink/10 pt-3 lg:border-0 lg:pt-0">
              <label
                htmlFor={`${id}-aud`}
                className="npf-small font-medium whitespace-nowrap text-npf-body"
              >
                {t("I am")}
              </label>
              <span className="npf-select-wrap">
                <select
                  id={`${id}-aud`}
                  value={audience}
                  data-active={audience ? "" : undefined}
                  onChange={(e) => setAudience(e.target.value)}
                  className="npf-select not-data-active:bg-white"
                >
                  <option value="">{t("Anyone")}</option>
                  {AUDIENCES.map((name) => (
                    <option key={name} value={name}>
                      {t(name)}
                    </option>
                  ))}
                </select>
                <ArrowDown className="npf-select-arrow" />
              </span>
            </div>
          </div>

          {/* The result, said plainly, and while browsing a jump to any letter. */}
          <div className="mt-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span aria-live="polite" className="npf-h4 text-npf-blue-deep">
                <span className="tabular-nums">{visible.length}</span>{" "}
                <span className="npf-body font-sans font-normal tracking-normal text-npf-steel">
                  {t("of {total} services", { total: services.length })}
                </span>
              </span>
              {filtered ? (
                <button
                  type="button"
                  onClick={clear}
                  className="npf-small -my-3 inline-flex min-h-11 items-center font-medium text-npf-blue underline underline-offset-4 transition-colors hover:text-npf-blue-deep"
                >
                  {t("Clear filters")}
                </button>
              ) : null}
            </p>
          </div>

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

          <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sorted.map((service) => (
              <li key={service.slug}>
                <ServiceCard service={service} />
              </li>
            ))}
          </ul>
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
      <div className="flex h-15 items-center gap-3 rounded-full bg-white ps-6 pe-2 shadow-[0_12px_32px_-14px_rgb(20_49_95/0.35)] ring-1 ring-npf-ink/10 transition-shadow ring-inset focus-within:ring-2 focus-within:ring-npf-blue-mid">
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
      className="group flex h-full flex-col rounded-card bg-white p-5 ring-1 ring-npf-ink/[0.08] transition-[box-shadow,scale] ring-inset hover:shadow-card active:scale-[0.99] active:duration-(--dur-press)"
    >
      <span className="flex items-start justify-between gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-chip bg-npf-cloud">
          {service.icon ? (
            <Image
              src={service.icon}
              alt=""
              width={26}
              height={26}
              className="size-[26px]"
            />
          ) : (
            <ServicesIcon className="size-6 text-npf-blue-ink" />
          )}
        </span>
        {service.mostUsed ? (
          <span className="rounded-full bg-npf-gold-wash px-2.5 py-1 text-xs font-semibold text-npf-gold">
            {t("Most used")}
          </span>
        ) : null}
      </span>

      <span className="npf-h5 mt-4 text-npf-ink transition-colors group-hover:text-npf-blue">
        {t(service.name)}
      </span>
      {service.description ? (
        // No `block`: line-clamp sets its own display value.
        <span className="npf-small mt-1.5 line-clamp-2 text-npf-body">
          {t(service.description)}
        </span>
      ) : null}

      <span className="mt-auto pt-5">
        <span className="npf-small flex items-center gap-x-5 border-t border-npf-ink/[0.08] pt-4">
          <span className="inline-flex items-center gap-1.5 font-medium text-npf-ink tabular-nums">
            <CardIcon className="size-4 shrink-0 text-npf-steel" />
            {t(service.feeSummary)}
          </span>
          <span className="inline-flex items-center gap-1.5 text-npf-steel">
            <ClockIcon className="size-4 shrink-0" />
            {t(service.turnaround)}
          </span>
          <ArrowRight className="ms-auto size-[18px] shrink-0 text-npf-blue transition-transform group-hover:translate-x-[3px] rtl:-scale-x-100 rtl:group-hover:-translate-x-[3px]" />
        </span>
      </span>
    </Link>
  );
}

/**
 * The package filter as soft cloud pills with their counts, the chosen one
 * navy. Wrapping from sm up, a
 * swipe row on a phone that keeps the choice in view.
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
      className="relative -mx-3 flex gap-2 overflow-x-auto px-3 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
    >
      {chips.map((chip) => {
        const on = value === chip.value;
        return (
          <button
            key={chip.value || "all"}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(chip.value)}
            className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium whitespace-nowrap transition-[background-color,color,scale] active:scale-[0.97] active:duration-(--dur-press) ${
              on
                ? "bg-npf-blue-deep text-white shadow-[0_6px_14px_-8px_rgb(20_49_95/0.6)]"
                : "bg-white text-npf-blue-ink ring-1 ring-npf-ink/[0.06] ring-inset hover:bg-npf-chip"
            }`}
          >
            {chip.label}
            <span
              className={`text-xs tabular-nums ${on ? "text-white/70" : "text-npf-steel"}`}
            >
              {chip.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
