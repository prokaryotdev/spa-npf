import type { Metadata } from "next";
import Image from "next/image";
import { PageShell } from "../../../../components/PageShell";
import { ArrowUpRight } from "../../../../components/icons";
import { sustainability as data } from "../../../../content-sub";

export const metadata: Metadata = {
  title: "Best Practices in Sustainable Development | Dubai Police",
  description:
    "Know more about how Dubai Police is driving innovation to achieve a sustainable future.",
};

export default function SustainabilityPage() {
  return (
    <PageShell
      title={data.title}
      intro="Know more about how Dubai Police is driving innovation to achieve a sustainable future."
      trail={[{ label: "Information", href: "/app/home/information" }]}
    >
      <section className="bg-white pb-24">
        <div className="dp-container">
          <p className="mb-6 text-sm text-dp-muted">
            Page last updated: {data.updatedAt}
          </p>

          <ul className="grid gap-6 md:grid-cols-2">
            {data.rows.map((row) => (
              <li key={row.subject}>
                <a
                  href={row.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/card flex gap-5 rounded-2xl bg-white p-5 ring-1 ring-black/5 transition-shadow hover:shadow-[0_20px_40px_-28px_rgba(0,60,40,0.5)]"
                >
                  {data.cover ? (
                    <span className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-[#F4F8F6]">
                      <Image
                        src={data.cover}
                        alt=""
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </span>
                  ) : null}
                  <span className="min-w-0 flex-1">
                    <span className="block font-secondary text-base font-bold text-dp-ink transition-colors group-hover/card:text-dp-green">
                      {row.subject}
                    </span>
                    <span className="mt-1 block text-sm text-dp-muted">
                      {row.issueDate} · PDF · {row.size}
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="size-5 shrink-0 self-center text-dp-green"
                  />
                  <span className="sr-only">(opens in a new window)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
