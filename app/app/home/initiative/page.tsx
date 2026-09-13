import type { Metadata } from "next";
import { PageShell } from "../../../components/PageShell";
import { CalendarIcon } from "../../../components/icons";
import { initiativePeriods } from "../../../content-footer";

export const metadata: Metadata = {
  title: "Initiative | Dubai Police",
  description:
    "The Initiatives and Projects Stars voting rounds run by the General Department of Excellence and Pioneering.",
};

/** Dates arrive as dd-mm-yyyy, which Date cannot parse on its own. */
const pretty = (d: string) => {
  const [day, month, year] = d.split("-");
  return new Date(`${year}-${month}-${day}`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function InitiativePage() {
  const [current, ...past] = initiativePeriods;

  return (
    <PageShell
      title="Initiative"
      intro="Every year Dubai Police opens a vote on the initiatives and projects that most improved a service or a process."
    >
      <section className="bg-white pb-24">
        <div className="dp-container">
          <article className="rounded-3xl bg-[#F4F8F6] p-8 md:p-12">
            <p className="font-secondary text-sm font-bold tracking-wide text-dp-green uppercase">
              Current round
            </p>
            <h2 className="mt-2 font-secondary text-2xl font-bold text-dp-green-deep md:text-4xl">
              {current.title}
            </h2>
            <p className="mt-3 flex items-center gap-2 text-sm text-dp-muted">
              <CalendarIcon aria-hidden className="size-4 text-dp-green" />
              {pretty(current.from)} — {pretty(current.to)}
            </p>
            <p className="mt-5 max-w-[75ch] text-base leading-relaxed text-dp-body">
              {current.details}
            </p>
          </article>

          <h2 className="mt-14 mb-6 font-secondary text-xl font-bold text-dp-green-deep">
            Previous rounds
          </h2>
          <ul className="grid gap-6 md:grid-cols-2">
            {past.map((period) => (
              <li
                key={period.title}
                className="rounded-3xl bg-white p-6 ring-1 ring-black/5"
              >
                <h3 className="font-secondary text-lg font-bold text-dp-green-deep">
                  {period.title}
                </h3>
                <p className="mt-2 flex items-center gap-2 text-sm text-dp-muted">
                  <CalendarIcon aria-hidden className="size-4 text-dp-green" />
                  {pretty(period.from)} — {pretty(period.to)}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-dp-body">
                  {period.details}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
