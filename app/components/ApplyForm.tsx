"use client";

import Link from "../i18n/Link";
import { useRouter } from "../i18n/Link";
import { useEffect, useId, useMemo, useState } from "react";
import type { Service } from "../content-services";
import { openEndedTurnaround } from "../content-report";
import { jurisdiction } from "../geo";
import { useT } from "../i18n/client";
import { submitRequest, useStore, type TrackedRequest } from "./store";
import { ArrowRight, CheckCircle, UserCircle } from "./icons";
import {
  ChoiceCard,
  Declare,
  FilePicker,
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

const STEPS = ["Where", "Your request", "Documents", "Check and send"];

type Errors = Record<string, string | undefined>;

/** "(if applicable)" and "(if available)" mark a document nobody must have. */
const optional = (doc: string) => /\((if|where) [^)]*\)/i.test(doc);

/**
 * What the service asks for, as a list of documents to attach.
 *
 * A service's document groups are either one document each (a group with no
 * items is itself the document) or alternatives by case: "Fraud" needs these
 * four, "Forgery" those three. Alternatives are asked as a choice first.
 */
function documentPlan(service: Service) {
  const cases = service.documents.filter((g) => g.items.length);
  const singles = service.documents.filter((g) => !g.items.length).map((g) => g.label);
  return { cases, singles };
}

/**
 * Applying for a service: which command handles it, what the applicant
 * wants and why, the documents the service lists, and a read-back. It ends
 * on a reference number and the name of the command that has the request.
 */
