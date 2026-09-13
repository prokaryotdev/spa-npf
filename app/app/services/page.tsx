import type { Metadata } from "next";
import Image from "next/image";
import { PageShell } from "../../components/PageShell";
import { serviceCategories } from "../../content-footer";

export const metadata: Metadata = {
  title: "Services | Dubai Police",
  description:
    "The seven Dubai Police service packages and what each one covers.",
};

export default function ServicesPage() {
  return (
    <PageShell
      title="Services"
      intro="The seven Dubai Police service packages and what each one covers."
    >
      <section className="bg-white pb-24">
        <div className="dp-container grid gap-6 md:grid-cols-2">
          {serviceCategories.map((category) => (
            <article
              key={category.name}
              className="flex flex-col rounded-3xl bg-white p-7 ring-1 ring-black/5 shadow-[0_24px_40px_-30px_rgba(0,60,40,0.5)]"
            >
              <div className="flex items-start gap-4">
                {category.icon ? (
                  <span className="rounded-2xl bg-[#F4F8F6] p-3">
                    <Image
                      src={category.icon}
                      alt=""
                      width={40}
                      height={40}
                      className="size-10"
                    />
                  </span>
                ) : null}
                <div className="min-w-0">
                  <h2 className="font-secondary text-xl font-bold text-dp-green-deep">
                    {category.name}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-dp-body">
                    {category.description}
                  </p>
                </div>
              </div>

              <ul className="mt-5 flex flex-wrap gap-2">
                {category.services.map((service) => (
                  <li
                    key={service.name}
                    className="rounded-full bg-[#F4F8F6] px-3.5 py-1.5 text-sm text-dp-green-ink"
                  >
                    {service.name.trim()}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
