"use client";

import { useId, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "../i18n/Link";
import { filterBy } from "../search-text";
import { useFormat, useT } from "../i18n/client";
import { callTypes } from "../content-ops";
import { caseResults, caseRoles, exhibitActions, postSees } from "../content-records";
import { STATES, jurisdiction, placeOf, stateNamed } from "../geo";
import { Gallery, MediaPicker, Thumb } from "./media";
import {
  OPS_FORM_SELECT,
  OPS_INPUT,
  OPS_SELECT,
  OpsButton,
  OpsEmpty,
  OpsField,
  OpsFigures,
  OpsHead,
  OpsLog,
  OpsPanel,
  OpsSearch,
  OpsSection,
  useScoped,
} from "./OpsPieces";
import {
  actor,
  addExhibit,
  moveExhibit,
  openCase,
  updateCase,
  updateComplainant,
  type CaseFile,
  type CaseStage,
  type Media,
} from "./store";
import { commandLabel, line } from "./Where";
import { CloseIcon, PlusIcon } from "./icons";
import { CaseGlyph } from "./ops-glyphs";

const STAGES: CaseStage[] = ["Investigating", "Charged to court", "Closed"];

const STAGE_TONE: Record<CaseStage, string> = {
  Investigating: "bg-ops-route-wash text-ops-route",
  "Charged to court": "bg-ops-scene-wash text-ops-scene",
  Closed: "bg-ops-fill text-ops-dim",
};

export function StageTag({ stage }: { stage: CaseStage }) {
  const t = useT();
  return (
    <span className={`npf-pill ${STAGE_TONE[stage]}`}>
      <span aria-hidden className="npf-pill-dot" />
      {t(stage)}
    </span>
  );
}

/**
 * Case files: what a call becomes once it needs investigating. The UK's
 * forces work these in a records system (Niche, Athena) beside the dispatch
 * one, and US forces in an RMS; the NPF's paper equivalent is the case diary
 * kept by the Investigating Police Officer.
 *
 * The board leads with the cases nobody is investigating, the same way the
 * calls board leads with the calls nobody is attending.
 */
export default function OpsCases() {
  const t = useT();
  const id = useId();
  const { cases, session, viewing } = useScoped();
  const asked = useSearchParams().get("case");
  const [selected, setSelected] = useState<string | null>(asked);
  const [seen, setSeen] = useState(asked);
  if (asked !== seen) {
    setSeen(asked);
    setSelected(asked);
  }
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("");
  const [mine, setMine] = useState(session?.post === "investigator");
  const [opening, setOpening] = useState(false);
  const me = session?.name ?? "";

  const visible = useMemo(() => {
    const shown = cases
      .filter((c) => (!stage || c.stage === stage) && (!mine || c.ipo === me))
      .sort(
        (a, b) =>
          Number(!a.ipo && a.stage !== "Closed") === Number(!b.ipo && b.stage !== "Closed")
            ? b.updated.localeCompare(a.updated)
            : Number(!b.ipo && b.stage !== "Closed") - Number(!a.ipo && a.stage !== "Closed"),
      );
    return filterBy(shown, query, (c) =>
      [c.id, c.offence, t(c.offence), c.summary, c.where.lga, c.where.state, c.ipo ?? "", ...c.people.map((p) => p.name), c.incident ?? ""].join(" "),
    );
  }, [cases, stage, mine, me, query, t]);

  const open = cases.filter((c) => c.stage !== "Closed");
  const noIpo = open.filter((c) => !c.ipo).length;
  const current = cases.find((c) => c.id === selected) ?? null;

  return (
    <div className="space-y-8">
      <OpsHead
        title={t("Case files")}
        action={
          <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
            <OpsFigures
              figures={[
                { label: t("Open"), value: open.length },
                { label: t("No officer"), value: noIpo, tone: noIpo ? "var(--ops-p1)" : "var(--ops-dim)" },
                { label: t("In court"), value: cases.filter((c) => c.stage === "Charged to court").length },
                { label: t("Closed"), value: cases.length - open.length, tone: "var(--ops-dim)" },
              ]}
            />
            <OpsButton tone={opening ? "quiet" : "brand"} aria-expanded={opening} onClick={() => setOpening((v) => !v)}>
              {opening ? <CloseIcon aria-hidden className="size-4" /> : <PlusIcon aria-hidden className="size-4" />}
              {opening ? t("Cancel") : t("Open a case")}
            </OpsButton>
          </div>
        }
      />

      {opening ? (
        <NewCase
          viewing={viewing}
          me={session?.post === "investigator" ? me : null}
          onDone={(c) => {
            setOpening(false);
            setSelected(c.id);
          }}
        />
      ) : null}

      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <OpsSearch
          id={`${id}-q`}
          label={t("Filter cases")}
          placeholder={t("Reference, offence, name or LGA")}
          value={query}
          onChange={setQuery}
          found={visible.length}
        />
        <label htmlFor={`${id}-stage`} className="sr-only">{t("Stage")}</label>
        <select id={`${id}-stage`} value={stage} onChange={(e) => setStage(e.target.value)} className={OPS_SELECT}>
          <option value="">{t("Any stage")}</option>
          {STAGES.map((s) => (
            <option key={s} value={s}>{t(s)}</option>
          ))}
        </select>
        <OpsButton tone={mine ? "brand" : "quiet"} aria-pressed={mine} onClick={() => setMine((v) => !v)}>
          {t("My cases")}
        </OpsButton>
        <p aria-live="polite" className="ms-auto text-xs text-ops-dim tabular-nums">
          {t("{shown} of {total} cases", { shown: visible.length, total: cases.length })}
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px] 2xl:grid-cols-[minmax(0,1fr)_460px] print:block">
        <div className="min-w-0 print:hidden">
          <OpsPanel flush>
            <table className="w-full text-start text-sm">
              <caption className="sr-only">{t("Case files, with offence, place, stage and officer")}</caption>
              <thead className="npf-ops-thead text-xs text-ops-dim">
                <tr className="whitespace-nowrap">
                  <th scope="col" className="py-3 ps-5 pe-4 font-medium">{t("Reference")}</th>
                  <th scope="col" className="w-full py-3 pe-4 font-medium">{t("Offence / place")}</th>
                  <th scope="col" className="hidden py-3 pe-4 font-medium md:table-cell">{t("Stage")}</th>
                  <th scope="col" className="hidden py-3 pe-5 font-medium sm:table-cell">{t("Officer")}</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelected(c.id)}
                    aria-selected={selected === c.id}
                    className={`cursor-pointer border-b border-ops-line-soft last:border-0 ${selected === c.id ? "bg-npf-mist" : "hover:bg-ops-hover"}`}
                  >
                    <th scope="row" className="py-3.5 ps-5 pe-4 align-top font-normal whitespace-nowrap max-sm:ps-4 max-sm:pe-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(c.id);
                        }}
                        className="font-mono text-xs text-ops-text tabular-nums hover:underline"
                      >
                        {c.id}
                      </button>
                    </th>
                    <td className="py-3.5 pe-4 align-top">
                      <span className="font-medium">{t(c.offence)}</span>
                      <span className="mt-0.5 block text-xs text-ops-dim">
                        {placeOf(c.where.address ?? c.where.lga, c.where, !viewing)}
                      </span>
                      <span className="mt-1.5 block md:hidden"><StageTag stage={c.stage} /></span>
                      {/* The officer column folds in here on a phone. */}
                      <span className={`mt-1 block text-xs sm:hidden ${c.ipo || c.stage === "Closed" ? "text-ops-dim" : "font-semibold text-ops-p1"}`}>
                        {c.ipo ? t(c.ipo) : c.stage === "Closed" ? null : t("No officer")}
                      </span>
                    </td>
                    <td className="hidden py-3.5 pe-4 align-top md:table-cell"><StageTag stage={c.stage} /></td>
                    <td className="hidden py-3.5 pe-5 align-top text-xs whitespace-nowrap sm:table-cell">
                      {c.ipo ? (
                        <span className="font-medium">{t(c.ipo)}</span>
                      ) : c.stage === "Closed" ? (
                        <span className="text-ops-dim">—</span>
                      ) : (
                        <span className="font-semibold text-ops-p1">{t("No officer")}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visible.length === 0 ? (
              <OpsEmpty
                tone={cases.length ? "none" : "idle"}
                icon={<CaseGlyph className="size-6" />}
                title={cases.length ? t("No case matches those filters") : t("No case files yet")}
                hint={
                  cases.length
                    ? t("Clear the search or the stage filter to see the rest.")
                    : t("A case is opened from a call that needs investigating, or here with Open a case.")
                }
                action={
                  cases.length ? (
                    <OpsButton onClick={() => { setQuery(""); setStage(""); setMine(false); }}>
                      <CloseIcon aria-hidden className="size-3.5" />
                      {t("Clear filters")}
                    </OpsButton>
                  ) : undefined
                }
              />
            ) : null}
          </OpsPanel>
        </div>

        <div className="lg:sticky lg:top-[calc(var(--ops-top)+1.25rem)] lg:self-start">
          {current ? (
            <CaseDetail key={current.id} file={current} onClose={() => setSelected(null)} />
          ) : (
            <OpsPanel title={t("Case file")} className="max-lg:hidden" flush>
              <OpsEmpty tone="idle" icon={<CaseGlyph className="size-6" />} hint={t("Pick a case to read it, assign an officer, add statements and exhibits, or update the complainant.")} />
            </OpsPanel>
          )}
        </div>
      </div>
    </div>
  );
}

