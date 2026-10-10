import type { Metadata } from "next";
import { Facts, PageShell } from "../../../components/PageShell";
import { reveal } from "../../../components/reveal";
import { ArrowUpRight, ClockIcon, PinIcon } from "../../../components/icons";
import {
  forceHeadquarters,
  stateCommands,
  zones,
} from "../../../content-footer";
import { getT } from "../../../i18n/server";

type T = Awaited<ReturnType<typeof getT>>;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Customer Centers | Nigeria Police Force"),
    description: t(
      "Force Headquarters and the Police Command of every state and the FCT, with where to find each one.",
    ),
  };
}

export default async function CustomerCentersPage() {
  const t = await getT();
  const facts = [
    { label: t("Commands"), value: stateCommands.length },
    { label: t("Zones"), value: zones.length },
    { label: t("Open"), value: t("24 hours") },
  ];

  return (
    <PageShell
      title={t("Customer Centers")}
      intro={t(
        "Force Headquarters and the Police Command of every state and the FCT, with where to find each one.",
      )}
      lead={<Facts facts={facts} className="max-md:grid-cols-2" />}
    >
      <section className="bg-white pb-(--npf-section-y)">
        <div className="npf-container space-y-16">
          <ul className="grid gap-(--npf-gap) md:grid-cols-2 xl:grid-cols-3">
            <li {...reveal(0)}>
              <Center
                name={t(forceHeadquarters.name)}
                place={forceHeadquarters.address}
                map={forceHeadquarters.map}
                t={t}
              />
            </li>
          </ul>
          {zones.map((zone) => {
            const commands = stateCommands.filter((c) => c.zone === zone);
            return (
              <section key={zone} aria-labelledby={slug(zone)}>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2 id={slug(zone)} className="npf-h3 text-npf-blue-deep">
                    {t(zone)}
                  </h2>
                  <span className="npf-body text-npf-steel tabular-nums">
                    {commands.length}
                  </span>
                </div>
                <ul className="mt-6 grid gap-(--npf-gap) md:grid-cols-2 xl:grid-cols-3">
                  {commands.map((c, i) => (
                    <li key={c.state} {...reveal(i % 3)}>
                      <Center
                        name={
                          c.state === "FCT"
                            ? "FCT Command"
                            : t("{state} State Command", { state: c.state })
                        }
                        place={c.city}
                        map={c.map}
                        t={t}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}

/** One Command: the whole card opens it in Maps. */
function Center({
  name,
  place,
  map,
  t,
}: {
  name: string;
  place: string;
  map: string;
  t: T;
}) {
  return (
    <a
      href={map}
      target="_blank"
      rel="noopener noreferrer"
      className="npf-link-card group flex h-full flex-col p-5"
    >
      <h3 className="npf-h5 text-npf-blue-deep transition-colors group-hover:text-npf-blue">
        {name}
      </h3>
      <p className="npf-small mt-2 flex gap-2 text-npf-body">
        <PinIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-npf-steel" />
        {place}
      </p>
      <p className="npf-small mt-1 flex gap-2 text-npf-body">
        <ClockIcon
          aria-hidden
          className="mt-0.5 size-4 shrink-0 text-npf-steel"
        />
        {t("Open: {hours}", { hours: t("24 hours") })}
      </p>
      <span className="npf-small mt-auto flex items-center justify-between gap-3 border-t border-npf-hairline pt-4 font-medium text-npf-blue [&:not(:first-child)]:mt-5">
        {t("Open in Maps")}
        <ArrowUpRight aria-hidden className="npf-go" />
      </span>
      <span className="sr-only">{t("(opens in a new window)")}</span>
    </a>
  );
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
