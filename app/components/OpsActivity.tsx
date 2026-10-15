"use client";

import { useId, useMemo, useState } from "react";
import Link from "../i18n/Link";
import { filterBy } from "../search-text";
import { useFormat, useT } from "../i18n/client";
import { OPS_SELECT, OpsEmpty, OpsFigures, OpsHead, OpsPanel, OpsSearch, useMinute, useScoped } from "./OpsPieces";
import { line } from "./Where";

type Entry = {
  at: string;
  by: string;
  ref: string;
  href: string;
  text: string;
  vars?: Record<string, string>;
};

const SPANS = [
  { hours: 12, label: "Last 12 hours" },
  { hours: 24, label: "Last 24 hours" },
  { hours: 168, label: "Last 7 days" },
];

/** Shown at most, newest first: a page a supervisor reads, not an export. */
const LIMIT = 300;

/**
 * Who did what, on every record in view: calls, case files, the custody
 * register and alerts, merged into one list with the officer's name and
 * service number on each line.
 *
 * The FBI's CJIS policy makes US forces keep exactly this, and the Police
 * Act 2020 makes NPF officers answerable for every arrest and detention;
 * a supervisor (or the Complaint Response Unit) needs to read it without
 * opening forty records. The server keeps the full, unalterable copy
 * (docs/API-CONTRACT.md); this is the readable view of it.
 */
export default function OpsActivity() {
  const t = useT();
  const format = useFormat();
  const id = useId();
  const now = useMinute();
  const { incidents, cases, custody, alerts } = useScoped();
  const [hours, setHours] = useState(24);
  const [who, setWho] = useState("");
  const [query, setQuery] = useState("");

  const all = useMemo(() => {
    const out: Entry[] = [];
    for (const i of incidents)
      for (const l of i.log)
        if (l.by) out.push({ ...l, by: l.by, ref: i.id, href: `/app/police/incidents?call=${i.id}` });
    for (const c of cases)
      for (const l of c.log)
        if (l.by) out.push({ ...l, by: l.by, ref: c.id, href: `/app/police/cases?case=${encodeURIComponent(c.id)}` });
    for (const d of custody)
      for (const l of d.log)
        if (l.by) out.push({ ...l, by: l.by, ref: d.id, href: `/app/police/custody?held=${d.id}` });
    for (const a of alerts)
      out.push({ at: a.issued, by: a.by, ref: a.id, href: "/app/police/alerts", text: "Alert issued: {title}", vars: { title: a.title } });
    return out.sort((a, b) => b.at.localeCompare(a.at));
  }, [incidents, cases, custody, alerts]);

  const since = now - hours * 3_600_000;
  const inSpan = all.filter((e) => new Date(e.at).getTime() >= since);
  const people = [...new Set(inSpan.map((e) => e.by))].sort();
  const shown = filterBy(
    inSpan.filter((e) => !who || e.by === who),
    query,
    (e) => [e.ref, e.by, line(t, e.text, e.vars)].join(" "),
  );

  return (
    <div className="space-y-8">
      <OpsHead
        title={t("Activity")}
        lead={t("Every change on a call, case file, custody record or alert, with who made it.")}
        action={
          <OpsFigures
            figures={[
              { label: t("Entries"), value: inSpan.length },
              { label: t("Officers"), value: people.filter((p) => p !== "System" && p !== "Reporter").length },
            ]}
          />
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <OpsSearch id={`${id}-q`} label={t("Filter activity")} placeholder={t("Reference, officer or what happened")} value={query} onChange={setQuery} found={shown.length} />
        <label htmlFor={`${id}-who`} className="sr-only">{t("Officer")}</label>
        <select id={`${id}-who`} value={who} onChange={(e) => setWho(e.target.value)} className={OPS_SELECT}>
          <option value="">{t("Every officer")}</option>
          {people.map((p) => (
            <option key={p} value={p}>{t(p)}</option>
          ))}
        </select>
        <label htmlFor={`${id}-span`} className="sr-only">{t("Period")}</label>
        <select id={`${id}-span`} value={hours} onChange={(e) => setHours(Number(e.target.value))} className={OPS_SELECT}>
          {SPANS.map((s) => (
            <option key={s.hours} value={s.hours}>{t(s.label)}</option>
          ))}
        </select>
      </div>

      <OpsPanel flush>
        {shown.length ? (
          <table className="w-full text-start text-sm">
            <caption className="sr-only">{t("Activity, newest first, with time, officer, record and change")}</caption>
            <thead className="npf-ops-thead text-xs text-ops-dim">
              <tr className="whitespace-nowrap">
                <th scope="col" className="py-3 ps-5 pe-4 font-medium">{t("Time")}</th>
                <th scope="col" className="hidden py-3 pe-4 font-medium md:table-cell">{t("Officer")}</th>
                <th scope="col" className="py-3 pe-4 font-medium">{t("Record")}</th>
                <th scope="col" className="w-full py-3 pe-5 font-medium">{t("What happened")}</th>
              </tr>
            </thead>
            <tbody>
              {shown.slice(0, LIMIT).map((e, n) => (
                <tr key={e.at + e.ref + n} className="border-b border-ops-line-soft align-top last:border-0">
                  <td className="py-3 ps-5 pe-4 font-mono text-xs whitespace-nowrap text-ops-dim tabular-nums">
                    {format.dateTime(e.at)}
                  </td>
                  <td className="hidden py-3 pe-4 text-xs whitespace-nowrap md:table-cell">{t(e.by)}</td>
                  <td className="py-3 pe-4 whitespace-nowrap">
                    <Link href={e.href} className="font-mono text-xs font-medium text-ops-accent hover:underline">
                      {e.ref}
                    </Link>
                  </td>
                  <td className="py-3 pe-5 text-xs leading-relaxed">
                    {line(t, e.text, e.vars)}
                    <span className="mt-0.5 block text-2xs text-ops-dim md:hidden">{t(e.by)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <OpsEmpty tone="none" title={t("Nothing in this period")} hint={t("Widen the period or clear the officer and the search.")} />
        )}
        {shown.length > LIMIT ? (
          <p className="border-t border-ops-line-soft px-5 py-3 text-xs text-ops-dim">
            {t("Showing the newest {n}. Narrow by officer or search to see the rest.", { n: LIMIT })}
          </p>
        ) : null}
      </OpsPanel>
    </div>
  );
}
