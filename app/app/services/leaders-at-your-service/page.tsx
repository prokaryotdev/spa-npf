import type { Metadata } from "next";
import { PageShell } from "../../../components/PageShell";
import { leadersService as data } from "../../../content-footer";

export const metadata: Metadata = {
  title: "Leaders at Your Service | Dubai Police",
  description: data.description,
};

const facts = [
  { label: "Working hours", value: data.workingHours },
  { label: "Response within", value: data.turnaround },
];

const lists = [
  { label: "Who it is for", items: data.beneficiaries },
  { label: "Where to use it", items: data.channels },
  { label: "Required documents", items: data.documents },
  { label: "Other ways to reach us", items: data.contacts },
];

export default function LeadersAtYourServicePage() {
  return (
    <PageShell
      title="Leaders at Your Service"
      intro={data.description}
      trail={[{ label: "Services", href: "/app/services" }]}
    >
      <section className="bg-white pb-24">
        <div className="dp-container">
          <div className="grid gap-4 sm:grid-cols-2">
            {facts.map((fact) => (
              <div key={fact.label} className="rounded-2xl bg-[#F4F8F6] p-6">
                <p className="text-sm text-dp-muted">{fact.label}</p>
                <p className="mt-1 font-secondary text-2xl font-bold text-dp-green-deep">
                  {fact.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {lists.map((list) => (
              <div key={list.label}>
                <h2 className="mb-3 font-secondary text-lg font-bold text-dp-green-deep">
                  {list.label}
                </h2>
                <ul className="space-y-2">
                  {list.items.map((item) => (
                    <li
                      key={item}
                      className="relative pl-6 text-base text-dp-body before:absolute before:top-[0.6em] before:left-0 before:size-2 before:rounded-full before:bg-dp-green"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
