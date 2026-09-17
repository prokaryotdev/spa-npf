import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { OrganisationLd } from "./components/StructuredData";
import { LocaleProvider } from "./i18n/client";
import { dirOf } from "./i18n/config";
import { getLang, getPathname, getT } from "./i18n/server";
import { LANGS } from "./i18n/config";
import { localePath } from "./i18n/path";

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

/**
 * Paints the phone browsers own chrome in the brand green instead of framing
 * the page in white, and keeps the page readable when the OS is in dark mode
 * rather than letting it invert a light design.
 *
 * There is no web app manifest yet, deliberately: an installable icon needs a
 * square version of the force crest, and the only artwork in the repo is the
 * wide wordmark used as a CSS mask. Guessing at it is not mine to do.
 */
export const viewport: Viewport = {
  themeColor: "#008755",
  colorScheme: "light",
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  const path = await getPathname();
  return {
    // Lets article pages emit absolute og:image URLs; override per deployment.
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dubaipolice.gov.ae",
    ),
    // One address per page per language, each naming the other. Without
    // these a crawler has no way to learn the Arabic page exists.
    alternates: {
      canonical: localePath(path, await getLang()),
      languages: Object.fromEntries(
        LANGS.map((l) => [l, localePath(path, l)]),
      ),
    },
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
        <OrganisationLd lang={lang} />
        <LocaleProvider lang={lang}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
