import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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

export const metadata: Metadata = {
  // Lets article pages emit absolute og:image URLs; override per deployment.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dubaipolice.gov.ae",
  ),
  title: "Dubai Police - Smart Secure Together",
  description:
    "Together for a safer Dubai tomorrow. Report, apply, inquire and pay, and request support from Dubai Police.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${dubai.variable} ${bukra.variable} h-full`}
    >
      <body className="min-h-full overflow-x-hidden">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-dp-green-ink focus:shadow-lg"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