/** Opening a case by hand: a walk-in complaint, or a matter that never was a call. */
function NewCase({
  viewing,
  me,
  onDone,
}: {
  viewing: string | null;
  me: string | null;
  onDone: (c: CaseFile) => void;
}) {
  const t = useT();
  const id = useId();
  const [offence, setOffence] = useState(callTypes[0]);
  const [summary, setSummary] = useState("");
  const [state, setState] = useState(viewing ?? "");
  const [lga, setLga] = useState("");
  const [address, setAddress] = useState("");
  const [complainant, setComplainant] = useState("");
  const lgas = stateNamed(state)?.lgas ?? [];
  const ready = summary.trim() && state && lga;
  return (
    <OpsPanel title={t("Open a case")}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!ready) return;
          onDone(
            openCase({
              offence,
              summary: summary.trim(),
              where: jurisdiction(state, lga, address.trim() || undefined),
              people: complainant.trim() ? [{ role: "Complainant", name: complainant.trim() }] : [],
              ipo: me,
            }),
          );
        }}
        className="grid gap-3 sm:grid-cols-2"
      >
        <OpsField id={`${id}-off`} label={t("Offence")}>
          <select id={`${id}-off`} value={offence} onChange={(e) => setOffence(e.target.value)} className={OPS_FORM_SELECT}>
            {callTypes.map((c) => <option key={c} value={c}>{t(c)}</option>)}
          </select>
        </OpsField>
        <OpsField id={`${id}-who`} label={t("Complainant")}>
          <input id={`${id}-who`} value={complainant} onChange={(e) => setComplainant(e.target.value)} className={OPS_INPUT} />
        </OpsField>
        <OpsField id={`${id}-state`} label={t("State")}>
          <select id={`${id}-state`} value={state} disabled={!!viewing} onChange={(e) => { setState(e.target.value); setLga(""); }} className={OPS_FORM_SELECT}>
            <option value="">{t("Choose a state")}</option>
            {STATES.map((s) => <option key={s.name} value={s.name}>{commandLabel(t, s.name)}</option>)}
          </select>
        </OpsField>
        <OpsField id={`${id}-lga`} label={t("Local Government Area")}>
          <select id={`${id}-lga`} value={lga} disabled={!state} onChange={(e) => setLga(e.target.value)} className={OPS_FORM_SELECT}>
            <option value="">{state ? t("Choose one of {n} areas", { n: lgas.length }) : t("Choose a state first")}</option>
            {lgas.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </OpsField>
        <OpsField id={`${id}-addr`} label={t("Street or landmark")} className="sm:col-span-2">
          <input id={`${id}-addr`} value={address} onChange={(e) => setAddress(e.target.value)} className={OPS_INPUT} />
        </OpsField>
        <OpsField id={`${id}-sum`} label={t("What happened")} className="sm:col-span-2">
          <textarea id={`${id}-sum`} rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} className={OPS_INPUT} />
        </OpsField>
        <div className="sm:col-span-2">
          <OpsButton type="submit" tone="brand" disabled={!ready}>{t("Open the case file")}</OpsButton>
        </div>
      </form>
    </OpsPanel>
  );
}

