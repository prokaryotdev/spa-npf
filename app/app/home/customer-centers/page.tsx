import type { Metadata } from "next";
import Image from "next/image";
import { PageShell } from "../../../components/PageShell";
import { ArrowUpRight, PinIcon } from "../../../components/icons";
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
  const commands = customerCenters.filter(
    (c) => c.kind === "Area Command",
  ).length;

  return (
    <PageShell
      title={t("Customer Centers")}
      intro={t(
        "Area Commands and Divisional Headquarters across the Federal Capital Territory, with addresses and opening hours.",
      )}
    >
      <section className="bg-white pb-24">
        <div className="npf-container">
          <p className="mb-8 text-sm text-npf-muted">
            {t(
              "{total} stations · {commands} Area Commands and {divisions} Divisional Headquarters",
              {
                total: customerCenters.length,
                commands,
                divisions: customerCenters.length - commands,
              },
            )}
          </p>

          <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {customerCenters.map((center) => (
              <li
                key={center.name}
                className="flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-black/5 shadow-[0_24px_40px_-30px_rgba(0,60,40,0.5)]"
              >
                {center.image ? (
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={center.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 92vw, 32vw"
                      className="object-cover"
                    />
                    <span className="absolute top-3 start-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-npf-blue-deep backdrop-blur">
                      {t(center.kind)}
                    </span>
                  </div>
                ) : null}

                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h2 className="font-secondary text-lg font-bold text-npf-blue-deep">
                    {center.name}
                  </h2>
                  <p className="flex gap-2 text-sm leading-relaxed text-npf-body">
                    <PinIcon
                      aria-hidden
                      className="mt-0.5 size-4 shrink-0 text-npf-blue"
                    />
                    {center.address}
                  </p>
                  <p className="text-sm text-npf-muted">
                    {t("{council} Area Council", { council: t(center.area) })}
                    {" · "}
                    {t("Open: {hours}", { hours: t(center.timing) })}
                  </p>
                  {center.map ? (
                    <a
                      href={center.map}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center gap-1.5 self-start pt-2 text-sm font-medium text-npf-blue-ink transition-colors hover:text-npf-blue-deep"
                    >
                      {t("Open in Maps")}
                      <ArrowUpRight aria-hidden className="size-4" />
                      <span className="sr-only">
                        {t("(opens in a new window)")}
                      </span>
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
