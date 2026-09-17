/**
 * Walks every route in both languages against a running server and reports
 * anything that would show a reader the wrong language. Needs `npm run dev`
 * (or `next start`) up, so it is not part of `npm test`. Start that server
 * with API_URL set, or app/backend.ts will 404 sign-in, the portal and the
 * console and the sweep will report fourteen routes it cannot reach:
 *   node --import ./scripts/ts-resolve.mjs scripts/check-locales.mjs [baseUrl]
 *
 * It reports:
 *  - the html lang attribute
 *  - English left on a Hausa page
 *  - any 4xx/5xx
 *
 * Both languages are written in Latin letters, so "is this line Arabic?"
 * cannot stand in for "is this line translated?" the way it used to. The
 * check that replaces it is stricter and more literal: the dictionary is
 * loaded, and a Hausa page that still contains one of its English keys word
 * for word is a page where translate() did not run. Short keys are skipped,
 * because a four-letter English word can also be a Hausa one.
 */
import { dictionary } from "../app/i18n/ha.ts";
const BASE = process.argv[2] ?? "http://localhost:3111";

const ROUTES = [
  "/",
  "/app/home/contactUs",
  "/app/home/customer-centers",
  "/app/home/customer-service-agreement",
  "/app/home/information",
  "/app/home/information/laws-legislation",
  "/app/home/information/road-speed-limits",
  "/app/home/information/traffic-offences-and-penalties",
  "/app/home/privacy-policy",
  "/app/home/sitemap",
  "/app/home/terms-conditions",
  "/app/search?q=police",
  "/app/services",
  "/app/services/police-clearance-certificate",
  "/app/signin",
  "/app/portal",
  "/app/police",
  "/app/portal/fines",
  "/app/portal/requests",
  "/app/police/incidents",
  "/app/police/units",
  "/no-such-page",
];

/**
 * Only long keys are worth hunting for. A short one risks matching a Hausa
 * word, a proper noun or a fragment of a longer sentence that is correctly
 * translated, and a false alarm in a sweep like this is worse than a gap.
 */
const HUNTED = Object.keys(dictionary).filter((k) => k.length >= 24);

// Strings that legitimately stay in English on a Hausa page.
const ALLOWED = [
  "English",
  "NINAuth",
  "Nigeria Police Force",
  "SSL",
  "IP",
  "PIN",
  "SPS",
  "₦",
  "IBAN",
  "fct.npf.gov.ng",
  "mail@npf.gov.ng",
  "SWAT",
  "9mobile",
  "P1",
  "P2",
  "P3",
  "P4",
  "WAT",
  "QR",
  "TOEFL",
  "IELTS",
  "WAEC",
  "NECO",
  "NYSC",
  "NDLEA",
  "FRSC",
  "FCT",
  "FCTA",
  "PCRC",
  "POSSAP",
  "CID",
  "ATM",
  "PhD",
];

const stripTags = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, "\n");

let bad = 0;
for (const route of ROUTES) {
  for (const lang of ["en", "ha"]) {
    // Locale is the first path segment now, not a cookie, so the address
    // itself is what is being checked.
    const url = BASE + (route === "/" ? `/${lang}` : `/${lang}${route}`);
    const res = await fetch(url, { redirect: "follow" });
    const html = await res.text();
    const ok =
      res.status === 200 || (route === "/no-such-page" && res.status === 404);
    const m = html.match(/<html[^>]*lang="([a-z]+)"/);
    const langOk = m && m[1] === lang;

    let leaks = [];
    if (lang === "ha") {
      const text = stripTags(html).replace(/\s+/g, " ");
      for (const key of HUNTED) {
        if (ALLOWED.some((a) => key.includes(a))) continue;
        if (text.includes(key)) leaks.push(key.slice(0, 90));
      }
      leaks = [...new Set(leaks)];
    }

    if (!ok || !langOk || leaks.length) {
      bad++;
      console.log(
        `\n✗ ${lang} ${route}  status=${res.status} lang=${m ? m[1] : "?"}`,
      );
      for (const l of leaks.slice(0, 12)) console.log(`    EN: ${l}`);
      if (leaks.length > 12) console.log(`    … ${leaks.length - 12} more`);
    }
  }
}
// --- the entry routes and the switcher -----------------------------------
const fail = (msg) => {
  bad++;
  console.log(`\n✗ ${msg}`);
};

// A URL naming no language must land on the one address it has, and must
// never be talked into leaving the site on the way — an open redirect on a
// police domain is a phishing gift.
for (const [from, expect] of [
  ["/", "/en"],
  ["/app/services", "/en/app/services"],
  ["//evil.example.com", null],
  ["/app/services?q=x", "/en/app/services?q=x"],
]) {
  const res = await fetch(BASE + from, {
    redirect: "manual",
    headers: { "accept-language": "en" },
  });
  const location = res.headers.get("location");
  if (!location) {
    if (expect) fail(`${from} should redirect, got ${res.status}`);
    continue;
  }
  const target = new URL(location, BASE);
  if (target.origin !== new URL(BASE).origin)
    fail(`${from} redirected off-site to ${location}`);
  else if (expect && target.pathname + target.search !== expect)
    fail(`${from} should go to ${expect}, went to ${target.pathname}`);
}

// A prefixed address serves the page itself rather than bouncing again.
for (const lang of ["en", "ha"]) {
  const res = await fetch(`${BASE}/${lang}/app/services`, {
    redirect: "manual",
  });
  if (res.status !== 200) fail(`/${lang}/app/services should serve, got ${res.status}`);
}

// The switcher has to offer the other language, as a real link, so it works
// before hydration and gives the reader an address to copy.
for (const [lang, offers] of [
  ["en", "ha"],
  ["ha", "en"],
]) {
  const html = await (await fetch(`${BASE}/${lang}/app/services`)).text();
  if (!html.includes(`href="/${offers}/app/services"`))
    fail(`the ${lang} page should link to /${offers}/app/services`);
}

// Each page must name both of its addresses, or a crawler never learns the
// other language exists.
for (const lang of ["en", "ha"]) {
  const html = await (await fetch(`${BASE}/${lang}/app/services`)).text();
  for (const other of ["en", "ha"])
    if (!new RegExp(`hreflang="${other}"[^>]*/${other}/app/services`, "i").test(html))
      fail(`the ${lang} page is missing its ${other} hreflang`);
  if (!new RegExp(`rel="canonical"[^>]*/${lang}/app/services`).test(html))
    fail(`the ${lang} page is missing its canonical`);
}

console.log(
  bad
    ? `\n${bad} problem(s) need attention`
    : "\nall routes ok in both languages",
);
process.exit(bad ? 1 : 0);