/** One case, worked: officer, stage, people, statements, exhibits, updates. */
function CaseDetail({ file, onClose }: { file: CaseFile; onClose: () => void }) {
  const t = useT();
  const format = useFormat();
  const id = useId();
  const { incidents, custody, session, cases } = useScoped();
  const call = incidents.find((i) => i.id === file.incident);
  const held = custody.filter((d) => d.caseId === file.id);
  const [closing, setClosing] = useState(false);
  const [result, setResult] = useState("");
  // Officers the desk can hand the case to: whoever already holds a case in
  // this command, and the officer at the desk.
  const officers = [...new Set([...cases.map((c) => c.ipo).filter(Boolean), session?.name].filter(Boolean) as string[])].sort();

  return (
    <OpsPanel
      title={file.id}
      action={
        <span className="flex gap-2 print:hidden">
        {/* The case file on paper, for the prosecutor or the court: the
            board around it drops away and the diary prints in full. */}
        <button type="button" onClick={() => window.print()} className="inline-flex h-8 items-center rounded-(--ops-control-radius) px-3 text-xs font-medium text-ops-text ring-1 ring-ops-line-soft ring-inset hover:bg-ops-hover">
          {t("Print case file")}
        </button>
        <button type="button" onClick={onClose} aria-label={t("Close case file")} className="grid size-8 place-items-center rounded-(--ops-control-radius) text-ops-dim ring-1 ring-ops-line-soft ring-inset hover:bg-ops-hover hover:text-ops-text">
          <CloseIcon className="size-4" />
        </button>
        </span>
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <StageTag stage={file.stage} />
        {file.result ? <span className="text-xs text-ops-dim">{t(file.result)}</span> : null}
      </div>
      <h3 className="mt-3 font-secondary text-base font-bold">{t(file.offence)}</h3>
      <p className="mt-0.5 text-sm text-ops-dim">{placeOf(file.where.address ?? file.where.lga, file.where)}</p>
      <p className="mt-3 text-sm leading-relaxed">{file.summary}</p>

      <dl className="mt-4 grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-3 gap-y-1.5 border-t border-ops-line-soft pt-3 text-xs">
        <dt className="text-ops-dim">{t("Opened")}</dt>
        <dd className="tabular-nums">{format.dateTime(file.opened)}</dd>
        {file.incident ? (
          <>
            <dt className="text-ops-dim">{t("From call")}</dt>
            <dd>
              {postSees(session?.post, "/app/police/incidents") ? (
                <Link href={`/app/police/incidents?call=${file.incident}`} className="font-mono font-medium text-ops-accent hover:underline">
                  {file.incident}
                </Link>
              ) : (
                <span className="font-mono font-medium">{file.incident}</span>
              )}
            </dd>
          </>
        ) : null}
        <dt className="text-ops-dim">{t("Investigator")}</dt>
        <dd>
          <label htmlFor={`${id}-ipo`} className="sr-only">{t("Investigating Police Officer")}</label>
          <select
            id={`${id}-ipo`}
            value={file.ipo ?? ""}
            onChange={(e) => updateCase(file.id, { ipo: e.target.value || null })}
            className={`npf-ops-select h-8 w-full ps-2 text-xs font-medium ${file.ipo ? "" : "text-ops-p1"}`}
          >
            <option value="">{t("No officer assigned")}</option>
            {officers.map((o) => <option key={o} value={o}>{t(o)}</option>)}
          </select>
        </dd>
      </dl>

      {/* The stage moves forward by its buttons; closing asks how it ended. */}
      <div className="mt-4 flex flex-wrap gap-2">
        {file.stage === "Investigating" ? (
          <OpsButton tone="brand" onClick={() => updateCase(file.id, { stage: "Charged to court" })}>
            {t("Charged to court")}
          </OpsButton>
        ) : null}
        {file.stage !== "Closed" ? (
          <OpsButton onClick={() => setClosing((v) => !v)} aria-expanded={closing}>{t("Close the case")}</OpsButton>
        ) : (
          <OpsButton onClick={() => updateCase(file.id, { stage: "Investigating", result: undefined })}>{t("Reopen the case")}</OpsButton>
        )}
      </div>
      {closing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!result) return;
            updateCase(file.id, { stage: "Closed", result });
            setClosing(false);
          }}
          className="mt-3 grid gap-2 rounded-chip bg-ops-fill p-3"
        >
          <label htmlFor={`${id}-res`} className="text-xs font-semibold">{t("How did the case end?")}</label>
          <select id={`${id}-res`} required value={result} onChange={(e) => setResult(e.target.value)} className={OPS_FORM_SELECT}>
            <option value="">{t("Choose a result")}</option>
            {caseResults.map((r) => <option key={r} value={r}>{t(r)}</option>)}
          </select>
          <div><OpsButton type="submit" tone="brand" disabled={!result}>{t("Close the case")}</OpsButton></div>
        </form>
      ) : null}

      <People file={file} />
      <Statements file={file} />
      <Exhibits file={file} />

      {call?.media?.length ? (
        <OpsSection title={t("Evidence from the call")} count={call.media.length}>
          <Gallery media={call.media} />
        </OpsSection>
      ) : null}

      <OpsSection
        title={t("Custody")}
        count={held.length}
        action={
          file.stage !== "Closed" ? (
            <Link href={`/app/police/custody?book=${encodeURIComponent(file.id)}`} className="text-xs font-medium text-ops-accent hover:underline">
              {t("Book a suspect in")}
            </Link>
          ) : undefined
        }
      >
        {held.length ? (
          <ul className="space-y-1.5 text-xs">
            {held.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3">
                <Link href={`/app/police/custody?held=${d.id}`} className="font-medium hover:underline">{d.name}</Link>
                <span className="text-ops-dim">{t(d.status)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-ops-dim">{t("Nobody held on this case.")}</p>
        )}
      </OpsSection>

      <Complainant file={file} />

      <OpsSection title={t("Case diary")}>
        <OpsLog lines={file.log} render={(l) => line(t, l.text, l.vars)} time={format.time} />
      </OpsSection>
    </OpsPanel>
  );
}

