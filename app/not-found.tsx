import type { Metadata } from "next";
import Link from "./i18n/Link";
import { PageShell } from "./components/PageShell";
import { reveal } from "./components/reveal";
import ServiceSearch from "./components/ServiceSearch";
import {
  ArrowRight,
  FileIcon,
  GlobeIcon,
  PhoneCallIcon,
  ServicesIcon,
} from "./components/icons";
import { getT } from "./i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return { title: t("Page not found | Nigeria Police Force") };
}

/** Where most lost visitors were heading, each with why you'd go there. */
const elsewhere = [
  {
    label: "Services",
    body: "Apply for a certificate, report a crime or pay a fine.",
    href: "/app/services",
    Icon: ServicesIcon,
  },
  {
    label: "Information",
    body: "Laws, traffic offences and the speed limits.",
    href: "/app/home/information",
    Icon: FileIcon,
  },
  {
    label: "Contact Us",
    body: "Phone lines, email and feedback.",
    href: "/app/home/contactUs",
    Icon: PhoneCallIcon,
  },
  {
    label: "Sitemap",
    body: "Every page on the site, in one list.",
    href: "/app/home/sitemap",
    Icon: GlobeIcon,
  },
];

export default async function NotFound() {
  const t = await getT();
  return (
    <PageShell
      title={t("Page not found")}
      intro={t("That page has moved or never existed. Here is the way back.")}
      lead={
        <div className="mt-8 flex max-w-3xl flex-col gap-4 md:mt-10">
          <ServiceSearch
            variant="panel"
            placeholder={t("Search for a service, news or page")}
          />
          <Link href="/" className="npf-btn npf-btn-primary self-start">
            {t("Back to home")}
            <span className="npf-btn-disc">
              <ArrowRight className="npf-arrow size-4 rtl:-scale-x-100" />
            </span>
          </Link>
        </div>
      }
    >
      <section className="bg-white pb-(--npf-section-y)">
        <div className="npf-container">
          <h2 className="npf-h4 text-npf-blue-deep">{t("Or go straight to")}</h2>
          <ul className="mt-5 grid gap-(--npf-gap) sm:grid-cols-2 xl:grid-cols-4">
            {elsewhere.map(({ label, body, href, Icon }, i) => (
              <li key={href} {...reveal(i)}>
                <Link
                  href={href}
                  className="npf-link-card group flex h-full flex-col p-5"
                >
                  <span className="npf-disc size-12 rounded-chip">
                    <Icon className="size-6" />
                  </span>
                  <span className="npf-h5 mt-4 text-npf-ink transition-colors group-hover:text-npf-blue">
                    {t(label)}
                  </span>
                  <span className="npf-small mt-1 mb-5 text-npf-body">
                    {t(body)}
                  </span>
                  <ArrowRight className="npf-go mt-auto" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
