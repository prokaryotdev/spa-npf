import type { Metadata } from "next";
import Image from "next/image";
import { PageShell } from "../../../../components/PageShell";
import { orgStructure as org } from "../../../../content-sub";

export const metadata: Metadata = {
  title: "Organizational Structure | Dubai Police",
  description: org.subTitle,
};

type Person = {
  img?: string;
  name?: string;
  designation?: string;
  departments?: readonly { img?: string; title?: string }[];
  sub?: readonly Person[];
};

/** Portrait plus title — the unit the whole chart is built from. */
function PersonCard({
  person,
  size = "md",
}: {
  person: Person;
  size?: "lg" | "md" | "sm";
}) {
  const portrait =
    size === "lg" ? "size-32" : size === "md" ? "size-24" : "size-20";
  return (
    <div className="flex flex-col items-center text-center">
      {person.img ? (
        <div
          className={`relative ${portrait} overflow-hidden rounded-full bg-[#F4F8F6] ring-2 ring-dp-green/20`}
        >
          <Image
            src={person.img}
            alt=""
            fill
            sizes="128px"
            className="object-cover object-top"
          />
        </div>
      ) : null}
      <p
        className={`mt-3 font-secondary font-bold text-dp-green-deep ${
          size === "lg" ? "text-lg md:text-xl" : "text-sm md:text-base"
        }`}
      >
        {person.name}
      </p>
      {person.designation ? (
        <p className="mt-1 max-w-[32ch] text-xs leading-relaxed text-dp-muted md:text-sm">
          {person.designation}
        </p>
      ) : null}
    </div>
  );
}

function Departments({
  departments,
}: {
  departments: readonly { img?: string; title?: string }[];
}) {
  return (
    <ul className="mt-4 space-y-2">
      {departments.map((d) => (
        <li
          key={d.title}
          className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 text-left ring-1 ring-black/5"
        >
          {d.img ? (
            <span className="relative size-7 shrink-0">
              <Image
                src={d.img}
                alt=""
                fill
                sizes="28px"
                className="object-contain"
              />
            </span>
          ) : null}
          <span className="text-xs leading-snug text-dp-ink md:text-sm">
            {d.title}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function OrgStructurePage() {
  const commander = org.commander as Person;

  return (
    <PageShell
      title={org.title}
      intro={org.subTitle}
      trail={[{ label: "About Us", href: "/app/home/aboutus" }]}
    >
      <section className="bg-white pb-24">
        <div className="dp-container">
          {/* Leadership */}
          <div className="mb-16 grid gap-10 border-b border-black/10 pb-16 sm:grid-cols-2 lg:grid-cols-3">
            <PersonCard person={org.chief as Person} size="lg" />
            <PersonCard person={commander} size="lg" />
            <PersonCard person={org.deputyChief as Person} size="lg" />
          </div>

          {/* Departments reporting straight to the Commander-in-Chief */}
          {commander.departments?.length ? (
            <div className="mb-16">
              <h2 className="mb-4 font-secondary text-xl font-bold text-dp-green-deep">
                Reporting to the Commander-in-Chief
              </h2>
              <div className="max-w-2xl">
                <Departments departments={commander.departments} />
              </div>
            </div>
          ) : null}

          {/* Each deputy and the sectors beneath them */}
          <div className="space-y-16">
            {(commander.sub ?? []).map((deputy) => (
              <div key={deputy.name}>
                <div className="mb-8 flex flex-col items-center rounded-3xl bg-[#F4F8F6] p-8">
                  <PersonCard person={deputy} />
                </div>

                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
                  {(deputy.sub ?? []).map((head) => (
                    <div key={head.name} className="flex flex-col">
                      <PersonCard person={head} size="sm" />
                      {head.departments?.length ? (
                        <Departments departments={head.departments} />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