function People({ file }: { file: CaseFile }) {
  const t = useT();
  const id = useId();
  const [adding, setAdding] = useState(false);
  const [role, setRole] = useState(caseRoles[0]);
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  return (
    <OpsSection
      title={t("People")}
      count={file.people.length}
      action={<AddToggle open={adding} onClick={() => setAdding((v) => !v)} />}
    >
      {file.people.length ? (
        <ul className="divide-y divide-ops-line-soft text-xs">
          {file.people.map((p, n) => (
            <li key={n} className="flex items-baseline gap-3 py-1.5">
              <span className="w-20 shrink-0 text-ops-dim">{t(p.role)}</span>
              <span className="min-w-0">
                <span className="font-medium">{p.name}</span>
                {p.detail ? <span className="block text-ops-dim">{p.detail}</span> : null}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-ops-dim">{t("No one recorded yet.")}</p>
      )}
      {adding ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            updateCase(
              file.id,
              { people: [...file.people, { role, name: name.trim(), detail: detail.trim() || undefined }] },
              { text: "{role} added: {name}.", vars: { role, name: name.trim() } },
            );
            setName("");
            setDetail("");
            setAdding(false);
          }}
          className="mt-3 grid gap-2 rounded-chip bg-ops-fill p-3 sm:grid-cols-2"
        >
          <OpsField id={`${id}-role`} label={t("Role")}>
            <select id={`${id}-role`} value={role} onChange={(e) => setRole(e.target.value)} className={OPS_FORM_SELECT}>
              {caseRoles.map((r) => <option key={r} value={r}>{t(r)}</option>)}
            </select>
          </OpsField>
          <OpsField id={`${id}-name`} label={t("Name")}>
            <input id={`${id}-name`} value={name} onChange={(e) => setName(e.target.value)} className={OPS_INPUT} />
          </OpsField>
          <OpsField id={`${id}-det`} label={t("Note")} className="sm:col-span-2">
            <input id={`${id}-det`} value={detail} onChange={(e) => setDetail(e.target.value)} placeholder={t("Age, address, phone, condition")} className={OPS_INPUT} />
          </OpsField>
          <div><OpsButton type="submit" tone="brand" disabled={!name.trim()}>{t("Add")}</OpsButton></div>
        </form>
      ) : null}
    </OpsSection>
  );
}

