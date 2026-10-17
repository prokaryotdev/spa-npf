"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import { STATES, type NgState } from "../geo";
import { forceHeadquarters, stateCommands, zones } from "../content-footer";
import { fold } from "../search-text";
import { useT } from "../i18n/client";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ClockIcon,
  CloseIcon,
  PinIcon,
  SearchIcon,
  ShieldIcon,
} from "./icons";

// Leaflet reads `window` on import, so the map only ever renders in the browser.
const CommandsMap = dynamic(() => import("./CommandsMap"), { ssr: false });

const mapOf = (state: string) =>
  stateCommands.find((c) => c.state === state)?.map ?? "";

/**
 * Every State Command and the FCT Command, found by what a person knows:
 * their state, its capital, or the Local Government Area they live in.
 * People in Ikorodu do not always think "Lagos State Command", so an LGA
 * match names the LGA it found.
 *
 * One pick drives the page: the map lights its pin and the card beside it
 * answers for it. A search picks its first hit; a pin or a row picks
 * itself. Nothing picked, the card is Force Headquarters.
 */
export function CommandFinder() {
  const t = useT();
  const input = useRef<HTMLInputElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [chosen, setChosen] = useState<string | null>(null);
  const [zone, setZone] = useState<string | null>(null);
  const q = fold(query);

  const hits = useMemo(() => {
    const found: { state: NgState; lga?: string }[] = [];
    for (const s of STATES) {
      if (!q || fold(s.name).includes(q) || fold(s.capital).includes(q))
        found.push({ state: s });
      else {
        const lga = s.lgas.find((l) => fold(l).includes(q));
        if (lga) found.push({ state: s, lga });
      }
    }
    return found;
  }, [q]);

  const shown = chosen ?? (q ? (hits[0]?.state.name ?? null) : null);
  const hit = hits.find((h) => h.state.name === shown);
  const search = (v: string) => {
    setQuery(v);
    setChosen(null);
    setZone(null);
  };
  // Back from a Command lands on its zone, and back from a zone on Force
  // HQ: the card walks the Force's own ladder.
  const back = (to: string | null) => {
    setQuery("");
    setChosen(null);
    setZone(to);
  };
  const choose = (state: string | null, scroll = false) => {
    setChosen(state);
    if (state) setZone(STATES.find((s) => s.name === state)?.zone ?? null);
    if (!scroll || !card.current) return;
    // Back up to the card only when it is off screen (a phone, a long list).
    const r = card.current.getBoundingClientRect();
    if (r.top < 80 || r.top > innerHeight * 0.6)
      card.current.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
  };

  return (
    <div>
      <div className="npf-field npf-field-icon h-16 rounded-full ps-6 pe-2 shadow-card">
        <SearchIcon aria-hidden className="size-5 shrink-0 text-npf-blue" />
        <input
          ref={input}
          type="search"
          value={query}
          onChange={(e) => search(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape" && query) {
              e.preventDefault();
              search("");
            }
          }}
          placeholder={t("Your state, city or LGA")}
          aria-label={t("Find your Command by state, city or LGA")}
          aria-describedby="finder-hint"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          className="min-w-0 text-lg text-npf-ink md:text-xl [&::-webkit-search-cancel-button]:appearance-none"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              search("");
              input.current?.focus();
            }}
            aria-label={t("Clear search")}
            className="grid size-11 shrink-0 place-items-center rounded-full text-npf-steel transition-colors hover:bg-npf-cloud hover:text-npf-ink focus-visible:outline-2 focus-visible:outline-npf-blue"
          >
            <CloseIcon className="size-5" />
          </button>
        ) : null}
      </div>
      <p
        id="finder-hint"
        className="npf-small mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-npf-body"
      >
        <span>{t("Every Command is open 24 hours.")}</span>
        <span aria-live="polite" className="text-npf-steel">
          <span className="font-semibold text-npf-blue-deep tabular-nums">
            {hits.length}
          </span>{" "}
          / <span className="tabular-nums">{STATES.length}</span>
        </span>
      </p>

      {/* The map and its answer. */}
      <div
        ref={card}
        className="mt-8 grid scroll-mt-28 overflow-hidden rounded-card shadow-card ring-1 ring-npf-hairline ring-inset lg:grid-cols-[minmax(0,1fr)_24rem]"
      >
        <div className="relative isolate h-72 bg-npf-cloud sm:h-96 lg:h-auto lg:min-h-[32rem]">
          <CommandsMap picked={shown} zone={zone} onPick={(s) => choose(s)} />
        </div>
        <div aria-live="polite" className="flex flex-col bg-npf-blue-deep text-white">
          {hit ? (
            <CommandCard
              key={hit.state.name}
              state={hit.state}
              lga={hit.lga}
              onBack={() => back(hit.state.zone)}
            />
          ) : shown ? (
            <CommandCard
              key={shown}
              state={STATES.find((s) => s.name === shown)!}
              onBack={() => back(zone)}
            />
          ) : zone ? (
            <ZoneCard
              key={zone}
              zone={zone}
              onBack={() => back(null)}
              onPick={(s) => choose(s)}
            />
          ) : (
            <HqCard onZone={setZone} />
          )}
        </div>
      </div>

      <div className="mt-14">
        {hits.length ? (
          <div className="space-y-10">
            {zones.map((zone) => {
              const rows = hits.filter((h) => h.state.zone === zone);
              if (!rows.length) return null;
              const id = `zone-${zone.toLowerCase().replace(/\s+/g, "-")}`;
              return (
                <section key={zone} aria-labelledby={id}>
                  <h2
                    id={id}
                    className="npf-h4 flex items-baseline gap-3 text-npf-blue-deep"
                  >
                    {t(zone)}
                    <span className="npf-body font-normal text-npf-steel tabular-nums">
                      {rows.length}
                    </span>
                  </h2>
                  {/* Two to a line from a tablet up: the grid's colour shows
                      through the 1px gaps as the rules, and a lone last row
                      spans both so no empty cell shows. */}
                  <ul className="mt-4 grid gap-px overflow-hidden rounded-card border border-npf-hairline bg-npf-hairline md:grid-cols-2">
                    {rows.map((h) => (
                      <li
                        key={h.state.name}
                        className="bg-white md:last:odd:col-span-2"
                      >
                        <CommandRow
                          state={h.state}
                          lga={h.lga}
                          on={h.state.name === shown}
                          onPick={() => choose(h.state.name, true)}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="rounded-card border border-dashed border-npf-line bg-npf-mist px-6 py-10 text-center">
            <p className="npf-h5 text-npf-blue-deep">
              {t("No Command matches “{q}”.", { q: query.trim() })}
            </p>
            <p className="npf-body mt-2 text-npf-body">
              {t("Check the spelling, or type the state's name.")}
            </p>
            <button
              type="button"
              onClick={() => {
                search("");
                input.current?.focus();
              }}
              className="npf-btn npf-btn-secondary mt-6"
            >
              {t("Clear search")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/** The white pill that sends a place to Maps, on the navy card. */
function MapsButton({ href }: { href: string }) {
  const t = useT();
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="npf-btn npf-btn-secondary w-full"
    >
      {t("Open in Maps")}
      <span className="npf-btn-disc">
        <ArrowUpRight aria-hidden className="size-4.5" />
      </span>
      <span className="sr-only">{t("(opens in a new window)")}</span>
    </a>
  );
}

function HqCard({ onZone }: { onZone: (zone: string) => void }) {
  const t = useT();
  return (
    <div className="npf-page-in flex flex-1 flex-col p-6 md:p-8">
      <span
        aria-hidden
        className="grid size-12 place-items-center rounded-full bg-white/10 ring-1 ring-white/20"
      >
        <ShieldIcon className="size-6" />
      </span>
      <h2 className="mt-5 font-secondary text-3xl leading-tight font-bold text-balance">
        {t(forceHeadquarters.name)}
      </h2>
      <p className="npf-small mt-4 flex gap-3 text-white/85">
        <PinIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-white/60" />
        {forceHeadquarters.address}
      </p>
      <p className="npf-small mt-2 flex gap-3 text-white/85">
        <ClockIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-white/60" />
        {t("Open: {hours}", { hours: t("24 hours") })}
      </p>
      <h3 className="npf-small mt-6 border-t border-white/15 pt-5 font-medium text-white/75">
        {t("Or start from your zone")}
      </h3>
      <ul className="mt-3 grid grid-cols-2 gap-2">
        {zones.map((z) => (
          <li key={z}>
            <button
              type="button"
              onClick={() => onZone(z)}
              className="flex w-full items-center justify-between gap-2 rounded-chip bg-white/8 px-3 py-2.5 text-start ring-1 ring-white/12 transition-colors ring-inset hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white active:scale-[0.98]"
            >
              <span className="npf-small font-medium text-white">{t(z)}</span>
              <span className="npf-caption text-white/60 tabular-nums">
                {STATES.filter((s) => s.zone === z).length}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        <MapsButton href={forceHeadquarters.map} />
      </div>
    </div>
  );
}

function CommandCard({
  state,
  lga,
  onBack,
}: {
  state: NgState;
  lga?: string;
  onBack: () => void;
}) {
  const t = useT();
  // Only ever mounted after a pick, so the browser is there to ask.
  const [wide] = useState(() => matchMedia("(min-width: 64rem)").matches);
  return (
    <div className="npf-page-in flex flex-1 flex-col p-6 md:p-8">
      <button
        type="button"
        onClick={onBack}
        className="npf-small -ms-1 flex items-center gap-1.5 self-start rounded-chip px-1 py-0.5 text-white/75 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-white"
      >
        <ArrowRight aria-hidden className="size-3.5 -scale-x-100" />
        {t(state.zone)}
      </button>
      <h2 className="mt-4 font-secondary text-3xl leading-tight font-bold text-balance">
        {state.name === "FCT"
          ? t("FCT Command")
          : t("{state} State Command", { state: state.name })}
      </h2>
      <p className="npf-small mt-4 flex gap-3 text-white/85">
        <PinIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-white/60" />
        {t("Headquarters in {city}", { city: state.capital })} · {t(state.zone)}
      </p>
      <p className="npf-small mt-2 flex gap-3 text-white/85">
        <ClockIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-white/60" />
        {t("Open: {hours}", { hours: t("24 hours") })}
      </p>
      {lga ? (
        <p className="npf-small mt-4 self-start rounded-chip bg-white/12 px-2.5 py-1 font-medium text-white">
          {t("Covers {lga}", { lga })}
        </p>
      ) : null}

      {/* Open beside the map, where the card has the room; shut on a phone,
          where the list would push Maps off the screen. */}
      <details
        open={wide}
        className="group/lga mt-6 border-t border-white/15 pt-4">
        <summary className="npf-small flex cursor-pointer list-none items-center justify-between gap-3 py-1 font-medium text-white [&::-webkit-details-marker]:hidden">
          {t("The {count} LGAs it covers", { count: state.lgas.length })}
          <ArrowDown
            aria-hidden
            className="size-4 shrink-0 transition-transform duration-(--dur-hover) group-open/lga:rotate-180"
          />
        </summary>
        <ul className="mt-3 flex max-h-44 flex-wrap gap-1.5 overflow-y-auto pe-1">
          {state.lgas.map((l) => (
            <li
              key={l}
              className={`npf-caption rounded-chip px-2 py-1 ${
                l === lga ? "bg-white text-npf-blue-deep" : "bg-white/10 text-white/85"
              }`}
            >
              {l}
            </li>
          ))}
        </ul>
      </details>

      <div className="mt-auto pt-6">
        <MapsButton href={mapOf(state.name)} />
      </div>
    </div>
  );
}

/** A zone's Commands, each one a step further down. */
function ZoneCard({
  zone,
  onBack,
  onPick,
}: {
  zone: string;
  onBack: () => void;
  onPick: (state: string) => void;
}) {
  const t = useT();
  const states = STATES.filter((s) => s.zone === zone);
  return (
    <div className="npf-page-in flex flex-1 flex-col p-6 md:p-8">
      <button
        type="button"
        onClick={onBack}
        className="npf-small -ms-1 flex items-center gap-1.5 self-start rounded-chip px-1 py-0.5 text-white/75 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-white"
      >
        <ArrowRight aria-hidden className="size-3.5 -scale-x-100" />
        {t(forceHeadquarters.name)}
      </button>
      <h2 className="mt-4 flex items-baseline gap-3 font-secondary text-3xl leading-tight font-bold">
        {t(zone)}
        <span className="npf-body font-normal text-white/60 tabular-nums">
          {states.length}
        </span>
      </h2>
      <ul className="mt-5 divide-y divide-white/12 border-y border-white/12">
        {states.map((s) => (
          <li key={s.name}>
            <button
              type="button"
              onClick={() => onPick(s.name)}
              className="group flex w-full items-center gap-3 py-2.5 text-start focus-visible:outline-2 focus-visible:outline-white"
            >
              <span className="min-w-0 flex-1">
                <span className="npf-small block font-medium text-white">
                  {s.name === "FCT"
                    ? t("FCT Command")
                    : t("{state} State Command", { state: s.name })}
                </span>
                <span className="npf-caption block text-white/60">{s.capital}</span>
              </span>
              <ArrowRight
                aria-hidden
                className="size-4 shrink-0 text-white/60 transition-[translate,color] group-hover:translate-x-0.5 group-hover:text-white rtl:-scale-x-100"
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** One Command: the row picks it for the map and the card. */
function CommandRow({
  state,
  lga,
  on,
  onPick,
}: {
  state: NgState;
  lga?: string;
  on: boolean;
  onPick: () => void;
}) {
  const t = useT();
  return (
    <button
      type="button"
      onClick={onPick}
      aria-pressed={on}
      className={`npf-row-link group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 px-5 py-3.5 text-start focus-visible:-outline-offset-2 active:bg-npf-cloud ${
        on ? "bg-npf-mist" : ""
      }`}
    >
      <span
        className={`npf-disc ${on ? "bg-npf-blue-deep! text-white!" : ""}`}
      >
        <PinIcon aria-hidden className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="npf-h5 block text-npf-ink transition-colors group-hover:text-npf-blue">
          {state.name === "FCT"
            ? t("FCT Command")
            : t("{state} State Command", { state: state.name })}
        </span>
        <span className="npf-small mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-npf-body">
          {t("Headquarters in {city}", { city: state.capital })}
          <span className="text-npf-steel tabular-nums">
            {t("{count} LGAs", { count: state.lgas.length })}
          </span>
          {lga ? (
            <span className="rounded-chip bg-npf-chip px-2 py-0.5 font-medium text-npf-blue-ink">
              {t("Covers {lga}", { lga })}
            </span>
          ) : null}
        </span>
      </span>
      <ArrowRight aria-hidden className="npf-go" />
    </button>
  );
}
