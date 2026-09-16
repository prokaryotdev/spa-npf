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

// --- stripLocale ----------------------------------------------------------
assert.deepEqual(stripLocale("/ar/app/services"), { lang: "ar", rest: "/app/services" });
assert.deepEqual(stripLocale("/en"), { lang: "en", rest: "/" });
assert.deepEqual(stripLocale("/ar/"), { lang: "ar", rest: "/" });
// Not a language: left whole, so /app/... never loses its first segment.
assert.deepEqual(stripLocale("/app/services"), { lang: null, rest: "/app/services" });
assert.deepEqual(stripLocale("/"), { lang: null, rest: "/" });
// A page whose own slug looks like a language must not be eaten.
assert.deepEqual(stripLocale("/english"), { lang: null, rest: "/english" });

// --- localePath -----------------------------------------------------------
assert.equal(localePath("/app/services", "ar"), "/ar/app/services");
assert.equal(localePath("/", "ar"), "/ar");
assert.equal(localePath("/", "en"), "/en");
// Already prefixed: replaced, never doubled.
assert.equal(localePath("/en/app/services", "ar"), "/ar/app/services");
assert.equal(localePath("/ar/app/services", "ar"), "/ar/app/services");
// Query and hash survive, and stay behind the path.
assert.equal(localePath("/app/search?q=fine", "ar"), "/ar/app/search?q=fine");
assert.equal(localePath("/app/services#fees", "en"), "/en/app/services#fees");
assert.equal(localePath("/app/search?q=a#b", "ar"), "/ar/app/search?q=a#b");

// Anything that is not a same-site path is returned untouched: prefixing an
// external link, a phone number or a bare anchor would break it.
for (const href of [
  "https://esaad.dubaipolice.gov.ae/",
  "//cdn.example.com/x.png",
  "mailto:mail@dubaipolice.gov.ae",
  "tel:901",
  "#main-content",
])
  assert.equal(localePath(href, "ar"), href, `should not touch ${href}`);

// Nor anything that is not a page.
for (const href of ["/api/report-error", "/sitemap.xml", "/robots.txt", "/_next/static/x.js"]) {
  assert.equal(isReserved(href), true, `${href} should be reserved`);
  assert.equal(localePath(href, "ar"), href, `should not touch ${href}`);
}

// Static files are not pages. Redirecting /img/logo.svg to /en/img/logo.svg
// broke the CSS logo masks and made the image optimiser fetch a redirect
// instead of an SVG and answer 400. A hand-written list of filenames had
// missed the whole of public/, so the rule is now "the last segment has an
// extension".
for (const href of [
  "/img/logo-gov-dubai.svg",
  "/cms/dp-service-icons/Cardiac_Support_3d22628230.svg",
  "/cms/Innovation_2d3f3540e6.jpg",
  "/fonts/DubaiRegular.woff2",
  "/opengraph-image.png",
  "/_next/static/chunks/main.js",
]) {
  assert.equal(isReserved(href), true, href + " should be reserved");
  assert.equal(localePath(href, "ar"), href, "should not touch " + href);
}

// Pages still take a prefix, including slugs full of hyphens.
for (const href of [
  "/app/services/police-clearance-certificate",
  "/app/home/contactUs",
  "/app/home/information/view-black-points-traffic-violations",
]) {
  assert.equal(isReserved(href), false, href + " is a page");
  assert.equal(localePath(href, "ar"), "/ar" + href);
}

// --- pickLang -------------------------------------------------------------
// The visitor's own choice beats everything.
assert.equal(pickLang("ar", "en-GB,en;q=0.9"), "ar");
assert.equal(pickLang("en", "ar"), "en");
// Then the browser's ask, region tags and weights included.
assert.equal(pickLang(undefined, "ar-AE,ar;q=0.9,en;q=0.8"), "ar");
assert.equal(pickLang(undefined, "en-US,en;q=0.9"), "en");
assert.equal(pickLang(undefined, "fr-FR,fr;q=0.9,ar;q=0.5"), "ar");
// Then English.
assert.equal(pickLang(undefined, null), "en");
assert.equal(pickLang("klingon", "de-DE"), "en");

console.log("locale prefixing — ok");