function Statements({ file }: { file: CaseFile }) {
  const t = useT();
  const format = useFormat();
  const id = useId();
  const [adding, setAdding] = useState(false);
  const [who, setWho] = useState("");
  const [text, setText] = useState("");
  return (
    <OpsSection
      title={t("Statements")}
      count={file.statements.length}
      action={<AddToggle open={adding} onClick={() => setAdding((v) => !v)} />}
    >
      {file.statements.length ? (
        <ul className="space-y-3 text-xs">
          {file.statements.map((s, n) => (
            <li key={n}>
              <p className="flex justify-between gap-3">
                <span className="font-semibold">{s.who}</span>
                <time className="text-ops-dim tabular-nums" dateTime={s.at}>{format.dateTime(s.at)}</time>
              </p>
              <p className="mt-1 leading-relaxed">{s.text}</p>
              <p className="mt-0.5 text-2xs text-ops-dim">{t("Taken by {by}", { by: t(s.by) })}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-ops-dim">{t("No statement taken yet.")}</p>
      )}
      {adding ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!who.trim() || !text.trim()) return;
            updateCase(
              file.id,
              { statements: [...file.statements, { at: new Date().toISOString(), by: actor(), who: who.trim(), text: text.trim() }] },
              { text: "Statement taken from {who}.", vars: { who: who.trim() } },
            );
            setWho("");
            setText("");
            setAdding(false);
          }}
          className="mt-3 grid gap-2 rounded-chip bg-ops-fill p-3"
        >
          <OpsField id={`${id}-who`} label={t("Statement of")}>
            <input id={`${id}-who`} value={who} onChange={(e) => setWho(e.target.value)} list={`${id}-people`} className={OPS_INPUT} />
            <datalist id={`${id}-people`}>
              {file.people.map((p) => <option key={p.name} value={p.name} />)}
            </datalist>
          </OpsField>
          <OpsField id={`${id}-text`} label={t("Statement")}>
            <textarea id={`${id}-text`} rows={4} value={text} onChange={(e) => setText(e.target.value)} className={OPS_INPUT} />
          </OpsField>
          <p className="text-2xs text-ops-dim">
            {t("A suspect's statement under caution is recorded on video, or taken with a lawyer or chosen person present (ACJA 2015 s.17).")}
          </p>
          <div><OpsButton type="submit" tone="brand" disabled={!who.trim() || !text.trim()}>{t("Add statement")}</OpsButton></div>
        </form>
      ) : null}
    </OpsSection>
  );
}

