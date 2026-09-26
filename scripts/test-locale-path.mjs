/**
 * Locale prefixing. Every internal link on the site goes through localePath,
 * so a mistake here is a mistake on every page at once:
 *   node --import ./scripts/ts-resolve.mjs scripts/test-locale-path.mjs
 */
import assert from "node:assert/strict";

import {
  isReserved,
  localePath,
  pickLang,
  stripLocale,
} from "../app/i18n/path.ts";
import { INTL_LOCALE } from "../app/i18n/config.ts";

// --- stripLocale ----------------------------------------------------------
assert.deepEqual(stripLocale("/ha/app/services"), { lang: "ha", rest: "/app/services" });
assert.deepEqual(stripLocale("/en"), { lang: "en", rest: "/" });
assert.deepEqual(stripLocale("/ha/"), { lang: "ha", rest: "/" });
// Not a language: left whole, so /app/... never loses its first segment.
assert.deepEqual(stripLocale("/app/services"), { lang: null, rest: "/app/services" });
assert.deepEqual(stripLocale("/"), { lang: null, rest: "/" });
// A page whose own slug looks like a language must not be eaten.
assert.deepEqual(stripLocale("/english"), { lang: null, rest: "/english" });

// --- localePath -----------------------------------------------------------
assert.equal(localePath("/app/services", "ha"), "/ha/app/services");
assert.equal(localePath("/", "ha"), "/ha");
assert.equal(localePath("/", "en"), "/en");
// Already prefixed: replaced, never doubled.
assert.equal(localePath("/en/app/services", "ha"), "/ha/app/services");
assert.equal(localePath("/ha/app/services", "ha"), "/ha/app/services");
// Query and hash survive, and stay behind the path.
assert.equal(localePath("/app/search?q=fine", "ha"), "/ha/app/search?q=fine");
assert.equal(localePath("/app/services#fees", "en"), "/en/app/services#fees");
assert.equal(localePath("/app/search?q=a#b", "ha"), "/ha/app/search?q=a#b");

// Anything that is not a same-site path is returned untouched: prefixing an
// external link, a phone number or a bare anchor would break it.
for (const href of [
  "https://possap.gov.ng/",
  "//cdn.example.com/x.png",
  "mailto:mail@npf.gov.ng",
  "tel:112",
  "#main-content",
])
  assert.equal(localePath(href, "ha"), href, `should not touch ${href}`);

// Nor anything that is not a page.
for (const href of ["/api/report-error", "/sitemap.xml", "/robots.txt", "/_next/static/x.js"]) {
  assert.equal(isReserved(href), true, `${href} should be reserved`);
  assert.equal(localePath(href, "ha"), href, `should not touch ${href}`);
}

// Static files are not pages. Redirecting /img/logo.svg to /en/img/logo.svg
// broke the CSS logo masks and made the image optimiser fetch a redirect
// instead of an SVG and answer 400. A hand-written list of filenames had
// missed the whole of public/, so the rule is now "the last segment has an
// extension".
for (const href of [
  "/img/ai.svg",
  "/icons/services/cardiac-support.svg",
  "/cms/Home/Innovation_2d3f3540e6.jpg",
  "/fonts/SansRegular.woff2",
  "/opengraph-image.png",
  "/_next/static/chunks/main.js",
]) {
  assert.equal(isReserved(href), true, href + " should be reserved");
  assert.equal(localePath(href, "ha"), href, "should not touch " + href);
}

// Pages still take a prefix, including slugs full of hyphens.
for (const href of [
  "/app/services/police-clearance-certificate",
  "/app/home/contactUs",
  "/app/home/information/traffic-offences-and-penalties",
]) {
  assert.equal(isReserved(href), false, href + " is a page");
  assert.equal(localePath(href, "ha"), "/ha" + href);
}

// --- pickLang -------------------------------------------------------------
// The visitor's own choice beats everything.
assert.equal(pickLang("ha", "en-GB,en;q=0.9"), "ha");
assert.equal(pickLang("en", "ha"), "en");
// Then the browser's ask, region tags and weights included.
assert.equal(pickLang(undefined, "ha-NG,ha;q=0.9,en;q=0.8"), "ha");
assert.equal(pickLang(undefined, "en-US,en;q=0.9"), "en");
assert.equal(pickLang(undefined, "fr-FR,fr;q=0.9,ha;q=0.5"), "ha");
// Then English.
assert.equal(pickLang(undefined, null), "en");
assert.equal(pickLang("klingon", "de-DE"), "en");

// --- Intl locales ---------------------------------------------------------
// Both languages must format through a locale the browser actually carries.
// Node ships full ICU and knows ha-NG; browsers do not, and fall back to
// en-US. The server then renders "5 Jan, 2026" and the browser "Jan 5, 2026",
// which React throws the whole server tree away over on every Hausa page —
// silently, because a hydration mismatch only logs in development.
//
// This cannot open a browser, so it checks the rule instead of the symptom:
// every Intl locale here is an English one, which every engine carries.
for (const [lang, locale] of Object.entries(INTL_LOCALE))
  assert.match(
    locale,
    /^en(-[A-Z]{2})?$/,
    `${lang} formats through ${locale}; browsers may not carry it, and a ` +
      `locale the server knows and the browser does not is a hydration break`,
  );

console.log("locale prefixing — ok");
