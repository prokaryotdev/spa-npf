import type { Metadata } from "next";
import Image from "next/image";
import { PageShell } from "../../../components/PageShell";
import { ArrowUpRight, PinIcon } from "../../../components/icons";
import { customerCenters } from "../../../content-footer";

export const metadata: Metadata = {
  title: "Customer Centers | Dubai Police",
  description:
    "Police stations and Smart Police Stations across Dubai, with addresses and opening hours.",
};

export default function CustomerCentersPage() {
  const smart = customerCenters.filter(
    (c) => c.kind === "Smart Police Station",
  ).length;

  return (
    <PageShell
      title="Customer Centers"
      intro="Police stations and Smart Police Stations across Dubai, with addresses and opening hours."
    >
      <section className="bg-white pb-24">
        <div className="dp-container">
          <p className="mb-8 text-sm text-dp-muted">
            {customerCenters.length} centers · {smart} of them self-service
            Smart Police Stations
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
                    <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-dp-green-deep backdrop-blur">
                      {center.kind}
                    </span>
                  </div>
                ) : null}

                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h2 className="font-secondary text-lg font-bold text-dp-green-deep">
                    {center.name}
                  </h2>
                  <p className="flex gap-2 text-sm leading-relaxed text-dp-body">
                    <PinIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-dp-green" />
                    {center.address}
                  </p>
                  <p className="text-sm text-dp-muted">Open: {center.timing}</p>
                  {center.map ? (
                    <a
                      href={center.map}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center gap-1.5 self-start pt-2 text-sm font-medium text-dp-green transition-colors hover:text-dp-green-deep"
                    >
                      Open in Maps
                      <ArrowUpRight aria-hidden className="size-4" />
                      <span className="sr-only">(opens in a new window)</span>
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