function Exhibits({ file }: { file: CaseFile }) {
  const t = useT();
  const format = useFormat();
  const id = useId();
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState("");
  const [media, setMedia] = useState<Media[]>([]);
  return (
    <OpsSection
      title={t("Exhibits")}
      count={file.exhibits.length}
      action={<AddToggle open={adding} onClick={() => setAdding((v) => !v)} />}
    >
      {file.exhibits.length ? (
        <ul className="space-y-3">
          {file.exhibits.map((ex) => (
            <li key={ex.id} className="rounded-chip ring-1 ring-ops-line-soft ring-inset">
              <div className="flex items-start gap-3 p-3">
                {ex.media ? (
                  <span className="w-14 shrink-0 overflow-clip rounded-md">
                    <Thumb media={ex.media} className="aspect-square" />
                  </span>
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="text-xs">
                    <span className="font-mono font-semibold">{ex.id}</span> · {ex.label}
                  </p>
                  {ex.media ? (
                    <p className="mt-0.5 truncate font-mono text-2xs text-ops-dim" title={ex.media.sha256}>
                      SHA-256 {ex.media.sha256.slice(0, 16)}…
                    </p>
                  ) : null}
                  <ol className="mt-2 space-y-1 border-s border-ops-line ps-3 text-2xs">
                    {ex.trail.map((step, n) => (
                      <li key={n}>
                        <span className="font-medium">{t(step.action)}</span>
                        <span className="block text-ops-dim">
                          {format.dateTime(step.at)} · {t(step.by)}
                        </span>
                      </li>
                    ))}
                  </ol>
                  <label htmlFor={`${id}-${ex.id}`} className="sr-only">{t("Move exhibit {ex}", { ex: ex.id })}</label>
                  <select
                    id={`${id}-${ex.id}`}
                    value=""
                    onChange={(e) => e.target.value && moveExhibit(file.id, ex.id, e.target.value)}
                    className="npf-ops-select mt-2 h-8 ps-2 text-xs"
                  >
                    <option value="">{t("Record a movement…")}</option>
                    {exhibitActions.map((a) => <option key={a} value={a}>{t(a)}</option>)}
                  </select>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-ops-dim">{t("No exhibit booked in yet.")}</p>
      )}
      {adding ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!label.trim() && !media.length) return;
            if (media.length)
              media.forEach((m, n) => addExhibit(file.id, label.trim() ? (media.length > 1 ? `${label.trim()} (${n + 1})` : label.trim()) : m.name, m));
            else addExhibit(file.id, label.trim());
            setLabel("");
            setMedia([]);
            setAdding(false);
          }}
          className="mt-3 grid gap-3 rounded-chip bg-ops-fill p-3"
        >
          <OpsField id={`${id}-lab`} label={t("What it is")}>
            <input id={`${id}-lab`} value={label} onChange={(e) => setLabel(e.target.value)} placeholder={t("Knife recovered at the scene")} className={OPS_INPUT} />
          </OpsField>
          <MediaPicker id={`${id}-media`} tone="ops" optional label={t("Photos or files")} media={media} onChange={setMedia} by={actor()} />
          <div><OpsButton type="submit" tone="brand" disabled={!label.trim() && !media.length}>{t("Book it in")}</OpsButton></div>
        </form>
      ) : null}
    </OpsSection>
  );
}

/** Keeping the complainant informed, in words they will read on the tracker. */
function Complainant({ file }: { file: CaseFile }) {
  const t = useT();
  const format = useFormat();
  const id = useId();
  const [text, setText] = useState("");
  return (
    <OpsSection title={t("Updates to the complainant")} count={file.updates.length}>
      {file.updates.length ? (
        <ul className="space-y-2 text-xs">
          {file.updates.map((u, n) => (
            <li key={n} className="rounded-chip bg-npf-mist px-3 py-2">
              <time className="block text-2xs text-ops-dim tabular-nums" dateTime={u.at}>{format.dateTime(u.at)}</time>
              <span className="leading-relaxed">{u.text}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {file.incident ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!text.trim()) return;
            updateComplainant(file.id, text.trim());
            setText("");
          }}
          className="mt-3 grid gap-2"
        >
          <label htmlFor={`${id}-u`} className="sr-only">{t("Update to the complainant")}</label>
          <textarea
            id={`${id}-u`}
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("What has happened, in plain words. No names of suspects or witnesses.")}
            className={OPS_INPUT}
          />
          <div>
            <OpsButton type="submit" tone="brand" disabled={!text.trim()} className="!h-9 !text-xs">
              {t("Send update")}
            </OpsButton>
          </div>
          <p className="text-2xs text-ops-dim">{t("Shown on the tracker under {ref}, and in their account if they have one.", { ref: file.incident })}</p>
        </form>
      ) : (
        <p className="text-xs text-ops-dim">{t("Opened without a report reference, so there is no tracker to update. Call the complainant instead.")}</p>
      )}
    </OpsSection>
  );
}

function AddToggle({ open, onClick }: { open: boolean; onClick: () => void }) {
  const t = useT();
  return (
    <button type="button" onClick={onClick} aria-expanded={open} className="inline-flex items-center gap-1 text-xs font-medium text-ops-accent hover:underline">
      {open ? <CloseIcon aria-hidden className="size-3.5" /> : <PlusIcon aria-hidden className="size-3.5" />}
      {open ? t("Cancel") : t("Add")}
    </button>
  );
}
