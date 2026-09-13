import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "./components/PageShell";
import { ArrowRight } from "./components/icons";

export const metadata: Metadata = {
  title: "Page not found | Dubai Police",
};

const elsewhere = [
  { label: "Services", href: "/app/services" },
  { label: "News", href: "/app/home/media/news" },
  { label: "Contact Us", href: "/app/home/contactUs" },
  { label: "Sitemap", href: "/app/home/sitemap" },
];

export default function NotFound() {
  return (
    <PageShell
      title="Page not found"
      intro="That page has moved or never existed. Here is the way back."
    >
      <section className="bg-white pb-24">
        <div className="dp-container flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-dp-green px-6 py-3 font-medium text-white transition-colors hover:bg-dp-green-mid"
          >
            Back to home
            <ArrowRight className="size-4" />
          </Link>
          {elsewhere.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center rounded-full bg-[#F4F8F6] px-6 py-3 font-medium text-dp-green-ink ring-1 ring-black/5 transition-colors hover:bg-[#e7f6f1]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
