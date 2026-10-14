"use client";

import { useId, useState } from "react";
import { STATES, divisionNamed, nearestState, stateNamed, type Jurisdiction } from "../geo";
import { useT } from "../i18n/client";
import type { T } from "../i18n/translate";
import { AlertIcon, ArrowDown, PinIcon, ShieldIcon } from "./icons";

/** "Lagos State Command" / "FCT Command", in the reader's language. */
export const commandLabel = (t: T, state: string) =>
  state === "FCT" ? t("FCT Command") : t("{state} State Command", { state });

/**
 * "Ikeja Division", in the reader's language; or the division's own name
 * ("Wuse II Division") when the record carries one the Force gave it.
 */
export const divisionLabel = (t: T, lga: string, division?: string) =>
  division && division !== `${lga} Division` ? division : t("{lga} Division", { lga });

/**
 * Fills a routing line ("Sent to {command}, {division}.") from the state and
 * LGA it was stored with, so it reads in the language of whoever opens it.
 */
export function routeLabels(t: T, vars?: Record<string, string>) {
  if (!vars?.state) return vars;
  return {
    ...vars,
    command: commandLabel(t, vars.state),
    division: divisionLabel(t, vars.lga ?? "", vars.division),
  };
}

/** A log or timeline line, with routing values and plain values filled in. */
export function line(
  t: T,
  text: string,
  vars?: Record<string, string>,
  where?: Pick<Jurisdiction, "state" | "lga">,
) {
  const filled = vars?.state
    ? routeLabels(t, vars)
    : where && text.includes("{command}")
      ? routeLabels(t, { state: where.state, lga: where.lga })
      : vars &&
        Object.fromEntries(Object.entries(vars).map(([k, v]) => [k, t(v)]));
  return t(text, filled);
}

export type WhereValue = {
  state: string;
  lga: string;
  address: string;
  /** The device's position, kept only where the form asks for a pin. */
  geo?: { lat: number; lng: number };
};
export type WhereErrors = Partial<Record<keyof WhereValue, string>>;

/** A native select drawn as a field, with the icon set's own arrow. */
export function SelectField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  disabled,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="npf-field-label">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className="npf-field cursor-pointer appearance-none pe-11 disabled:cursor-not-allowed"
        >
          {children}
        </select>
        <ArrowDown
          aria-hidden
          className="pointer-events-none absolute end-4 top-[calc(50%-0.5rem)] size-4 text-npf-blue"
        />
      </div>
      <FieldNote id={id} error={error} hint={hint} />
    </div>
  );
}

/** The error under a field, or the hint when there is no error. */
export function FieldNote({
  id,
  error,
  hint,
}: {
  id: string;
  error?: string;
  hint?: string;
}) {
  const t = useT();
  if (error)
    return (
      <p
        id={`${id}-error`}
        className="npf-small mt-2 flex items-start gap-1.5 text-npf-error"
      >
        <AlertIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
        {t(error)}
      </p>
    );
  if (hint)
    return (
      <p id={`${id}-hint`} className="npf-hint">
        {hint}
      </p>
    );
  return null;
}

/**
 * State, then Local Government Area, then the street: the three answers that
 * decide which command and which division a report or an application goes to.
 *
 * "Use my location" only suggests the state: the browser gives a point, and
 * the closest command headquarters to a point near a state line can be across
 * it. The person confirms by seeing the state chosen; nothing is sent until
 * they press on.
 */
