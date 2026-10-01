import type { Metadata } from "next";
import Image from "next/image";
import { Facts, PageShell } from "../../../components/PageShell";
import { reveal } from "../../../components/reveal";
import { ArrowUpRight, ClockIcon, PinIcon } from "../../../components/icons";
import { customerCenters as customerCentersSource } from "../../../content-footer";
import { getT, getLocalized } from "../../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: t("Customer Centers | Nigeria Police Force"),
    description: t(
      "Area Commands and Divisional Headquarters across the Federal Capital Territory, with addresses and opening hours.",
    ),
  };
}

export default async function CustomerCentersPage() {
  const customerCenters = await getLocalized(customerCentersSource);
  const t = await getT();
  // Grouped on the English kind, so the split holds on the Hausa page too.
  const kinds = customerCentersSource.map((c) => c.kind);
  const groups = [
    { kind: "Area Command", title: t("Area Commands") },
    { kind: "Divisional Headquarters", title: t("Divisional Headquarters") },
  ].map((g) => ({
    ...g,
    centers: customerCenters.filter((_, i) => kinds[i] === g.kind),
  }));

  const facts = [
    { label: t("Stations"), value: customerCenters.length },
    ...groups.map((g) => ({ label: g.title, value: g.centers.length })),
    { label: t("Open"), value: t("24 hours") },
  ];

  return (
    <PageShell
      title={t("Customer Centers")}
      intro={t(
        "Area Commands and Divisional Headquarters across the Federal Capital Territory, with addresses and opening hours.",
      )}
      lead={<Facts facts={facts} className="max-md:grid-cols-2" />}
    >
      <section className="bg-white pb-(--npf-section-y)">
        <div className="npf-container space-y-16">
          {groups.map((group) => (
            <section key={group.kind} aria-labelledby={slug(group.kind)}>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2
                  id={slug(group.kind)}
                  className="npf-h3 text-npf-blue-deep"
                >
                  {group.title}
                </h2>
                <span className="npf-body text-npf-steel tabular-nums">
                  {group.centers.length}
                </span>
              </div>
              <ul className="mt-6 grid gap-(--npf-gap) md:grid-cols-2 xl:grid-cols-3">
                {group.centers.map((center, i) => (
                  <li key={center.name} {...reveal(i % 3)}>
                    <Center center={center} t={t} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

type CenterT = Awaited<ReturnType<typeof getT>>;

/** One station: the whole card opens it in Maps. */
function Center({
  center,
  t,
}: {
  center: (typeof customerCentersSource)[number];
  t: CenterT;
}) {
  const body = (
    <>
      <div className="relative aspect-[16/9] overflow-hidden bg-npf-cloud">
        {center.image ? (
          <Image
            src={center.image}
            alt=""
            fill
            sizes="(max-width: 768px) 92vw, (max-width: 1280px) 46vw, 30vw"
            className="object-cover transition-transform duration-(--dur-media) ease-(--ease-out) group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
          />
        ) : (
          <PinIcon className="absolute inset-0 m-auto size-8 text-npf-blue/30" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="npf-h5 text-npf-blue-deep transition-colors group-hover:text-npf-blue">
          {center.name}
        </h3>
        <p className="npf-small mt-2 flex gap-2 text-npf-body">
          <PinIcon
            aria-hidden
            className="mt-0.5 size-4 shrink-0 text-npf-steel"
          />
          {center.address}
        </p>
        <p className="npf-small mt-1 flex gap-2 text-npf-body">
          <ClockIcon
            aria-hidden
            className="mt-0.5 size-4 shrink-0 text-npf-steel"
          />
          {t("{council} Area Council", { council: t(center.area) })}
          {" · "}
          {t("Open: {hours}", { hours: t(center.timing) })}
        </p>
        {center.map ? (
          <span className="npf-small mt-auto flex items-center justify-between gap-3 border-t border-npf-hairline pt-4 font-medium text-npf-blue [&:not(:first-child)]:mt-5">
            {t("Open in Maps")}
            <ArrowUpRight aria-hidden className="npf-go" />
          </span>
        ) : null}
      </div>
    </>
  );
  const card = "npf-link-card group flex h-full flex-col overflow-hidden";
  return center.map ? (
    <a
      href={center.map}
      target="_blank"
      rel="noopener noreferrer"
      className={card}
    >
      {body}
      <span className="sr-only">{t("(opens in a new window)")}</span>
    </a>
  ) : (
    <div className={card}>{body}</div>
  );
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
