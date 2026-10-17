import localFont from "next/font/local";

/** The two faces, shared by the root layout and the page that replaces it. */
export const sans = localFont({
  variable: "--font-primary-face",
  display: "swap",
  src: [
    { path: "./fonts/SansLight.woff2", weight: "300", style: "normal" },
    { path: "./fonts/SansRegular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/SansMedium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/SansBold.woff2", weight: "700", style: "normal" },
  ],
});

export const display = localFont({
  variable: "--font-secondary-face",
  display: "swap",
  src: [
    { path: "./fonts/DisplayLight.woff2", weight: "300", style: "normal" },
    { path: "./fonts/DisplayRegular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/DisplayBold.woff2", weight: "700", style: "normal" },
  ],
});
