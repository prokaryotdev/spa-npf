"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Link from "../i18n/Link";
import { fold } from "../search-text";
import { useFormat, useT } from "../i18n/client";
import { alertKinds, postSees } from "../content-records";
import { Gallery, MediaPicker } from "./media";
import {
  OPS_FORM_SELECT,
  OPS_INPUT,
  Elapsed,
  OpsButton,
  OpsEmpty,
  OpsField,
  OpsFigures,
  OpsHead,
  OpsPanel,
  OpsSection,
  useScoped,
} from "./OpsPieces";
import { actor, issueAlert, updateAlert, type Alert, type Media } from "./store";
import { commandLabel } from "./Where";
import { CheckIcon, CloseIcon, PlusIcon, SearchIcon } from "./icons";
import { AlertGlyph } from "./ops-glyphs";

const KIND_TONE: Record<Alert["kind"], string> = {
  "Wanted person": "bg-ops-p1-wash text-ops-p1",
  "Missing person": "bg-ops-p2-wash text-ops-p2",
  "Stolen vehicle": "bg-ops-route-wash text-ops-route",
  "Officer safety": "bg-ops-p1 text-white",
  Intelligence: "bg-ops-fill text-ops-dim",
};

export function KindTag({ kind }: { kind: Alert["kind"] }) {
  const t = useT();
  return <span className={`rounded-[4px] px-1.5 py-0.5 text-2xs font-semibold whitespace-nowrap ${KIND_TONE[kind]}`}>{t(kind)}</span>;
}

/** Plates are compared without spaces or dashes: "ABJ-482KD" finds "ABJ 482 KD". */
const squash = (s: string) => fold(s).replace(/[\s-]/g, "");

/**
 * Alerts: wanted and missing people, stolen vehicles and warnings, sent to a
 * command or to the whole Force, with the records check an officer at a
 * checkpoint runs before letting a car go. US officers run the same check
 * against NCIC; UK officers against the PNC.
 *
 * An alert marked public goes on the website's appeals page, and what the
 * public send back arrives here as tips.
 */
