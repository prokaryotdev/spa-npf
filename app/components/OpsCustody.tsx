"use client";

import { useId, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "../i18n/Link";
import { filterBy } from "../search-text";
import { useFormat, useT } from "../i18n/client";
import { callTypes } from "../content-ops";
import { STATES, jurisdiction, stateNamed } from "../geo";
import {
  OPS_FORM_SELECT,
  OPS_INPUT,
  OpsButton,
  OpsEmpty,
  OpsField,
  OpsFigures,
  OpsHead,
  OpsLog,
  OpsPanel,
  OpsSearch,
  OpsSection,
  duration,
  useNow,
  useScoped,
} from "./OpsPieces";
import {
  bookIn,
  custodyLimit,
  updateDetainee,
  welfareCheck,
  type Detainee,
  type DetaineeStatus,
} from "./store";
import { commandLabel, line } from "./Where";
import { CheckIcon, CloseIcon, PlusIcon } from "./icons";
import { CustodyGlyph } from "./ops-glyphs";

const HOUR = 3_600_000;

/** Visits to the cells are due at least hourly, as in the UK's PACE Code C. */
const VISIT_MINUTES = 60;

const RIGHTS: { key: keyof Detainee["rights"]; label: string }[] = [
  { key: "informed", label: "Told the offence and their rights" },
  { key: "kin", label: "Family or next of kin told" },
  { key: "lawyer", label: "Lawyer of their choice allowed" },
  { key: "medical", label: "Medical attention given where needed" },
];

const LEAVE: { status: DetaineeStatus; label: string }[] = [
  { status: "Bail granted", label: "Grant bail" },
  { status: "Charged to court", label: "Charged to court" },
  { status: "Released", label: "Release without charge" },
  { status: "Transferred", label: "Transfer" },
];

/** How much of the constitutional limit has run, and when it runs out. */
function clockOf(d: Detainee, now: number) {
  const start = new Date(d.arrested).getTime();
  const limit = custodyLimit(d) * HOUR;
  const end = d.status === "In custody" ? now : new Date(d.released ?? d.arrested).getTime();
  const used = end - start;
  return {
    used,
    limit,
    due: start + limit,
    over: d.status === "In custody" && used > limit,
    near: d.status === "In custody" && used <= limit && limit - used < 4 * HOUR,
  };
}

/**
 * The register of arrests (ACJA 2015 s.15), kept as a live board.
 *
 * Its clock is the one that matters most in a Nigerian station: section
 * 35(5) of the Constitution allows 24 hours before a suspect is brought
 * before a court where one sits within 40 km, and 48 hours otherwise. The
 * board leads with whoever is closest to that limit, and anyone past it turns
 * red on every screen of the console.
 */
export default function OpsCustody() {
  const t = useT();
  const id = useId();
  const now = useNow();
  const { custody, cases, viewing } = useScoped();
  const params = useSearchParams();
  const book = params.get("book");
  const held = params.get("held");
  const [selected, setSelected] = useState<string | null>(held);
  const [booking, setBooking] = useState(!!book);
  const [query, setQuery] = useState("");
  const [all, setAll] = useState(false);

  const inCells = custody.filter((d) => d.status === "In custody");
  const shown = custody
      .filter((d) => all || d.status === "In custody")
      .sort((a, b) =>
        a.status === "In custody" && b.status === "In custody"
          ? clockOf(a, now).due - clockOf(b, now).due
          : Number(b.status === "In custody") - Number(a.status === "In custody") ||
            b.booked.localeCompare(a.booked),
      );
  const visible = filterBy(shown, query, (d) =>
    [d.id, d.name, d.offence, t(d.offence), d.caseId ?? "", d.where.lga].join(" "),
  );

  const over = inCells.filter((d) => clockOf(d, now).over).length;
  const near = inCells.filter((d) => clockOf(d, now).near).length;
  const current = custody.find((d) => d.id === selected) ?? null;

  return (
    <div className="space-y-8">
      <OpsHead
        title={t("Custody")}
        lead={t("Bail is free. Charge or release within 24 hours where a court sits within 40 km, otherwise 48 (Constitution s.35).")}
        action={
          <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
            <OpsFigures
              figures={[
                { label: t("Held"), value: inCells.length },
                { label: t("Past the limit"), value: over, tone: over ? "var(--ops-p1)" : "var(--ops-dim)" },
                { label: t("Due within 4 h"), value: near, tone: near ? "#ffd27a" : "var(--ops-dim)" },
              ]}
            />
            <OpsButton tone={booking ? "quiet" : "brand"} aria-expanded={booking} onClick={() => setBooking((v) => !v)}>
              {booking ? <CloseIcon aria-hidden className="size-4" /> : <PlusIcon aria-hidden className="size-4" />}
              {booking ? t("Cancel") : t("Book in")}
            </OpsButton>
          </div>
        }
      />

      {booking ? (
        <BookIn
          viewing={viewing}
          caseId={book}
          cases={cases.filter((c) => c.stage !== "Closed").map((c) => c.id)}
          onDone={(d) => {
            setBooking(false);
            setSelected(d.id);
          }}
        />
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <OpsSearch id={`${id}-q`} label={t("Filter the register")} placeholder={t("Name, reference, offence or case")} value={query} onChange={setQuery} found={visible.length} />
        <OpsButton tone={all ? "brand" : "quiet"} aria-pressed={all} onClick={() => setAll((v) => !v)}>
          {t("Include released")}
        </OpsButton>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <OpsPanel flush className="min-w-0">
          <table className="w-full text-start text-sm">
            <caption className="sr-only">{t("Register of arrests, with time held against the legal limit")}</caption>
            <thead className="npf-ops-thead text-xs text-ops-dim">
              <tr className="whitespace-nowrap">
                <th scope="col" className="w-full py-3 ps-5 pe-4 font-medium">{t("Detainee")}</th>
                <th scope="col" className="hidden py-3 pe-4 font-medium sm:table-cell">{t("Rights")}</th>
                <th scope="col" className="py-3 pe-5 text-end font-medium">{t("Held")}</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((d) => {
                const c = clockOf(d, now);
                const tone = c.over ? "var(--ops-p1)" : c.near ? "var(--ops-p2)" : undefined;
                const given = RIGHTS.filter((r) => d.rights[r.key]).length;
                return (
                  <tr
                    key={d.id}
                    onClick={() => setSelected(d.id)}
                    aria-selected={selected === d.id}
                    className={`cursor-pointer border-b border-ops-line-soft last:border-0 ${selected === d.id ? "bg-npf-mist" : "hover:bg-ops-hover"} ${c.over ? "npf-ops-overdue" : ""}`}
                  >
                    <th scope="row" className="py-3.5 ps-5 pe-4 text-start align-top font-normal">
                      <button type="button" onClick={(e) => { e.stopPropagation(); setSelected(d.id); }} className="text-sm font-medium hover:underline">
                        {d.name}
                      </button>
                      <span className="mt-0.5 block text-xs text-ops-dim">
                        <span className="font-mono">{d.id}</span> · {t(d.offence)}
                        {d.status !== "In custody" ? ` · ${t(d.status)}` : ""}
                      </span>
                    </th>
                    <td className="hidden py-3.5 pe-4 align-top sm:table-cell">
                      <span className={`font-mono text-xs ${given < RIGHTS.length && d.status === "In custody" ? "font-semibold text-ops-p2" : "text-ops-dim"}`}>
                        {given}/{RIGHTS.length}
                      </span>
                    </td>
                    <td className="py-3.5 pe-5 text-end align-top whitespace-nowrap" style={{ color: tone }}>
                      <span className="font-mono text-sm font-medium tabular-nums">{now ? duration(c.used) : "--:--"}</span>
                      <span className="mt-0.5 block text-2xs font-normal text-ops-dim">
                        {t("of {n} h", { n: custodyLimit(d) })}
                      </span>
                      {d.status === "In custody" ? (
                        <span aria-hidden className="ms-auto mt-1.5 block h-1 w-16 overflow-hidden rounded-full bg-ops-fill">
                          <span className="block h-full rounded-full" style={{ width: `${Math.min(100, (c.used / c.limit) * 100)}%`, background: tone ?? "var(--color-npf-blue-mid)" }} />
                        </span>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {visible.length === 0 ? (
            <OpsEmpty
              tone={query ? "none" : "clear"}
              title={query ? t("Nobody matches that search") : t("The cells are empty")}
              hint={query ? t("Clear the search to see the whole register.") : t("Nobody is held in custody in this command right now.")}
            />
          ) : null}
        </OpsPanel>

        <div className="lg:sticky lg:top-[calc(var(--ops-top)+1.25rem)] lg:self-start">
          {current ? (
            <DetaineeDetail key={current.id} d={current} onClose={() => setSelected(null)} />
          ) : (
            <OpsPanel title={t("Detainee")} className="max-lg:hidden" flush>
              <OpsEmpty tone="idle" icon={<CustodyGlyph className="size-6" />} hint={t("Pick a name to record a cell visit, tick off their rights, or bail, charge or release them.")} />
            </OpsPanel>
          )}
        </div>
      </div>
    </div>
  );
}

function BookIn({
  viewing,
  caseId,
  cases,
  onDone,
}: {
  viewing: string | null;
  caseId: string | null;
  cases: string[];
  onDone: (d: Detainee) => void;
}) {
  const t = useT();
  const id = useId();
  const { cases: files } = useScoped();
  const linked = files.find((c) => c.id === caseId);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("Male");
  const [offence, setOffence] = useState(linked?.offence ?? callTypes[0]);
  const [file, setFile] = useState(caseId ?? "");
  const [state, setState] = useState(linked?.where.state ?? viewing ?? "");
  const [lga, setLga] = useState(linked?.where.lga ?? "");
  const [ago, setAgo] = useState("0");
  const [courtNear, setCourtNear] = useState(true);
  const [property, setProperty] = useState("");
  const [rights, setRights] = useState<Detainee["rights"]>({ informed: false, kin: false, lawyer: false, medical: false });
  const lgas = stateNamed(state)?.lgas ?? [];
  const ready = name.trim() && state && lga;

  return (
    <OpsPanel title={t("Book a suspect into custody")}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!ready) return;
          onDone(
            bookIn({
              name: name.trim(),
              age: age ? Number(age) : undefined,
              sex,
              offence,
              caseId: file || undefined,
              incident: files.find((c) => c.id === file)?.incident,
              where: jurisdiction(state, lga),
              arrested: new Date(Date.now() - Number(ago) * 60_000).toISOString(),
              courtNear,
              rights,
              property: property.trim() || undefined,
            }),
          );
        }}
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        <OpsField id={`${id}-n`} label={t("Full name")} className="sm:col-span-2">
          <input id={`${id}-n`} value={name} onChange={(e) => setName(e.target.value)} className={OPS_INPUT} />
        </OpsField>
        <OpsField id={`${id}-a`} label={t("Age")}>
          <input id={`${id}-a`} inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value.replace(/\D/g, "").slice(0, 3))} className={OPS_INPUT} />
        </OpsField>
        <OpsField id={`${id}-s`} label={t("Sex")}>
          <select id={`${id}-s`} value={sex} onChange={(e) => setSex(e.target.value)} className={OPS_FORM_SELECT}>
            <option value="Male">{t("Male")}</option>
            <option value="Female">{t("Female")}</option>
          </select>
        </OpsField>
        <OpsField id={`${id}-o`} label={t("Offence")}>
          <select id={`${id}-o`} value={offence} onChange={(e) => setOffence(e.target.value)} className={OPS_FORM_SELECT}>
            {callTypes.map((c) => <option key={c} value={c}>{t(c)}</option>)}
          </select>
        </OpsField>
        <OpsField id={`${id}-c`} label={t("Case file")}>
          <select id={`${id}-c`} value={file} onChange={(e) => setFile(e.target.value)} className={OPS_FORM_SELECT}>
            <option value="">{t("None yet")}</option>
            {cases.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </OpsField>
        <OpsField id={`${id}-st`} label={t("State")}>
          <select id={`${id}-st`} value={state} disabled={!!viewing} onChange={(e) => { setState(e.target.value); setLga(""); }} className={OPS_FORM_SELECT}>
            <option value="">{t("Choose a state")}</option>
            {STATES.map((s) => <option key={s.name} value={s.name}>{commandLabel(t, s.name)}</option>)}
          </select>
        </OpsField>
        <OpsField id={`${id}-l`} label={t("Division")}>
          <select id={`${id}-l`} value={lga} disabled={!state} onChange={(e) => setLga(e.target.value)} className={OPS_FORM_SELECT}>
            <option value="">{state ? t("Choose one of {n} areas", { n: lgas.length }) : t("Choose a state first")}</option>
            {lgas.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </OpsField>
        <OpsField id={`${id}-t`} label={t("Arrested")}>
          <select id={`${id}-t`} value={ago} onChange={(e) => setAgo(e.target.value)} className={OPS_FORM_SELECT}>
            {[0, 30, 60, 120, 240].map((m) => (
              <option key={m} value={m}>{m ? t("{n} minutes ago", { n: m }) : t("Just now")}</option>
            ))}
          </select>
        </OpsField>
        <OpsField id={`${id}-p`} label={t("Property taken for safe keeping")} className="sm:col-span-2 xl:col-span-3">
          <input id={`${id}-p`} value={property} onChange={(e) => setProperty(e.target.value)} placeholder={t("Phone, wallet with ₦2,000, belt")} className={OPS_INPUT} />
        </OpsField>
        <fieldset className="sm:col-span-2 xl:col-span-4">
          <legend className="mb-1.5 text-xs font-semibold text-ops-dim">{t("Done on arrival")}</legend>
          <div className="grid gap-1.5 sm:grid-cols-2">
            <Tick checked={courtNear} onChange={setCourtNear} label={t("A court sits within 40 km (24-hour limit)")} />
            {RIGHTS.map((r) => (
              <Tick key={r.key} checked={rights[r.key]} onChange={(v) => setRights((x) => ({ ...x, [r.key]: v }))} label={t(r.label)} />
            ))}
          </div>
        </fieldset>
        <div className="sm:col-span-2 xl:col-span-4">
          <OpsButton type="submit" tone="brand" disabled={!ready}>{t("Book into custody")}</OpsButton>
        </div>
      </form>
    </OpsPanel>
  );
}

function Tick({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-xs hover:bg-ops-hover has-[:focus-visible]:outline-2">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
      <span aria-hidden className={`grid size-4.5 shrink-0 place-items-center rounded-[4px] ring-1 ring-inset ${checked ? "bg-npf-blue text-white ring-npf-blue" : "bg-white ring-npf-line"}`}>
        {checked ? <CheckIcon className="size-3" /> : null}
      </span>
      {label}
    </label>
  );
}

function DetaineeDetail({ d, onClose }: { d: Detainee; onClose: () => void }) {
  const t = useT();
  const format = useFormat();
  const now = useNow();
  const id = useId();
  const [visit, setVisit] = useState("");
  const [leaving, setLeaving] = useState<DetaineeStatus | null>(null);
  const [why, setWhy] = useState("");
  const c = clockOf(d, now);
  const lastVisit = d.checks.at(-1);
  const sinceVisit = lastVisit ? (now - new Date(lastVisit.at).getTime()) / 60_000 : Infinity;
  const held = d.status === "In custody";

  return (
    <OpsPanel
      title={d.name}
      action={
        <button type="button" onClick={onClose} aria-label={t("Close detainee record")} className="grid size-8 place-items-center rounded-(--ops-control-radius) text-ops-dim ring-1 ring-ops-line-soft ring-inset hover:bg-ops-hover hover:text-ops-text">
          <CloseIcon className="size-4" />
        </button>
      }
    >
      <p className="text-xs text-ops-dim">
        <span className="font-mono">{d.id}</span> · {t(d.offence)} · {d.age ? t("{n} years", { n: d.age }) : null} {t(d.sex)}
      </p>

      {/* The clock, as large as the board's own figures: it is the reason
          this screen exists. */}
      <div
        className={`mt-4 rounded-chip p-4 ring-1 ring-inset ${c.over ? "bg-ops-p1-wash ring-[color-mix(in_srgb,var(--ops-p1)_30%,transparent)]" : c.near ? "bg-ops-p2-wash ring-[color-mix(in_srgb,var(--ops-p2)_30%,transparent)]" : "bg-npf-mist ring-ops-line-soft"}`}
      >
        <p className="flex items-baseline justify-between gap-3">
          <span className="font-mono text-[1.75rem] leading-none font-medium tracking-[-0.03em] tabular-nums" style={{ color: c.over ? "var(--ops-p1)" : c.near ? "var(--ops-p2)" : undefined }}>
            {now ? duration(c.used) : "--:--"}
          </span>
          <span className="text-xs text-ops-dim">{t("of {n} hours", { n: custodyLimit(d) })}</span>
        </p>
        <p className="mt-2 text-xs">
          {held
            ? c.over
              ? t("Past the limit. Charge to court, grant bail or release now, or get a remand order.")
              : t("Charge or release by {time}.", { time: format.dateTime(new Date(c.due).toISOString()) })
            : t("{status} at {time}.", { status: t(d.status), time: format.dateTime(d.released ?? d.booked) })}
        </p>
        <label className="mt-2 flex items-center gap-2 text-2xs text-ops-dim">
          <input type="checkbox" checked={d.courtNear} disabled={!held} onChange={(e) => updateDetainee(d.id, { courtNear: e.target.checked })} />
          {t("A court sits within 40 km")}
        </label>
      </div>

      <dl className="mt-4 grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-3 gap-y-1.5 text-xs">
        <dt className="text-ops-dim">{t("Arrested")}</dt>
        <dd className="tabular-nums">{format.dateTime(d.arrested)}</dd>
        <dt className="text-ops-dim">{t("Booked in by")}</dt>
        <dd>{t(d.by)}</dd>
        {d.caseId ? (
          <>
            <dt className="text-ops-dim">{t("Case file")}</dt>
            <dd><Link href={`/app/police/cases?case=${encodeURIComponent(d.caseId)}`} className="font-mono font-medium text-ops-accent hover:underline">{d.caseId}</Link></dd>
          </>
        ) : null}
        {d.property ? (
          <>
            <dt className="text-ops-dim">{t("Property")}</dt>
            <dd>{d.property}</dd>
          </>
        ) : null}
      </dl>

      <OpsSection title={t("Rights")}>
        <div className="grid gap-0.5">
          {RIGHTS.map((r) => (
            <Tick
              key={r.key}
              checked={d.rights[r.key]}
              onChange={(v) =>
                updateDetainee(d.id, { rights: { ...d.rights, [r.key]: v } }, v ? { text: "Done: {what}.", vars: { what: r.label } } : undefined)
              }
              label={t(r.label)}
            />
          ))}
        </div>
      </OpsSection>

      <OpsSection title={t("Cell visits")} count={d.checks.length}>
        {held ? (
          <p className={`mb-2 text-xs ${sinceVisit > VISIT_MINUTES ? "font-semibold text-ops-p2" : "text-ops-dim"}`}>
            {lastVisit
              ? t("Last visit {n} minutes ago. Visits are due at least every {m} minutes.", { n: Math.round(sinceVisit), m: VISIT_MINUTES })
              : t("No visit recorded yet. Visits are due at least every {m} minutes.", { m: VISIT_MINUTES })}
          </p>
        ) : null}
        {d.checks.length ? (
          <ul className="space-y-1.5 text-xs">
            {d.checks.slice().reverse().slice(0, 4).map((v, n) => (
              <li key={n}>
                <span className="font-mono text-ops-dim">{format.time(v.at)}</span> {v.note}
                <span className="block text-2xs text-ops-dim">{t(v.by)}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {held ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              welfareCheck(d.id, visit.trim() || t("Seen. No complaint."));
              setVisit("");
            }}
            className="mt-3 flex gap-2"
          >
            <label htmlFor={`${id}-v`} className="sr-only">{t("What you saw")}</label>
            <input id={`${id}-v`} value={visit} onChange={(e) => setVisit(e.target.value)} placeholder={t("Seen. No complaint.")} className={`${OPS_INPUT} !py-1.5 !text-xs`} />
            <OpsButton type="submit" tone="brand" className="!h-8 !px-3 !text-xs">{t("Record visit")}</OpsButton>
          </form>
        ) : null}
      </OpsSection>

      {held ? (
        <OpsSection title={t("Leaving custody")}>
          <div className="flex flex-wrap gap-1.5">
            {LEAVE.map((l) => (
              <OpsButton key={l.status} tone={leaving === l.status ? "brand" : "quiet"} className="!h-8 !px-3 !text-xs" onClick={() => setLeaving(l.status)}>
                {t(l.label)}
              </OpsButton>
            ))}
          </div>
          {leaving ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!why.trim()) return;
                updateDetainee(d.id, { status: leaving }, { text: "{reason}", vars: { reason: why.trim() } });
                setLeaving(null);
                setWhy("");
              }}
              className="mt-3 grid gap-2"
            >
              <label htmlFor={`${id}-w`} className="text-xs font-semibold">
                {leaving === "Bail granted"
                  ? t("Bail terms (bail is free: no money is taken)")
                  : leaving === "Charged to court"
                    ? t("Court and charge number")
                    : leaving === "Transferred"
                      ? t("Where to, and why")
                      : t("Why they are released")}
              </label>
              <input id={`${id}-w`} value={why} onChange={(e) => setWhy(e.target.value)} className={OPS_INPUT} />
              <div><OpsButton type="submit" tone="brand" disabled={!why.trim()}>{t("Confirm")}</OpsButton></div>
            </form>
          ) : null}
        </OpsSection>
      ) : (
        <div className="mt-4">
          <OpsButton onClick={() => updateDetainee(d.id, { status: "In custody" }, { text: "Returned to custody." })}>{t("Return to custody")}</OpsButton>
        </div>
      )}

      <OpsSection title={t("Record")}>
        <OpsLog lines={d.log} render={(l) => line(t, l.text, l.vars)} time={format.time} />
      </OpsSection>
    </OpsPanel>
  );
}
