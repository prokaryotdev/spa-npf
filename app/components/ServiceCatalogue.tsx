"use client";

import Image from "next/image";
import Link from "../i18n/Link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "../i18n/Link";
import { useId, useMemo, useState } from "react";
import {
  services as servicesSource,
  serviceCategoryNames as serviceCategoryNamesSource,
} from "../content-services";
import { ChevronRight, SearchIcon, ServicesIcon } from "./icons";
import { useT, useLocalized } from "../i18n/client";

const AUDIENCES = ["Individuals", "Visitors", "Business", "Students"];

/**
 * All 92 services on one page.
 *
 * A list, not a card grid: at this length the question is "which row is mine",
 * and rows let the fee and the turnaround line up in a column you can scan
 * down. Filtering runs on the array already in the bundle.
 */
export default function ServiceCatalogue() {
  const services = useLocalized(servicesSource);
  const serviceCategoryNames = useLocalized(serviceCategoryNamesSource);
  const t = useT();
  const id = useId();
  const params = useSearchParams();
  const router = useRouter();
  // The homepage's five suites are links into this page with the package
  // already chosen, so the URL seeds the filter. It is read once: rewriting it
  // on every keystroke would put a history entry behind each letter typed.
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(() => {
    const wanted = params.get("package");
    return wanted && serviceCategoryNames.includes(wanted) ? wanted : "";
  });
  const [audience, setAudience] = useState("");
  const [popularOnly, setPopularOnly] = useState(false);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return services.filter((s) => {
      if (category && s.category !== category) return false;
      if (audience && !s.audiences.includes(audience)) return false;
      if (popularOnly && !s.mostUsed) return false;
      if (!q) return true;
      return `${s.name} ${t(s.name)} ${s.description} ${s.category ?? ""} ${t(s.category ?? "")}`
        .toLowerCase()
        .includes(q);
    });
  }, [services, query, category, audience, popularOnly, t]);

  // Grouped while browsing, flat once a filter has already narrowed it down —
  // a single heading above a single list is noise.
  const grouped = !category && !query.trim();
  const sections = useMemo(() => {
    if (!grouped) return [{ name: "", items: visible }];
    const order = [...serviceCategoryNames, null];
    return order
      .map((name) => ({
        name: name ?? t("More services"),
        items: visible.filter((s) => s.category === name),
      }))
      .filter((section) => section.items.length);
  }, [grouped, visible, serviceCategoryNames, t]);

  const filtered = Boolean(query.trim() || category || audience || popularOnly);

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-end gap-4">
        <div className="min-w-[240px] flex-1">
          <label
            htmlFor={`${id}-q`}
            className="mb-1.5 block text-sm font-medium text-dp-ink"
          >
            {t("Search services")}
          </label>
          <div className="flex h-[50px] items-center gap-3 rounded-xl bg-[#F4F8F6] px-4 ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-dp-green">
            <SearchIcon
              aria-hidden
              className="size-5 shrink-0 text-dp-green-ink"
            />
            <input
              id={`${id}-q`}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("Certificate, fine, permit…")}
              className="w-full bg-transparent py-3 text-base text-dp-ink outline-none placeholder:text-dp-muted"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor={`${id}-cat`}
            className="mb-1.5 block text-sm font-medium text-dp-ink"
          >
            {t("Package")}
          </label>
          <select
            id={`${id}-cat`}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-[50px] rounded-xl bg-[#F4F8F6] px-4 text-base text-dp-ink ring-1 ring-black/5 outline-none focus:ring-2 focus:ring-dp-green"
          >
            <option value="">{t("All packages")}</option>
            {serviceCategoryNames.map((name) => (
              <option key={name} value={name}>
                {t(name)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor={`${id}-aud`}
            className="mb-1.5 block text-sm font-medium text-dp-ink"
          >
            {t("I am")}
          </label>
          <select
            id={`${id}-aud`}
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="h-[50px] rounded-xl bg-[#F4F8F6] px-4 text-base text-dp-ink ring-1 ring-black/5 outline-none focus:ring-2 focus:ring-dp-green"
          >
            <option value="">{t("Anyone")}</option>
            {AUDIENCES.map((name) => (
              <option key={name} value={name}>
                {t(name)}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          aria-pressed={popularOnly}
          onClick={() => setPopularOnly((v) => !v)}
          className={`h-[50px] rounded-xl px-4 text-base font-medium transition-colors ${
            popularOnly
              ? "bg-dp-green text-white"
              : "bg-[#F4F8F6] text-dp-ink ring-1 ring-black/5 hover:bg-[#e7f0ec]"
          }`}
        >
          {t("Most used")}
        </button>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <p aria-live="polite" className="text-sm text-dp-muted">
          {t("Showing {shown} of {total} services", {
            shown: visible.length,
            total: services.length,
          })}
        </p>
        {filtered ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("");
              setAudience("");
              setPopularOnly(false);
              // Otherwise a reload would restore the package from the URL.
              if (params.get("package")) router.replace("/app/services");
            }}
            className="text-sm font-medium text-dp-green underline underline-offset-2 transition-colors hover:text-dp-green-deep"
          >
            {t("Clear filters")}
          </button>
        ) : null}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl bg-[#F9F9F9] px-6 py-10 text-center text-base text-dp-body">
          {t("No service matches those filters. Try clearing one of them, or")}{" "}
          <Link
            href="/app/home/contactUs"
            className="font-medium text-dp-green underline underline-offset-2"
          >
            {t("contact us")}
          </Link>
          .
        </p>
      ) : null}

      {sections.map((section) => (
        <section key={section.name || "all"} className="mb-10 last:mb-0">
          {section.name ? (
            <h2 className="mb-4 font-secondary text-xl font-bold text-dp-green-deep md:text-2xl">
              {t(section.name)}
            </h2>
          ) : null}
          <ul className="grid gap-2 lg:grid-cols-2">
            {section.items.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/app/services/${service.slug}`}
                  className="group/row flex h-full items-start gap-4 rounded-2xl px-4 py-4 ring-1 ring-black/[0.07] transition-colors hover:bg-[#F4F8F6]"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#F4F8F6] transition-colors group-hover/row:bg-white">
                    {service.icon ? (
                      <Image
                        src={service.icon}
                        alt=""
                        width={24}
                        height={24}
                        className="size-6"
                      />
                    ) : (
                      <ServicesIcon className="size-5 text-dp-green-ink" />
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-secondary text-base leading-snug font-bold text-dp-ink transition-colors group-hover/row:text-dp-green-ink">
                        {service.name}
                      </span>
                      {service.mostUsed ? (
                        <span className="rounded-full bg-[#e7f6f1] px-2 py-0.5 text-[11px] font-medium text-dp-green-ink">
                          {t("Most used")}
                        </span>
                      ) : null}
                    </span>
                    {service.description ? (
                      <span
                        // No `block`: line-clamp sets its own display value.
                        className="mt-1 line-clamp-2 text-sm leading-relaxed text-dp-body"
                      >
                        {service.description}
                      </span>
                    ) : null}
                    <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-dp-muted">
                      <span className="tabular-nums">{service.feeSummary}</span>
                      <span aria-hidden>·</span>
                      <span>{service.turnaround}</span>
                      {service.audiences.length ? (
                        <>
                          <span aria-hidden>·</span>
                          <span>
                            {service.audiences.map((a) => t(a)).join("، ")}
                          </span>
                        </>
                      ) : null}
                    </span>
                  </span>

                  <ChevronRight
                    aria-hidden
                    className="mt-3 size-5 shrink-0 text-dp-muted transition-transform duration-300 ease-[var(--ease-custom)] group-hover/row:translate-x-1 group-hover/row:text-dp-green"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
