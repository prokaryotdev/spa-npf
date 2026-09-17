import type { Metadata } from "next";
import Link from "./i18n/Link";
import { PageShell } from "./components/PageShell";
import { ArrowRight } from "./components/icons";
import { getT } from "./i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("Page not found | Dubai Police") };
}

const elsewhere = [
  { label: "Services", href: "/app/services" },
  { label: "Information", href: "/app/home/information" },
  { label: "Contact Us", href: "/app/home/contactUs" },
  { label: "Sitemap", href: "/app/home/sitemap" },
];

export default async function NotFound() {
  const t = await getT();
  return (
    <PageShell
      title={t("Page not found")}
      intro={t("That page has moved or never existed. Here is the way back.")}
    >
      <section className="bg-white pb-24">
        <div className="dp-container flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-dp-green px-6 py-3 font-medium text-white transition-colors hover:bg-dp-green-mid"
          >
            {t("Back to home")}
            <ArrowRight className="size-4" />
          </Link>
          {elsewhere.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center rounded-full bg-[#F4F8F6] px-6 py-3 font-medium text-dp-green-ink ring-1 ring-black/5 transition-colors hover:bg-[#e7f6f1]"
            >
              {t(link.label)}
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
