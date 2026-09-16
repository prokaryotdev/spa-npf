import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LocaleProvider } from "./i18n/client";
import { dirOf } from "./i18n/config";
import { getLang, getT } from "./i18n/server";

const dubai = localFont({
  variable: "--font-dubai",
  display: "swap",
  src: [
    { path: "./fonts/DubaiLight.woff2", weight: "300", style: "normal" },
    { path: "./fonts/DubaiRegular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/DubaiMedium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/DubaiBold.woff2", weight: "700", style: "normal" },
  ],
});

const bukra = localFont({
  variable: "--font-bukra",
  display: "swap",
  src: [
    { path: "./fonts/BukraLight.woff2", weight: "300", style: "normal" },
    { path: "./fonts/BukraRegular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/BukraBold.woff2", weight: "700", style: "normal" },
  ],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    // Lets article pages emit absolute og:image URLs; override per deployment.
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dubaipolice.gov.ae",
    ),
    title: t("Dubai Police - Smart Secure Together"),
    description: t(
      "Together for a safer Dubai tomorrow. Report, apply, inquire and pay, and request support from Dubai Police.",
    ),
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const lang = await getLang();
  const t = await getT();

  return (
    <html
      lang={lang}
      dir={dirOf(lang)}
      className={`${dubai.variable} ${bukra.variable} h-full`}
    >
      <body className="min-h-full overflow-x-hidden">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-dp-green-ink focus:shadow-lg"
        >
          {t("Skip to main content")}
        </a>
        <LocaleProvider lang={lang}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
