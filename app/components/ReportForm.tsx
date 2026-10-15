"use client";

import Link from "../i18n/Link";
import { useSearchParams } from "next/navigation";
import { useEffect, useId, useState } from "react";
import {
  complaintLines,
  gradeReport,
  reportGroups,
  reportInjuries,
  reportKinds,
  reportWhen,
} from "../content-report";
import { jurisdiction, stateNamed } from "../geo";
import { useFormat, useLang, useT } from "../i18n/client";
import { LANG_LABEL } from "../i18n/config";
import { fileReport, useStore, type Incident, type Media } from "./store";
import { MediaPicker } from "./media";
import { Honeypot } from "./Honeypot";
import {
  AlertIcon,
  ArrowRight,
  CashIcon,
  CheckIcon,
  ClockIcon,
  FileIcon,
  HomeIcon,
  MoreIcon,
  PhoneCallIcon,
  PhoneIcon,
  ShieldIcon,
  UserCircle,
} from "./icons";
import {
  ChoiceCard,
  Chips,
  Declare,
  PHONE,
  Review,
  StepList,
  StepPanel,
  TextField,
  cleanPhone,
  focusFirstError,
} from "./Wizard";
import {
  RouteCard,
  WherePicker,
  commandLabel,
  divisionLabel,
  type WhereErrors,
} from "./Where";

const STEPS = [
  "Safety",
  "What happened",
  "Where",
  "Details",
  "About you",
  "Check and send",
];

/** The kinds in their groups, each with its glyph; strays join the last. */
const GROUP_ICONS = [UserCircle, HomeIcon, CashIcon, MoreIcon];
const KIND_GROUPS = reportGroups.map((g, i, all) => ({
  label: g.label,
  Icon: GROUP_ICONS[i] ?? MoreIcon,
  kinds: reportKinds.filter((k) =>
    i === all.length - 1
      ? !all.slice(0, -1).some((o) => o.kinds.includes(k.kind))
      : g.kinds.includes(k.kind),
  ),
}));

type Draft = {
  danger: "" | "yes" | "no";
  kind: string;
  when: string;
  occurred: string;
  state: string;
  lga: string;
  address: string;
  summary: string;
  injuries: string;
  suspects: string;
  evidence: Media[];
  /** The device's position, when the reporter used their location. */
  geo?: { lat: number; lng: number };
  /** Who the report is for: themselves, someone else, an organisation. */
  behalf: "" | "myself" | "someone" | "organisation";
  behalfName: string;
  identity: "" | "named" | "anonymous";
  name: string;
  phone: string;
  safeToCall: boolean;
  declared: boolean;
};

const EMPTY: Draft = {
  danger: "",
  kind: "",
  when: "",
  occurred: "",
  state: "",
  lga: "",
  address: "",
  summary: "",
  injuries: "",
  suspects: "",
  evidence: [],
  behalf: "myself",
  behalfName: "",
  identity: "",
  name: "",
  phone: "",
  safeToCall: true,
  declared: false,
};

/**
 * A half-written report survives a refresh or a dropped connection in this
 * tab, and nowhere else: sessionStorage dies with the tab, which is what a
 * person reporting from a shared phone would want.
 */
const DRAFT_KEY = "dp:report-draft";

type Errors = Partial<Record<keyof Draft, string>>;

/**
 * Reporting a crime, from "is anyone in danger" to a reference number and
 * the name of the command that has it.
 *
 * The order is the order a desk officer would ask in: safety first, then
 * what, where, the detail, and who is reporting. Where comes before detail
 * because it decides who reads the detail.
 */