export default function ApplyForm({ service }: { service: Service }) {
  const t = useT();
  const id = useId();
  const router = useRouter();
  const { session, requests, loaded } = useStore();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [filed, setFiled] = useState<TrackedRequest | null>(null);
  const plan = useMemo(() => documentPlan(service), [service]);

  const [where, setWhere] = useState({ state: "", lga: "", address: "" });
  // The home address on the profile fills the form in, once, when the
  // session arrives; the applicant can still change it for this request.
  const [prefilled, setPrefilled] = useState(false);
  if (loaded && !prefilled) {
    setPrefilled(true);
    if (session?.home && !where.state) setWhere(session.home);
  }
  const [purpose, setPurpose] = useState("");
  const [extra, setExtra] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [docCase, setDocCase] = useState(plan.cases.length === 1 ? plan.cases[0].label : "");
  const [files, setFiles] = useState<Record<string, string[]>>({});
  const [declared, setDeclared] = useState(false);

  useEffect(() => {
    if (loaded && !session)
      router.replace(
        `/app/signin?next=${encodeURIComponent(`/app/services/${service.slug}/apply`)}`,
      );
  }, [loaded, session, router, service.slug]);

  const docs = [
    ...plan.singles,
    ...(plan.cases.find((c) => c.label === docCase)?.items ?? []),
  ];

  if (!loaded || !session)
    return <div aria-hidden className="h-96 animate-pulse rounded-card bg-npf-cloud" />;

  if (session.role !== "citizen")
    return (
      <p className="npf-body rounded-card bg-npf-paper p-6 text-npf-body">
        {t("Applications are made from a public account. Officers decide them on the console.")}
      </p>
    );

  const existing = requests.find(
    (r) =>
      r.slug === service.slug &&
      r.status !== "Completed" &&
      r.status !== "Rejected" &&
      r.id !== filed?.id,
  );
  if (existing && !filed)
    return (
      <div className="mx-auto max-w-180 rounded-card bg-npf-mist p-6 text-center md:p-10">
        <p className="npf-h4 text-npf-blue-deep">
          {t("You already have this request open")}
        </p>
        <p className="npf-body mt-2 text-npf-body">
          {t("Reference {ref}, status: {status}.", {
            ref: existing.id,
            status: t(existing.status).toLowerCase(),
          })}
        </p>
        <Link
          href="/app/portal/requests"
          className="npf-btn npf-btn-primary mt-6 hover:bg-npf-blue-mid"
        >
          {t("Track request")}
          <span className="npf-btn-disc">
            <ArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />
          </span>
        </Link>
      </div>
    );

  if (filed) return <Filed request={filed} service={service} />;

  const contactPhone = phone || session.phone;
  const contactEmail = email || session.email;

  function check(s: number): Errors {
    const e: Errors = {};
    if (s === 0) {
      if (!where.state) e.state = t("Choose the state.");
      if (!where.lga) e.lga = t("Choose the Local Government Area.");
      if (where.address.trim().length < 5) e.address = t("Enter your address.");
    }
    if (s === 1) {
      if (purpose.trim().length < 10)
        e.purpose = t("Say what you need this for, in a sentence.");
      if (!PHONE.test(cleanPhone(contactPhone)))
        e.phone = t("Enter a Nigerian mobile number, like 0803 123 4567.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail))
        e.email = t("Enter an email address, like name@example.com.");
    }
    if (s === 2) {
      if (plan.cases.length > 1 && !docCase) e.docCase = t("Choose which applies to you.");
      for (const d of docs)
        if (!optional(d) && !files[d]?.length) e[`doc:${d}`] = t("Attach this document.");
    }
    if (s === 3 && !declared) e.declared = t("Confirm the declaration to send it.");
    return e;
  }

  function next() {
    const e = check(step);
    setErrors(e);
    if (Object.values(e).some(Boolean)) return focusFirstError();
    if (step < STEPS.length - 1) return setStep(step + 1);
    const created = submitRequest({
      slug: service.slug,
      service: service.name,
      fee: service.feeSummary,
      where: jurisdiction(where.state, where.lga, where.address.trim()),
      answers: [
        { label: "Purpose", value: purpose.trim() },
        ...(extra.trim() ? [{ label: "Anything else", value: extra.trim() }] : []),
        { label: "Phone", value: cleanPhone(contactPhone) },
        { label: "Email", value: contactEmail },
      ],
      documents: docs.flatMap((d) => (files[d] ?? []).map((file) => ({ label: d, file }))),
    });
    setFiled(created);
    window.scrollTo({ top: 0 });
  }

  const back = step > 0 ? () => setStep(step - 1) : undefined;

  return (
    <div className="grid items-start gap-x-12 gap-y-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-32">
        <StepList steps={STEPS} current={step} onPick={setStep} />
      </aside>

      <div className="min-w-0 max-w-200">
        {step === 0 ? (
          <StepPanel
            step={step}
            title={t("Which command handles your request?")}
            intro={t(
              "Choose the state and area you live in. Your request goes to that State Command, and any visit you need to make is to the division that covers your area.",
            )}
            onNext={next}
          >
            <WherePicker
              value={where}
              onChange={(w) => {
                setWhere(w);
                setErrors({});
              }}
              errors={errors as WhereErrors}
              stateLabel={t("State you live in")}
              addressLabel={t("Your address")}
              addressHint={t("House number, street and town.")}
            />
            <RouteCard where={where} />
          </StepPanel>
        ) : null}

        {step === 1 ? (
          <StepPanel
            step={step}
            title={t("Your request")}
            onBack={back}
            onNext={next}
          >
            <div className="flex items-center gap-3 rounded-card bg-npf-paper p-4">
              <UserCircle aria-hidden className="size-6 shrink-0 text-npf-blue" />
              <p className="npf-small text-npf-ink">
                {t("Applying as {name}", { name: session.name })}
              </p>
            </div>
            <TextField
              id={`${id}-purpose`}
              multiline
              label={t("What do you need it for?")}
              value={purpose}
              onChange={(v) => {
                setPurpose(v);
                setErrors((e) => ({ ...e, purpose: undefined }));
              }}
              maxLength={1500}
              error={errors.purpose}
              hint={t("For example: a visa application, a new job, or a lost document.")}
            />
            <TextField
              id={`${id}-extra`}
              multiline
              optional
              label={t("Anything else we should know")}
              value={extra}
              onChange={setExtra}
              maxLength={1500}
            />
            <div className="grid gap-5 md:grid-cols-2">
              <TextField
                id={`${id}-phone`}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                label={t("Phone")}
                value={contactPhone}
                onChange={setPhone}
                error={errors.phone}
              />
              <TextField
                id={`${id}-email`}
                type="email"
                autoComplete="email"
                label={t("Email")}
                value={contactEmail}
                onChange={setEmail}
                error={errors.email}
                hint={t("Where the decision and any certificate are sent.")}
              />
            </div>
          </StepPanel>
        ) : null}

        {step === 2 ? (
          <StepPanel
            step={step}
            title={t("Documents")}
            intro={
              docs.length || plan.cases.length
                ? t("Clear photos or scans are fine. Officers may ask to see the originals.")
                : t("This service needs no documents. Continue to check and send.")
            }
            onBack={back}
            onNext={next}
          >
            {plan.cases.length > 1 ? (
              <fieldset>
                <legend className="npf-field-label">{t("Which applies to you?")}</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {plan.cases.map((c) => (
                    <ChoiceCard
                      key={c.label}
                      name={`${id}-case`}
                      value={c.label}
                      checked={docCase === c.label}
                      onChange={(v) => {
                        setDocCase(v);
                        setErrors({});
                      }}
                      title={t(c.label)}
                      hint={t("{n} documents", { n: c.items.length })}
                    />
                  ))}
                </div>
                {errors.docCase ? (
                  <p className="npf-small mt-3 text-npf-error">{errors.docCase}</p>
                ) : null}
              </fieldset>
            ) : plan.cases.length === 1 ? (
              <p className="npf-small text-npf-body">
                {t("Needed when applying: {case}", { case: t(plan.cases[0].label).toLowerCase() })}
              </p>
            ) : null}
            <div className="space-y-6">
              {docs.map((d, i) => (
                <FilePicker
                  key={d}
                  id={`${id}-doc-${i}`}
                  label={t(d)}
                  optional={optional(d)}
                  max={3}
                  maxMb={10}
                  accept="image/*,application/pdf"
                  hint={t("Up to 3 files, 10 MB each. Photo or PDF.")}
                  files={files[d] ?? []}
                  onChange={(f) => {
                    setFiles((prev) => ({ ...prev, [d]: f }));
                    setErrors((e) => ({ ...e, [`doc:${d}`]: undefined }));
                  }}
                  error={errors[`doc:${d}`]}
                />
              ))}
            </div>
          </StepPanel>
        ) : null}

        {step === 3 ? (
          <StepPanel
            step={step}
            title={t("Check and send")}
            onBack={back}
            onNext={next}
            nextLabel={t("Send application")}
          >
            <Review
              onEdit={setStep}
              sections={[
                {
                  title: t("Where"),
                  step: 0,
                  rows: [
                    [t("Address"), `${where.address}\n${where.lga}, ${where.state}`],
                    [
                      t("Goes to"),
                      `${commandLabel(t, where.state)}\n${divisionLabel(t, where.lga)}`,
                    ],
                  ],
                },
                {
                  title: t("Your request"),
                  step: 1,
                  rows: [
                    [t("What do you need it for?"), purpose],
                    [t("Anything else we should know"), extra],
                    [t("Phone"), contactPhone],
                    [t("Email"), contactEmail],
                  ],
                },
                {
                  title: t("Documents"),
                  step: 2,
                  rows: docs.length
                    ? docs.map((d) => [t(d), (files[d] ?? []).join("\n")] as [string, string])
                    : [[t("Documents"), t("None needed")]],
                },
              ]}
            />
            <p className="npf-small rounded-card bg-npf-mist p-4 text-npf-ink">
              {service.feeSummary === "Free of Charge"
                ? t("This service is free.")
                : t(
                    "Fee: {fee}. You pay once the command has accepted the application; you will get a payment notice in your account.",
                    { fee: t(service.feeSummary) },
                  )}
            </p>
            <Declare checked={declared} onChange={setDeclared} error={errors.declared}>
              {t(
                "The information and documents I have given are true and my own. I understand that false statements or forged documents are an offence and will end the application.",
              )}
            </Declare>
          </StepPanel>
        ) : null}
      </div>
    </div>
  );
}

function Filed({ request, service }: { request: TrackedRequest; service: Service }) {
  const t = useT();
  return (
    <div className="mx-auto max-w-180 space-y-6">
      <div className="rounded-card bg-npf-mist p-6 text-center md:p-10">
        <CheckCircle aria-hidden className="mx-auto size-12 text-npf-blue" />
        <h2 className="npf-h3 mt-4 text-npf-blue-deep">{t("Application sent")}</h2>
        <p className="npf-body mt-2 text-npf-body">{t("Your reference number")}</p>
        <p className="mt-1 font-secondary text-3xl font-bold tracking-tight text-npf-ink tabular-nums select-all">
          {request.id}
        </p>
        <p className="npf-small mt-2 text-npf-body">
          {openEndedTurnaround.has(service.turnaround) ||
          service.turnaround === "Instant"
            ? t("We will tell you in your account and by email at each step.")
            : t(
                "{service} usually takes {turnaround}. We will tell you in your account and by email at each step.",
                {
                  service: t(service.name),
                  turnaround: t(service.turnaround).toLowerCase(),
                },
              )}
        </p>
      </div>
      {request.where ? <RouteCard filed where={request.where} /> : null}
      <Link href="/app/portal/requests" className="npf-btn npf-btn-primary hover:bg-npf-blue-mid">
        {t("Track it")}
        <span className="npf-btn-disc">
          <ArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />
        </span>
      </Link>
    </div>
  );
}
