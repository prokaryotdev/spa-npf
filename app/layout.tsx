import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { OrganisationLd } from "./components/StructuredData";
import { LocaleProvider } from "./i18n/client";
import { getLang, getPathname, getT } from "./i18n/server";
import { LANGS } from "./i18n/config";
import { localePath } from "./i18n/path";

const sans = localFont({
  variable: "--font-primary-face",
  display: "swap",
  src: [
    { path: "./fonts/SansLight.woff2", weight: "300", style: "normal" },
    { path: "./fonts/SansRegular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/SansMedium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/SansBold.woff2", weight: "700", style: "normal" },
  ],
});

const display = localFont({
  variable: "--font-secondary-face",
  display: "swap",
  src: [
    { path: "./fonts/DisplayLight.woff2", weight: "300", style: "normal" },
    { path: "./fonts/DisplayRegular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/DisplayBold.woff2", weight: "700", style: "normal" },
  ],
});

/**
 * Paints the phone browsers own chrome in the brand navy instead of framing
 * the page in white, and keeps the page readable when the OS is in dark mode
 * rather than letting it invert a light design.
 *
 * The tab and home-screen icons are the force crest, squared up from
 * public/logo.png by app/favicon.ico, app/icon.png and app/apple-icon.png.
 * There is still no web app manifest, so Android installs fall back to the
 * apple-touch icon rather than getting a named, themed install.
 */
export const viewport: Viewport = {
  themeColor: "#12294B",
  colorScheme: "light",
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  const path = await getPathname();
  return {
    // Lets article pages emit absolute og:image URLs; override per deployment.
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://fct.npf.gov.ng",
    ),
    // One address per page per language, each naming the other. Without
    // these a crawler has no way to learn the Hausa page exists.
    alternates: {
      canonical: localePath(path, await getLang()),
      languages: Object.fromEntries(
        LANGS.map((l) => [l, localePath(path, l)]),
      ),
    },
    title: t("Nigeria Police Force, FCT Command - Safe Secure Together"),
    description: t(
      "Together for a safer Abuja tomorrow. Report, apply, inquire and pay, and request support from the Nigeria Police Force in the Federal Capital Territory.",
    ),
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const lang = await getLang();
  const t = await getT();

  return (
    <html
      lang={lang}
      dir="ltr"
      className={`${sans.variable} ${display.variable} h-full`}
    >
      <body className="min-h-full overflow-x-hidden">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-npf-blue-ink focus:shadow-lg"
        >
          {t("Skip to main content")}
        </a>
        <OrganisationLd lang={lang} />
        <LocaleProvider lang={lang}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