export default function ReportForm() {
  const t = useT();
  const format = useFormat();
  const id = useId();
  const lang = useLang();
  const params = useSearchParams();
  const { session, loaded } = useStore();
  const [step, setStep] = useState(0);
  const [d, setD] = useState<Draft>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [filed, setFiled] = useState<Incident | null>(null);
  const [restored, setRestored] = useState(false);
  const [trap, setTrap] = useState("");

  // Bring back a draft, and take ?kind= from the service page that sent us.
  useEffect(() => {
    let draft: Draft = EMPTY;
    try {
      const saved = sessionStorage.getItem(DRAFT_KEY);
      if (saved) {
        const kept = JSON.parse(saved);
        draft = { ...EMPTY, ...kept.draft };
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStep(kept.step ?? 0);
        // Still on the first question: nothing worth announcing.
        setRestored(kept.step > 0);
      }
    } catch {}
    const kind = params.get("kind");
    if (kind && reportKinds.some((k) => k.kind === kind) && !draft.kind)
      draft = { ...draft, kind };
    setD(draft);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (filed) return;
    try {
      // Files cannot be stored; the names would promise attachments that
      // are gone, so a restored draft asks for them again.
      sessionStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ step, draft: { ...d, evidence: [] } }),
      );
    } catch {}
  }, [d, step, filed]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => {
    setD((prev) => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const kind = reportKinds.find((k) => k.kind === d.kind);
  const signedIn = loaded && session?.role === "citizen";
  const grade = gradeReport(d.kind, d.when, d.injuries);

  function check(s: number): Errors {
    const e: Errors = {};
    if (s === 0 && !d.danger)
      e.danger = t("Tell us whether anyone is in danger.");
    if (s === 1) {
      if (!d.kind) e.kind = t("Choose what happened.");
      if (!d.when) e.when = t("Tell us when it happened.");
      if (d.when === "before" && !d.occurred)
        e.occurred = t("Enter the date it happened.");
      if (d.occurred && new Date(d.occurred).getTime() > Date.now())
        e.occurred = t("That date is in the future.");
    }
    if (s === 2) {
      if (!d.state) e.state = t("Choose the state it happened in.");
      if (!d.lga) e.lga = t("Choose the Local Government Area.");
      if (d.address.trim().length < 3)
        e.address = t(
          "Give a street, landmark or village so officers can find it.",
        );
    }
    if (s === 3) {
      if (d.summary.trim().length < 20)
        e.summary = t("Tell us a little more: at least a sentence or two.");
      if (!d.injuries) e.injuries = t("Tell us whether anyone is hurt.");
    }
    if (s === 4 && !signedIn) {
      if (!d.identity) e.identity = t("Choose how you want to report.");
      if (d.identity === "named") {
        if (d.name.trim().length < 2) e.name = t("Enter your name.");
        if (!PHONE.test(cleanPhone(d.phone)))
          e.phone = t("Enter a Nigerian mobile number, like 0803 123 4567.");
      }
    }
    if (s === 4 && signedIn && d.phone && !PHONE.test(cleanPhone(d.phone)))
      e.phone = t("Enter a Nigerian mobile number, like 0803 123 4567.");
    if (s === 5 && !d.declared)
      e.declared = t("Confirm the report is true to send it.");
    return e;
  }

  function next() {
    const e = check(step);
    setErrors(e);
    if (Object.keys(e).length) return focusFirstError();
    if (step < STEPS.length - 1) return setStep(step + 1);
    submit();
  }

  function submit() {
    // A bot filled the trap: show the receipt screen's absence, send nothing.
    if (trap) return;
    const anonymous = !signedIn && d.identity === "anonymous";
    const created = fileReport({
      kind: d.kind,
      priority: grade,
      where: jurisdiction(d.state, d.lga, d.address.trim(), d.geo),
      summary:
        d.summary.trim() +
        (d.suspects.trim()
          ? `\n\n${t("Suspects or vehicles:")} ${d.suspects.trim()}`
          : ""),
      occurred:
        d.when === "now"
          ? undefined
          : d.occurred
            ? new Date(d.occurred).toISOString()
            : undefined,
      reporter: anonymous
        ? null
        : {
            name: signedIn ? session!.name : d.name.trim(),
            phone: cleanPhone(d.phone || (signedIn ? session!.phone : "")),
            safeToCall: d.safeToCall,
          },
      injuries: d.injuries,
      media: d.evidence,
      // The language the report was made in, so the right officer calls back.
      lang: LANG_LABEL[lang],
      onBehalf:
        d.behalf === "someone"
          ? d.behalfName.trim() || "Someone else"
          : d.behalf === "organisation"
            ? d.behalfName.trim() || "An organisation"
            : undefined,
    });
    try {
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {}
    setFiled(created);
    window.scrollTo({ top: 0 });
  }

  function startOver() {
    try {
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {}
    setD(EMPTY);
    setStep(0);
    setErrors({});
    setRestored(false);
  }

  if (filed) return <Filed incident={filed} signedIn={signedIn} />;

  const back = step > 0 ? () => setStep(step - 1) : undefined;

  return (
    <div className="grid items-start gap-x-10 gap-y-6 lg:grid-cols-[17rem_minmax(0,1fr)] xl:gap-x-16">
      {/* The rail pins only where a laptop has the height for all of it. */}
      <aside className="space-y-5 lg:top-32 lg:[@media(min-height:46rem)]:sticky">
        <StepList steps={STEPS} current={step} onPick={setStep} />
        <Honeypot value={trap} onChange={setTrap} />
      </aside>

      <div className="min-w-0 max-w-[52rem] space-y-4">
        {restored && step > 0 ? (
          <p className="npf-small flex flex-wrap items-center gap-x-3 gap-y-1 rounded-card bg-npf-mist px-4 py-3 text-npf-ink ring-1 ring-npf-line/60 ring-inset">
            <ClockIcon
              aria-hidden
              className="size-4.5 shrink-0 text-npf-blue"
            />
            {t("We kept the report you started.")}
            <button
              type="button"
              onClick={startOver}
              className="ms-auto inline-flex min-h-10 items-center font-medium text-npf-blue underline underline-offset-4"
            >
              {t("Start again")}
            </button>
          </p>
        ) : null}

        {step === 0 ? (
          <StepPanel
            step={step}
            title={t("Is anyone in danger right now?")}
            intro={t(
              "If someone is hurt, a crime is still going on, or you are not safe, call first. A form is not the fastest way to reach officers.",
            )}
            onNext={next}
            nextLabel={
              d.danger === "yes"
                ? t("I am safe, continue the report")
                : undefined
            }
          >
            <fieldset>
              <legend className="sr-only">
                {t("Is anyone in danger right now?")}
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <ChoiceCard
                  name={`${id}-danger`}
                  value="yes"
                  tone="alert"
                  Icon={AlertIcon}
                  checked={d.danger === "yes"}
                  onChange={() => set("danger", "yes")}
                  title={t("Yes, someone is in danger")}
                  hint={t(
                    "Someone is hurt, threatened, or it is happening now",
                  )}
                />
                <ChoiceCard
                  name={`${id}-danger`}
                  value="no"
                  Icon={ShieldIcon}
                  checked={d.danger === "no"}
                  onChange={() => set("danger", "no")}
                  title={t("No, everyone is safe")}
                  hint={t("I want to report something that has happened")}
                />
              </div>
              {errors.danger ? <ErrorLine text={errors.danger} /> : null}
            </fieldset>
            {d.danger === "yes" ? <CallNow /> : null}
          </StepPanel>
        ) : null}

        {step === 1 ? (
          <StepPanel
            step={step}
            title={t("What happened?")}
            intro={t("Pick the closest one. An officer can change it later.")}
            onBack={back}
            onNext={next}
          >
            <fieldset>
              {/* The step's own heading asks the question; the groups answer it. */}
              <legend className="sr-only">{t("Type of crime")}</legend>
              <div className="space-y-7">
                {KIND_GROUPS.map((g, gi) => (
                  <div
                    key={g.label}
                    role="group"
                    aria-labelledby={`${id}-group-${gi}`}
                  >
                    <h3
                      id={`${id}-group-${gi}`}
                      className="mb-3 flex items-center gap-2.5 text-sm font-semibold text-npf-ink"
                    >
                      <span
                        aria-hidden
                        className="grid size-7 place-items-center rounded-md bg-npf-cloud text-npf-blue-ink"
                      >
                        <g.Icon className="size-4" />
                      </span>
                      {t(g.label)}
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {g.kinds.map((k) => (
                        <ChoiceCard
                          key={k.kind}
                          name={`${id}-kind`}
                          value={k.kind}
                          checked={d.kind === k.kind}
                          onChange={(v) => set("kind", v)}
                          title={t(k.kind)}
                          hint={t(k.hint)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {errors.kind ? <ErrorLine text={errors.kind} /> : null}
            </fieldset>

            {kind?.advice ? (
              <p
                key={kind.kind}
                className="npf-enter npf-small flex gap-3 rounded-card bg-npf-gold-wash p-4 text-npf-ink"
              >
                <AlertIcon
                  aria-hidden
                  className="mt-0.5 size-4.5 shrink-0 text-npf-warn"
                />
                {t(kind.advice)}
              </p>
            ) : null}

            <Chips
              legend={t("When did it happen?")}
              name={`${id}-when`}
              value={d.when}
              onChange={(v) => set("when", v)}
              options={reportWhen.map((w) => ({
                value: w.value,
                label: t(w.label),
              }))}
              error={errors.when}
            />
            {d.when === "now" ? <CallNow compact /> : null}
            {d.when === "today" || d.when === "before" ? (
              <div key={d.when} className="npf-enter">
                <TextField
                  id={`${id}-occurred`}
                  type={d.when === "today" ? "time" : "datetime-local"}
                  label={
                    d.when === "today"
                      ? t("About what time?")
                      : t("Date and time")
                  }
                  optional={d.when === "today"}
                  value={
                    d.when === "today"
                      ? d.occurred.slice(11, 16)
                      : d.occurred.slice(0, 16)
                  }
                  onChange={(v) =>
                    set(
                      "occurred",
                      d.when === "today"
                        ? v
                          ? `${new Date().toISOString().slice(0, 10)}T${v}`
                          : ""
                        : v,
                    )
                  }
                  max={new Date().toISOString().slice(0, 16)}
                  error={errors.occurred}
                  hint={t("Your best guess is fine.")}
                />
              </div>
            ) : null}
          </StepPanel>
        ) : null}

        {step === 2 ? (
          <StepPanel
            step={step}
            title={t("Where did it happen?")}
            intro={t(
              "This decides which State Command and which division get your report. Choose where it happened, not where you live.",
            )}
            onBack={back}
            onNext={next}
          >
            <WherePicker
              pin
              value={{
                state: d.state,
                lga: d.lga,
                address: d.address,
                geo: d.geo,
              }}
              onChange={(w) => {
                setD((prev) => ({ ...prev, ...w }));
                setErrors((e) => ({
                  ...e,
                  state: undefined,
                  lga: undefined,
                  address: undefined,
                }));
              }}
              errors={errors as WhereErrors}
              stateLabel={t("State it happened in")}
            />
            <RouteCard where={jurisdiction(d.state, d.lga, undefined, d.geo)} />
          </StepPanel>
        ) : null}

        {step === 3 ? (
          <StepPanel
            step={step}
            title={t("Tell us what happened")}
            intro={t(
              "In your own words: what you saw, what was taken or damaged, and anything said.",
            )}
            onBack={back}
            onNext={next}
          >
            <TextField
              id={`${id}-summary`}
              multiline
              label={t("What happened")}
              value={d.summary}
              onChange={(v) => set("summary", v)}
              maxLength={4000}
              error={errors.summary}
              hint={t("{n} of 4,000 characters", { n: d.summary.length })}
            />
            <Chips
              legend={t("Is anyone hurt?")}
              name={`${id}-hurt`}
              value={d.injuries}
              onChange={(v) => set("injuries", v)}
              options={reportInjuries.map((v) => ({ value: v, label: t(v) }))}
              error={errors.injuries}
            />
            <TextField
              id={`${id}-suspects`}
              multiline
              optional
              label={t("Suspects or vehicles")}
              value={d.suspects}
              onChange={(v) => set("suspects", v)}
              maxLength={2000}
              hint={t(
                "What they looked like, what they wore, names if known, plate numbers, which way they went.",
              )}
            />
            <MediaPicker
              id={`${id}-evidence`}
              optional
              label={t("Photos, video or documents")}
              media={d.evidence}
              onChange={(m) => set("evidence", m)}
              by="Reporter"
            />
          </StepPanel>
        ) : null}

        {step === 4 ? (
          <StepPanel
            step={step}
            title={t("About you")}
            intro={
              signedIn
                ? t(
                    "We will use your account details. Check the number we should call.",
                  )
                : t(
                    "Officers may need to ask you something. You can also report without giving your name.",
                  )
            }
            onBack={back}
            onNext={next}
          >
            <Chips
              legend={t("Who are you reporting for?")}
              name={`${id}-behalf`}
              value={d.behalf}
              onChange={(v) => set("behalf", v as Draft["behalf"])}
              options={[
                { value: "myself", label: t("Myself") },
                { value: "someone", label: t("Someone else") },
                {
                  value: "organisation",
                  label: t("A business or organisation"),
                },
              ]}
            />
            {d.behalf === "someone" || d.behalf === "organisation" ? (
              <div className="npf-enter">
                <TextField
                  id={`${id}-behalf-name`}
                  optional
                  label={
                    d.behalf === "someone"
                      ? t("Their name and how you know them")
                      : t("Name of the business or organisation")
                  }
                  value={d.behalfName}
                  onChange={(v) => set("behalfName", v)}
                  maxLength={200}
                  hint={
                    d.behalf === "someone"
                      ? t("For example: my son, Tunde, aged 12.")
                      : undefined
                  }
                />
              </div>
            ) : null}
            {signedIn ? (
              <>
                <dl className="npf-small grid gap-x-6 gap-y-2 rounded-card bg-npf-paper p-4 sm:grid-cols-[10rem_minmax(0,1fr)]">
                  <dt className="text-npf-steel">{t("Name")}</dt>
                  <dd className="text-npf-ink">{session!.name}</dd>
                  <dt className="text-npf-steel">{t("NIN")}</dt>
                  <dd className="text-npf-ink tabular-nums">
                    {session!.nin.replace(/\d(?=\d{4})/g, "•")}
                  </dd>
                </dl>
                <TextField
                  id={`${id}-phone`}
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  label={t("Phone number to call you on")}
                  value={d.phone || session!.phone}
                  onChange={(v) => set("phone", v)}
                  error={errors.phone}
                />
                <SafeToCall d={d} set={set} />
              </>
            ) : (
              <>
                <fieldset>
                  <legend className="sr-only">
                    {t("How do you want to report?")}
                  </legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <ChoiceCard
                      name={`${id}-identity`}
                      value="named"
                      Icon={PhoneIcon}
                      checked={d.identity === "named"}
                      onChange={() => set("identity", "named")}
                      title={t("Give my name and number")}
                      hint={t(
                        "Officers can call you back and keep you updated",
                      )}
                    />
                    <ChoiceCard
                      name={`${id}-identity`}
                      value="anonymous"
                      Icon={ShieldIcon}
                      checked={d.identity === "anonymous"}
                      onChange={() => set("identity", "anonymous")}
                      title={t("Report anonymously")}
                      hint={t(
                        "Nobody can contact you, so add all the detail you can",
                      )}
                    />
                  </div>
                  {errors.identity ? (
                    <ErrorLine text={errors.identity} />
                  ) : null}
                </fieldset>
                {d.identity === "named" ? (
                  <div className="npf-enter grid gap-5 md:grid-cols-2">
                    <TextField
                      id={`${id}-name`}
                      autoComplete="name"
                      label={t("Your name")}
                      value={d.name}
                      onChange={(v) => set("name", v)}
                      error={errors.name}
                    />
                    <TextField
                      id={`${id}-phone`}
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      label={t("Mobile number")}
                      value={d.phone}
                      onChange={(v) => set("phone", v)}
                      error={errors.phone}
                    />
                    <div className="md:col-span-2">
                      <SafeToCall d={d} set={set} />
                    </div>
                  </div>
                ) : null}
                {d.identity === "anonymous" ? (
                  <p className="npf-enter npf-small rounded-card bg-npf-paper p-4 text-npf-body">
                    {t(
                      "Keep the reference number you get at the end. It is the only way to follow an anonymous report.",
                    )}
                  </p>
                ) : null}
                <p className="npf-small text-npf-body">
                  {t("Have an account?")}{" "}
                  <Link
                    href={`/app/signin?next=${encodeURIComponent("/app/report")}`}
                    className="font-medium text-npf-blue underline underline-offset-4"
                  >
                    {t("Sign in")}
                  </Link>{" "}
                  {t("to follow this report from your account.")}
                </p>
              </>
            )}
          </StepPanel>
        ) : null}

        {step === 5 ? (
          <StepPanel
            step={step}
            title={t("Check and send")}
            intro={t(
              "Read it through once. You can change anything before you send it.",
            )}
            onBack={back}
            onNext={next}
            nextLabel={t("Send report")}
          >
            <Review
              onEdit={setStep}
              sections={[
                {
                  title: t("What happened"),
                  step: 1,
                  rows: [
                    [t("Type of crime"), t(d.kind)],
                    [
                      t("When"),
                      d.when === "now"
                        ? t("It is happening now")
                        : d.occurred
                          ? format.dateTime(new Date(d.occurred).toISOString())
                          : t(
                              reportWhen.find((w) => w.value === d.when)
                                ?.label ?? "",
                            ),
                    ],
                  ],
                },
                {
                  title: t("Where"),
                  step: 2,
                  rows: [
                    [
                      t("Place"),
                      `${d.address}\n${d.lga}, ${stateNamed(d.state)?.name === "FCT" ? t("Federal Capital Territory") : d.state}`,
                    ],
                    [
                      t("Goes to"),
                      `${commandLabel(t, d.state)}\n${divisionLabel(t, d.lga)}`,
                    ],
                  ],
                },
                {
                  title: t("Details"),
                  step: 3,
                  rows: [
                    [t("What happened"), d.summary],
                    [t("Is anyone hurt?"), t(d.injuries)],
                    [t("Suspects or vehicles"), d.suspects],
                    [t("Attached"), d.evidence.map((m) => m.name).join("\n")],
                  ],
                },
                {
                  title: t("About you"),
                  step: 4,
                  rows: signedIn
                    ? [
                        [t("Name"), session!.name],
                        [t("Phone"), d.phone || session!.phone],
                      ]
                    : d.identity === "anonymous"
                      ? [[t("Name"), t("Anonymous")]]
                      : [
                          [t("Name"), d.name],
                          [t("Phone"), d.phone],
                        ],
                },
              ]}
            />
            <Declare
              checked={d.declared}
              onChange={(v) => set("declared", v)}
              error={errors.declared}
            >
              {t(
                "What I have written is true to the best of my knowledge. I understand that knowingly making a false report to the police is an offence.",
              )}
            </Declare>
          </StepPanel>
        ) : null}

        <FreePromise />
      </div>
    </div>
  );
}

/**
 * The one promise every reporter should hear, under the form it covers:
 * reporting costs nothing. 112 has the header and the red card already.
 */
function FreePromise() {
  const t = useT();
  return (
    <p className="npf-small flex gap-3 px-1 pt-2 text-npf-body">
      <ShieldIcon aria-hidden className="mt-0.5 size-4.5 shrink-0 text-npf-blue" />
      <span>
        {t(
          "Reporting is free. No officer may ask you for money to take a report, to investigate it, or for bail.",
        )}
      </span>
    </p>
  );
}

function SafeToCall({
  d,
  set,
}: {
  d: Draft;
  set: <K extends keyof Draft>(k: K, v: Draft[K]) => void;
}) {
  const t = useT();
  return (
    <Declare checked={d.safeToCall} onChange={(v) => set("safeToCall", v)}>
      {t(
        "It is safe to call me on this number. Untick this if someone who should not know about the report might answer.",
      )}
    </Declare>
  );
}

function ErrorLine({ text }: { text: string }) {
  return (
    <p className="npf-small mt-3 flex items-start gap-1.5 text-npf-error">
      <AlertIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
      {text}
    </p>
  );
}

/** 112, as the thing to do instead of the form. */
function CallNow({ compact = false }: { compact?: boolean }) {
  const t = useT();
  return (
    <div
      className={`npf-enter rounded-card ${compact ? "bg-npf-error-wash p-4" : "bg-npf-alert p-5 text-white md:p-6"}`}
    >
      <p
        className={
          compact
            ? "npf-small font-medium text-npf-alert-deep"
            : "npf-h4 text-white"
        }
      >
        {compact
          ? t("In an emergency, call 112.")
          : t("Call 112 now. It is free from any phone.")}
      </p>
      {compact ? null : (
        <p className="npf-small mt-1.5 text-white/85">
          {t("Come back to this report once you are safe.")}
        </p>
      )}
      <a
        href="tel:112"
        className={`npf-btn mt-3 ${compact ? "npf-btn-alert npf-btn-sm" : "bg-white text-npf-alert-deep hover:bg-npf-error-wash"}`}
      >
        <PhoneCallIcon aria-hidden className="size-4.5" />
        {t("Call 112")}
      </a>
    </div>
  );
}

/** The receipt: the reference, who has it, and what happens next. */
function Filed({
  incident,
  signedIn,
}: {
  incident: Incident;
  signedIn: boolean;
}) {
  const t = useT();
  const steps = [
    t("The {command} control room reads your report and grades it.", {
      command: commandLabel(t, incident.where.state),
    }),
    t("It is passed to the {division} to act on.", {
      division: divisionLabel(t, incident.where.lga, incident.where.division),
    }),
    incident.reporter
      ? t(
          "An officer contacts you if they need more, and you can follow every step.",
        )
      : t("Follow it with your reference number. Nobody will contact you."),
  ];
  return (
    <div className="mx-auto max-w-180 space-y-6">
      <div className="animate-[npf-page-in_var(--dur-reveal)_var(--ease-out)] overflow-hidden rounded-card bg-white px-6 pt-9 pb-8 text-center shadow-card ring-1 ring-npf-hairline ring-inset md:px-10 md:pt-11">
        <span className="npf-ops-draw mx-auto grid size-14 place-items-center rounded-full bg-npf-ok-soft text-npf-ok">
          <CheckIcon aria-hidden className="size-7" />
        </span>
        <h2
          className="npf-h3 mt-5 text-npf-blue-deep outline-none"
          tabIndex={-1}
        >
          {t("Report received")}
        </h2>
        <p className="npf-body mt-2 text-npf-body">
          {t("Your reference number")}
        </p>
        <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-chip border border-dashed border-npf-line bg-npf-cloud py-2 ps-5 pe-2 print:pe-5">
          <p className="font-secondary text-3xl font-bold tracking-tight text-npf-ink tabular-nums select-all md:text-4xl">
            {incident.id}
          </p>
          <CopyRef value={incident.id} />
        </div>
        <p className="npf-small mx-auto mt-4 max-w-[46ch] text-npf-body">
          {t(
            "Write it down or take a screenshot. Quote it whenever you contact the police about this.",
          )}
        </p>
        {/* Who has it, as the last line of the receipt rather than a card of its own. */}
        <RouteCard
          filed
          where={incident.where}
          className="-mx-6 mt-8 -mb-8 rounded-none! border-t border-npf-hairline bg-npf-paper! px-6! py-5! text-start md:-mx-10 md:px-10!"
        />
      </div>

      <section
        aria-labelledby="report-next"
        className="rounded-card bg-white p-5 ring-1 ring-npf-hairline ring-inset md:p-7"
      >
        <h2 id="report-next" className="npf-h4 text-npf-blue-deep">
          {t("What happens next")}
        </h2>
        <ol className="mt-5">
          {[t("Report received"), ...steps].map((s, i, all) => (
            <li
              key={i}
              style={{ animationDelay: `${120 + i * 60}ms` }}
              className="npf-enter relative flex gap-4 pb-6 [animation-fill-mode:backwards] last:pb-0"
            >
              {/* The thread down to the next stage: green where it is done. */}
              {i < all.length - 1 ? (
                <span
                  aria-hidden
                  className={`absolute start-[15px] top-9 bottom-1 w-0.5 rounded-full ${
                    i === 0 ? "bg-npf-ok/45" : "bg-npf-hairline"
                  }`}
                />
              ) : null}
              <span
                className={`relative grid size-8 shrink-0 place-items-center rounded-full text-sm font-semibold tabular-nums ${
                  i === 0
                    ? "bg-npf-ok-soft text-npf-ok"
                    : i === 1
                      ? "bg-npf-blue text-white shadow-[0_0_0_4px_var(--color-npf-chip)]"
                      : "bg-white text-npf-steel ring-1 ring-npf-hairline ring-inset"
                }`}
              >
                {i === 0 ? <CheckIcon aria-hidden className="size-4" /> : i}
              </span>
              <span
                className={`npf-body pt-0.5 ${i === 0 ? "font-medium text-npf-ok" : i === 1 ? "font-medium text-npf-ink" : "text-npf-body"}`}
              >
                {s}
                {i === 0 ? (
                  <span className="sr-only"> {t("(done)")}</span>
                ) : null}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <div className="flex flex-wrap gap-3 max-sm:flex-col print:hidden">
        <Link
          href={
            signedIn ? "/app/portal/requests" : `/app/track?ref=${incident.id}`
          }
          className="npf-btn npf-btn-primary hover:bg-npf-blue-mid"
        >
          {t("Follow this report")}
          <span className="npf-btn-disc">
            <ArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />
          </span>
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="npf-btn npf-btn-secondary"
        >
          {t("Print or save")}
        </button>
      </div>

      <p className="npf-small flex gap-3 text-npf-body">
        <ShieldIcon
          aria-hidden
          className="mt-0.5 size-4.5 shrink-0 text-npf-blue"
        />
        <span>
          {t(
            "Not happy with how your report is handled? The Complaint Response Unit takes calls on {calls} and WhatsApp on {whatsapp}.",
            {
              calls: complaintLines.calls.join(", "),
              whatsapp: complaintLines.whatsapp,
            },
          )}
        </span>
      </p>
    </div>
  );
}

/** One press puts the reference on the clipboard, for a message or a note. */
function CopyRef({ value }: { value: string }) {
  const t = useT();
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const id = setTimeout(() => setDone(false), 2400);
    return () => clearTimeout(id);
  }, [done]);
  return (
    <button
      type="button"
      onClick={() =>
        navigator.clipboard?.writeText(value).then(
          () => setDone(true),
          () => {},
        )
      }
      className="npf-btn npf-btn-ghost npf-btn-sm shrink-0 text-npf-blue print:hidden"
    >
      {done ? (
        <CheckIcon aria-hidden className="size-4 text-npf-ok" />
      ) : (
        <FileIcon aria-hidden className="size-4" />
      )}
      <span aria-live="polite">{done ? t("Copied") : t("Copy")}</span>
    </button>
  );
}