export default function OpsAlerts() {
  const t = useT();
  const { alerts, viewing, session } = useScoped();
  const [selected, setSelected] = useState<string | null>(null);
  const [issuing, setIssuing] = useState(false);
  const [past, setPast] = useState(false);

  const live = alerts.filter((a) => a.active);
  const shown = (past ? alerts : live).slice().sort((a, b) => b.issued.localeCompare(a.issued));
  const tips = alerts.reduce((n, a) => n + a.tips.filter((x) => !x.read).length, 0);
  const current = alerts.find((a) => a.id === selected) ?? null;

  return (
    <div className="space-y-8">
      <OpsHead
        title={t("Alerts")}
        lead={viewing ? t("This command's alerts and the Force-wide ones.") : t("Every alert in the Force.")}
        action={
          <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
            <OpsFigures
              figures={[
                { label: t("Active"), value: live.length },
                { label: t("Public appeals"), value: live.filter((a) => a.public).length },
                { label: t("New tips"), value: tips, tone: tips ? "#ffd27a" : "var(--ops-dim)" },
              ]}
            />
            <OpsButton tone={issuing ? "quiet" : "brand"} aria-expanded={issuing} onClick={() => setIssuing((v) => !v)}>
              {issuing ? <CloseIcon aria-hidden className="size-4" /> : <PlusIcon aria-hidden className="size-4" />}
              {issuing ? t("Cancel") : t("Issue an alert")}
            </OpsButton>
          </div>
        }
      />

      <RecordsCheck />

      {issuing ? (
        <IssueAlert
          viewing={viewing ?? session?.command ?? null}
          onDone={(a) => {
            setIssuing(false);
            setSelected(a.id);
          }}
        />
      ) : null}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        <OpsPanel
          title={past ? t("All alerts") : t("Active alerts")}
          count={shown.length || undefined}
          action={
            <OpsButton tone="ghost" className="!h-8 !text-xs" aria-pressed={past} onClick={() => setPast((v) => !v)}>
              {past ? t("Active only") : t("Include cancelled")}
            </OpsButton>
          }
          flush
          className="min-w-0"
        >
          {shown.length ? (
            <ul>
              {shown.map((a) => {
                const fresh = a.tips.filter((x) => !x.read).length;
                return (
                  <li key={a.id} className="border-b border-ops-line-soft last:border-0">
                    <button
                      type="button"
                      onClick={() => setSelected(a.id)}
                      aria-pressed={selected === a.id}
                      className={`flex w-full items-start gap-4 px-5 py-3.5 text-start transition-colors ${selected === a.id ? "bg-npf-mist" : "hover:bg-ops-hover"} ${a.active ? "" : "opacity-60"}`}
                    >
                      {/* A photo earns the space; the same bell tile on every
                          row said nothing, so a row without one starts with
                          its words. */}
                      {a.photo?.thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element -- a data URL made in the browser
                        <img src={a.photo.thumb} alt="" className="size-12 shrink-0 rounded-md object-cover" />
                      ) : null}
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <KindTag kind={a.kind} />
                          {a.public ? <span className="text-2xs font-medium text-ops-accent">{t("Public appeal")}</span> : null}
                          {!a.active ? <span className="text-2xs text-ops-dim">{t("Cancelled")}</span> : null}
                        </span>
                        <span className="mt-1 block text-sm font-medium text-npf-ink">{t(a.title)}</span>
                        <span className="mt-0.5 block text-xs text-ops-dim">
                          {a.scope ? commandLabel(t, a.scope) : t("Every command")}
                          {a.plate ? <> · <span className="font-mono">{a.plate}</span></> : null}
                        </span>
                      </span>
                      <span className="shrink-0 text-end">
                        <Elapsed from={a.issued} className="block text-xs text-ops-dim" />
                        {fresh ? (
                          <span className="mt-1 inline-block rounded-full bg-ops-p2 px-1.5 font-mono text-2xs font-semibold text-white">
                            {t("{n} new", { n: fresh })}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <OpsEmpty tone="clear" title={t("No active alerts")} hint={t("Nothing to look out for in this command right now.")} />
          )}
        </OpsPanel>

        <div className="lg:sticky lg:top-[calc(var(--ops-top)+1.25rem)] lg:self-start">
          {current ? (
            <AlertDetail key={current.id} alert={current} onClose={() => setSelected(null)} />
          ) : (
            <OpsPanel title={t("Alert")} className="max-lg:hidden" flush>
              <OpsEmpty tone="idle" icon={<AlertGlyph className="size-6" />} hint={t("Pick an alert to read it, publish it as an appeal, read the public's tips or cancel it.")} />
            </OpsPanel>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * One box, every register: alerts (wanted, missing, stolen), the custody
 * register, case files and calls. An officer at a checkpoint types a plate
 * or a name and gets an answer before the car pulls away.
 */
function RecordsCheck() {
  const t = useT();
  const id = useId();
  const { alerts, custody, cases, incidents, session } = useScoped();
  const [q, setQ] = useState("");
  const [asked, setAsked] = useState("");

  const hits = useMemo(() => {
    // A link only to a board this post works; the rest are named, not linked.
    const to = (board: string, href: string) => (postSees(session?.post, board) ? href : null);
    const want = squash(asked);
    if (want.length < 3) return null;
    const has = (s?: string) => !!s && squash(s).includes(want);
    return [
      ...alerts
        .filter((a) => a.active && (has(a.plate) || a.names?.some(has) || has(a.title)))
        .map((a) => ({ key: a.id, tone: "alert" as const, label: t(a.kind), what: t(a.title), href: null as string | null, alert: a })),
      ...custody
        .filter((d) => has(d.name) || has(d.id))
        .map((d) => ({ key: d.id, tone: "note" as const, label: t("Custody record"), what: `${d.name} · ${t(d.status)}`, href: to("/app/police/custody", `/app/police/custody?held=${d.id}`), alert: null })),
      ...cases
        .filter((c) => has(c.id) || c.people.some((p) => has(p.name)))
        .map((c) => ({
          key: c.id,
          tone: "note" as const,
          label: t("Case file"),
          what: `${c.id} · ${t(c.offence)}${c.people.filter((p) => has(p.name)).map((p) => ` · ${t(p.role)}: ${p.name}`).join("")}`,
          href: to("/app/police/cases", `/app/police/cases?case=${encodeURIComponent(c.id)}`),
          alert: null,
        })),
      ...incidents
        .filter((i) => has(i.id))
        .map((i) => ({ key: i.id, tone: "note" as const, label: t("Call"), what: `${i.id} · ${t(i.kind)}`, href: to("/app/police/incidents", `/app/police/incidents?call=${i.id}`), alert: null })),
    ];
  }, [asked, alerts, custody, cases, incidents, t, session?.post]);

  return (
    <OpsPanel title={t("Records check")}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setAsked(q);
        }}
        className="flex flex-wrap gap-2"
      >
        <label htmlFor={`${id}-q`} className="sr-only">{t("Name, plate number or reference")}</label>
        <input
          id={`${id}-q`}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("Name, plate number or reference")}
          autoComplete="off"
          spellCheck={false}
          className={`${OPS_INPUT} max-w-md flex-1`}
        />
        <OpsButton type="submit" tone="brand" disabled={q.trim().length < 3}>
          <SearchIcon aria-hidden className="size-4" />
          {t("Check")}
        </OpsButton>
      </form>
      <div aria-live="polite">
        {hits === null ? (
          <p className="mt-3 text-xs text-ops-dim">
            {t("Searches active alerts, the custody register, case files and calls in view. Three characters or more.")}
          </p>
        ) : hits.length === 0 ? (
          <p className="mt-4 flex items-center gap-2.5 rounded-chip bg-ops-ok-wash px-4 py-3 text-sm font-medium text-ops-ok">
            <CheckIcon aria-hidden className="size-4.5" />
            {t("No record for “{q}”.", { q: asked })}
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {hits.map((h) => (
              <li
                key={h.key}
                className={`flex flex-wrap items-center gap-x-3 gap-y-1 rounded-chip px-4 py-3 text-sm ring-1 ring-inset ${
                  h.tone === "alert" ? "bg-ops-p1-wash ring-[color-mix(in_srgb,var(--ops-p1)_30%,transparent)]" : "bg-npf-mist ring-ops-line-soft"
                }`}
              >
                <span className={`text-xs font-semibold ${h.tone === "alert" ? "text-ops-p1" : "text-ops-dim"}`}>{h.label}</span>
                <span className="min-w-0 flex-1 font-medium">{h.what}</span>
                {h.alert ? (
                  <span className="text-xs text-ops-p1">{t(h.alert.details)}</span>
                ) : h.href ? (
                  <Link href={h.href} className="text-xs font-medium text-ops-accent hover:underline">{t("Open")}</Link>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </OpsPanel>
  );
}

function IssueAlert({ viewing, onDone }: { viewing: string | null; onDone: (a: Alert) => void }) {
  const t = useT();
  const id = useId();
  const [kind, setKind] = useState<Alert["kind"]>("Wanted person");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [plate, setPlate] = useState("");
  const [names, setNames] = useState("");
  const [everywhere, setEverywhere] = useState(!viewing);
  const [pub, setPub] = useState(false);
  const [consent, setConsent] = useState(false);
  const needsConsent = kind === "Missing person" && pub;
  const [photo, setPhoto] = useState<Media[]>([]);
  const ready = title.trim() && details.trim() && (!needsConsent || consent);
  return (
    <OpsPanel title={t("Issue an alert")}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!ready) return;
          onDone(
            issueAlert({
              kind,
              title: title.trim(),
              details: details.trim(),
              plate: kind === "Stolen vehicle" && plate.trim() ? plate.trim().toUpperCase() : undefined,
              names: names.trim() ? names.split(",").map((n) => n.trim()).filter(Boolean) : undefined,
              photo: photo[0],
              scope: everywhere ? null : viewing,
              public: pub && kind !== "Officer safety" && kind !== "Intelligence",
              consent: kind === "Missing person" ? consent : undefined,
              incident: undefined,
            }),
          );
        }}
        className="grid gap-3 sm:grid-cols-2"
      >
        <OpsField id={`${id}-k`} label={t("Kind")}>
          <select id={`${id}-k`} value={kind} onChange={(e) => setKind(e.target.value as Alert["kind"])} className={OPS_FORM_SELECT}>
            {alertKinds.map((k) => <option key={k} value={k}>{t(k)}</option>)}
          </select>
        </OpsField>
        <OpsField id={`${id}-t`} label={t("Headline")}>
          <input id={`${id}-t`} value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("Black Toyota Camry taken at gunpoint, Ikeja")} className={OPS_INPUT} />
        </OpsField>
        <OpsField id={`${id}-d`} label={t("Description")} className="sm:col-span-2">
          <textarea id={`${id}-d`} rows={3} value={details} onChange={(e) => setDetails(e.target.value)} placeholder={t("What they look like, what they wore, where last seen, which way they went. Whether to approach.")} className={OPS_INPUT} />
        </OpsField>
        {kind === "Stolen vehicle" ? (
          <OpsField id={`${id}-p`} label={t("Plate number")}>
            <input id={`${id}-p`} value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="LND 123 AB" className={`${OPS_INPUT} font-mono uppercase`} />
          </OpsField>
        ) : (
          <OpsField id={`${id}-n`} label={t("Names and aliases, comma between")}>
            <input id={`${id}-n`} value={names} onChange={(e) => setNames(e.target.value)} className={OPS_INPUT} />
          </OpsField>
        )}
        <MediaPicker id={`${id}-ph`} tone="ops" optional max={1} label={t("Photo")} media={photo} onChange={setPhoto} by={actor()} />
        <fieldset className="grid gap-1.5 sm:col-span-2">
          <legend className="sr-only">{t("Who sees it")}</legend>
          {viewing ? (
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={everywhere} onChange={(e) => setEverywhere(e.target.checked)} />
              {t("Send to every command, not only {command}", { command: commandLabel(t, viewing) })}
            </label>
          ) : null}
          {kind !== "Officer safety" && kind !== "Intelligence" ? (
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={pub} onChange={(e) => setPub(e.target.checked)} />
              {t("Publish as a public appeal on the website, so people can send tips")}
            </label>
          ) : null}
          {needsConsent ? (
            <label className="flex items-center gap-2 text-xs font-medium text-ops-p2">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              {t("The family agreed to a public appeal and to the photo being shown")}
            </label>
          ) : null}
        </fieldset>
        <div className="sm:col-span-2">
          <OpsButton type="submit" tone="brand" disabled={!ready}>{t("Issue the alert")}</OpsButton>
        </div>
      </form>
    </OpsPanel>
  );
}

function AlertDetail({ alert, onClose }: { alert: Alert; onClose: () => void }) {
  const t = useT();
  const format = useFormat();
  // Opening the alert is reading its tips: the new-tip badge clears.
  useEffect(() => {
    if (alert.tips.some((x) => !x.read))
      updateAlert(alert.id, { tips: alert.tips.map((x) => ({ ...x, read: true })) });
  }, [alert.id, alert.tips]);
  const appealable = alert.kind !== "Officer safety" && alert.kind !== "Intelligence";
  return (
    <OpsPanel
      title={alert.id}
      action={
        <button type="button" onClick={onClose} aria-label={t("Close alert")} className="grid size-8 place-items-center rounded-(--ops-control-radius) text-ops-dim ring-1 ring-ops-line-soft ring-inset hover:bg-ops-hover hover:text-ops-text">
          <CloseIcon className="size-4" />
        </button>
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <KindTag kind={alert.kind} />
        <span className="text-xs text-ops-dim">{alert.scope ? commandLabel(t, alert.scope) : t("Every command")}</span>
      </div>
      <h3 className="mt-3 font-secondary text-base font-bold">{t(alert.title)}</h3>
      {alert.plate ? <p className="mt-1 font-mono text-sm font-semibold">{alert.plate}</p> : null}
      {alert.names?.length ? <p className="mt-1 text-sm">{alert.names.join(", ")}</p> : null}
      <p className="mt-3 text-sm leading-relaxed">{t(alert.details)}</p>
      {alert.photo ? (
        <div className="mt-3 max-w-40">
          <Gallery media={[alert.photo]} />
        </div>
      ) : null}
      <dl className="mt-4 grid grid-cols-[6rem_minmax(0,1fr)] gap-x-3 gap-y-1.5 border-t border-ops-line-soft pt-3 text-xs">
        <dt className="text-ops-dim">{t("Issued")}</dt>
        <dd className="tabular-nums">{format.dateTime(alert.issued)}</dd>
        <dt className="text-ops-dim">{t("By")}</dt>
        <dd>{t(alert.by)}</dd>
        {alert.incident ? (
          <>
            <dt className="text-ops-dim">{t("From call")}</dt>
            <dd className="font-mono font-medium">{alert.incident}</dd>
          </>
        ) : null}
      </dl>

      {alert.active ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {appealable ? (
            <OpsButton
              tone={alert.public ? "quiet" : "brand"}
              disabled={!alert.public && alert.kind === "Missing person" && !alert.consent}
              onClick={() => updateAlert(alert.id, { public: !alert.public })}
            >
              {alert.public ? t("Withdraw the appeal") : t("Publish as an appeal")}
            </OpsButton>
          ) : null}
          <OpsButton tone="danger" onClick={() => updateAlert(alert.id, { active: false, public: false })}>
            {alert.kind === "Missing person" ? t("Found: cancel") : alert.kind === "Stolen vehicle" ? t("Recovered: cancel") : t("Cancel the alert")}
          </OpsButton>
        </div>
      ) : (
        <OpsButton className="mt-4" onClick={() => updateAlert(alert.id, { active: true })}>{t("Reinstate")}</OpsButton>
      )}
      {alert.active && alert.kind === "Missing person" && !alert.public ? (
        <label className="mt-3 flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={!!alert.consent}
            onChange={(e) => updateAlert(alert.id, { consent: e.target.checked })}
          />
          {t("The family agreed to a public appeal and to the photo being shown")}
        </label>
      ) : null}
      {alert.public ? (
        <p className="mt-2 text-xs text-ops-dim">
          {t("On the website's appeals page.")}{" "}
          <Link href="/app/appeals" className="font-medium text-ops-accent hover:underline">{t("See it")}</Link>
        </p>
      ) : null}

      <OpsSection title={t("Tips from the public")} count={alert.tips.length}>
        {alert.tips.length ? (
          <ul className="space-y-2 text-xs">
            {alert.tips.slice().reverse().map((tip, n) => (
              <li key={n} className="rounded-chip bg-npf-mist px-3 py-2">
                <time className="block text-2xs text-ops-dim tabular-nums" dateTime={tip.at}>{format.dateTime(tip.at)}</time>
                <span className="leading-relaxed">{tip.text}</span>
                <span className="mt-1 block text-2xs text-ops-dim">
                  {tip.contact ? (
                    <a href={`tel:${tip.contact}`} className="font-medium text-ops-accent">{tip.contact}</a>
                  ) : (
                    t("Anonymous")
                  )}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-ops-dim">
            {alert.public ? t("No tips yet.") : t("Publish it as an appeal to take tips from the public.")}
          </p>
        )}
      </OpsSection>
    </OpsPanel>
  );
}