export function WherePicker({
  value,
  onChange,
  errors = {},
  stateLabel,
  addressLabel,
  addressHint,
  withAddress = true,
  pin = false,
}: {
  value: WhereValue;
  onChange: (next: WhereValue) => void;
  errors?: WhereErrors;
  stateLabel?: string;
  addressLabel?: string;
  addressHint?: string;
  withAddress?: boolean;
  /**
   * Keep the position "Use my location" found, so the report carries the
   * spot itself and not only the state. A residence form leaves it off.
   */
  pin?: boolean;
}) {
  const t = useT();
  const id = useId();
  const [locating, setLocating] = useState<"idle" | "busy" | "failed" | "done">(
    "idle",
  );
  const state = stateNamed(value.state);

  function locate() {
    if (!("geolocation" in navigator)) return setLocating("failed");
    setLocating("busy");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const near = nearestState(pos.coords.latitude, pos.coords.longitude);
        onChange({
          ...value,
          state: near.name,
          lga: near.name === value.state ? value.lga : "",
          ...(pin
            ? {
                geo: {
                  lat: Math.round(pos.coords.latitude * 1e5) / 1e5,
                  lng: Math.round(pos.coords.longitude * 1e5) / 1e5,
                },
              }
            : {}),
        });
        setLocating("done");
      },
      () => setLocating("failed"),
      { timeout: 10_000, maximumAge: 300_000 },
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div>
        <SelectField
          id={`${id}-state`}
          label={stateLabel ?? t("State")}
          value={value.state}
          // A different state means the pin was somewhere else: drop it.
          onChange={(s) => onChange({ ...value, state: s, lga: "", geo: undefined })}
          error={errors.state}
        >
          <option value="">{t("Choose a state")}</option>
          {STATES.map((s) => (
            <option key={s.name} value={s.name}>
              {s.name === "FCT" ? t("Federal Capital Territory") : s.name}
            </option>
          ))}
        </SelectField>
        <button
          type="button"
          onClick={locate}
          disabled={locating === "busy"}
          className="npf-small mt-2.5 inline-flex min-h-10 items-center gap-2 rounded-full font-medium text-npf-blue underline-offset-4 transition-colors hover:text-npf-blue-deep hover:underline disabled:opacity-60"
        >
          <PinIcon aria-hidden className="size-4" />
          {locating === "busy" ? t("Finding you…") : t("Use my location")}
        </button>
        <p aria-live="polite" className="npf-hint mt-0">
          {locating === "done" && pin && value.geo
            ? t("We picked the state nearest to you, and the report will carry your exact spot for the officers. Check the state is right.")
            : locating === "done"
            ? t("We picked the state nearest to you. Check it is right.")
            : locating === "failed"
              ? t("We could not get your location. Choose the state instead.")
              : null}
        </p>
      </div>

      <SelectField
        id={`${id}-lga`}
        label={t("Local Government Area")}
        value={value.lga}
        onChange={(lga) => onChange({ ...value, lga })}
        error={errors.lga}
        disabled={!state}
        hint={state ? undefined : t("Choose the state first.")}
      >
        <option value="">
          {state
            ? t("Choose one of {n} areas", { n: state.lgas.length })
            : t("Choose a state first")}
        </option>
        {state?.lgas.map((lga) => (
          <option key={lga} value={lga}>
            {lga}
          </option>
        ))}
      </SelectField>

      {withAddress ? (
        <div className="md:col-span-2">
          <label htmlFor={`${id}-address`} className="npf-field-label">
            {addressLabel ?? t("Street, landmark or village")}
          </label>
          <input
            id={`${id}-address`}
            value={value.address}
            onChange={(e) => onChange({ ...value, address: e.target.value })}
            autoComplete="street-address"
            aria-invalid={errors.address ? true : undefined}
            aria-describedby={`${id}-address-${errors.address ? "error" : "hint"}`}
            className="npf-field"
          />
          <FieldNote
            id={`${id}-address`}
            error={errors.address}
            hint={
              addressHint ??
              t(
                "What an officer would need to find the place: a street and number, or the nearest landmark.",
              )
            }
          />
        </div>
      ) : null}
    </div>
  );
}

/**
 * Where it goes, said before it is sent: the command and the division, as
 * a small route. The person can see that a Kano report is going to Kano.
 */
export function RouteCard({
  where,
  className = "",
  filed = false,
}: {
  where: Pick<Jurisdiction, "state" | "lga"> & { division?: string };
  className?: string;
  /** Already sent: "Handled by", not "This goes to". */
  filed?: boolean;
}) {
  const t = useT();
  if (!where.state) return null;
  return (
    <div
      className={`flex items-start gap-4 rounded-card bg-npf-mist p-4 md:p-5 ${className}`}
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-npf-blue text-white">
        <ShieldIcon aria-hidden className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="npf-small text-npf-body">
          {filed ? t("Handled by") : t("This goes to")}
        </p>
        <p className="npf-h5 mt-0.5 text-npf-blue-deep">
          {commandLabel(t, where.state)}
        </p>
        <p className="npf-small mt-0.5 text-npf-ink">
          {where.lga
            ? divisionLabel(t, where.lga, where.division)
            : t("The division is set by the area you choose.")}
        </p>
        {where.division && divisionNamed(where.division) ? (
          <p className="npf-small mt-0.5 text-npf-body">
            {divisionNamed(where.division)!.address}
          </p>
        ) : null}
      </div>
    </div>
  );
}
