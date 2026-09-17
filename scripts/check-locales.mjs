/**
 * Walks every route in both languages against a running server and reports
 * anything that would show a reader the wrong language. Needs `npm run dev`
 * (or `next start`) up, so it is not part of `npm test`. Start that server
 * with API_URL set, or app/backend.ts will 404 sign-in, the portal and the
 * console and the sweep will report fourteen routes it cannot reach:
 *   node scripts/check-locales.mjs [baseUrl]
 *
 * It reports:
 *  - the html lang/dir attributes
 *  - visible English left on an Arabic page (text nodes with Latin letters)
 *  - any 4xx/5xx
 */
const BASE = process.argv[2] ?? "http://localhost:3111";

const ROUTES = [
  "/",
  "/app/home/contactUs",
  "/app/home/customer-centers",
  "/app/home/customer-service-agreement",
  "/app/home/information",
  "/app/home/information/laws-legislation",
  "/app/home/information/street-speed-limits",
  "/app/home/information/view-black-points-traffic-violations",
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

// Words that legitimately stay Latin on an Arabic page.
const ALLOWED = [
  "English",
  "UAE PASS",
  "Dubai Police",
  "SSL",
  "IP",
  "PIN",
  "SPS",
  "AED",
  "IBAN",
  "www.dubaipolice.gov.ae",
  "mail@dubaipolice.gov.ae",
  "GITEX",
  "SWAT",
  "e&",
  "SK",
  "P1",
  "P2",
  "P3",
  "P4",
  "GST",
  "QR",
  "TOEFL",
  "IELTS",
  "EMSAT",
  "RTA",
  "DECCA",
  "ICOM",
  "IDEX",
  "NAVDEX",
  "WETEX",
  "ATM",
  "Etisalat",
  "Rabdan",
  "PhD",
  "CID",
  "OCEC",
  "GDRFA",
  "YGPLP",
  "PIL",
  "D3",
];

const stripTags = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, "\n");

let bad = 0;
for (const route of ROUTES) {
  for (const lang of ["en", "ar"]) {
    // Locale is the first path segment now, not a cookie, so the address
    // itself is what is being checked.
    const url = BASE + (route === "/" ? `/${lang}` : `/${lang}${route}`);
    const res = await fetch(url, { redirect: "follow" });
    const html = await res.text();
    const ok =
      res.status === 200 || (route === "/no-such-page" && res.status === 404);
    const m = html.match(/<html[^>]*lang="([a-z]+)"[^>]*dir="([a-z]+)"/);
    const dirOk =
      m && m[1] === lang && m[2] === (lang === "ar" ? "rtl" : "ltr");

    let leaks = [];
    if (lang === "ar") {
      const text = stripTags(html);
      for (const line of text.split("\n")) {
        const v = line.trim();
        if (v.length < 4 || !/[A-Za-z]{4}/.test(v)) continue;
        if (/[؀-ۿ]/.test(v)) continue; // mixed line, fine
        if (ALLOWED.some((a) => v.includes(a))) continue;
        if (/^[\w.-]+@|^https?:|^\/|^[a-z-]+$/.test(v)) continue;
        leaks.push(v.slice(0, 90));
      }
      leaks = [...new Set(leaks)];
    }

    if (!ok || !dirOk || leaks.length) {
      bad++;
      console.log(
        `\n✗ ${lang} ${route}  status=${res.status} lang/dir=${m ? m[1] + "/" + m[2] : "?"}`,
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
for (const lang of ["en", "ar"]) {
  const res = await fetch(`${BASE}/${lang}/app/services`, {
    redirect: "manual",
  });
  if (res.status !== 200) fail(`/${lang}/app/services should serve, got ${res.status}`);
}

// The switcher has to offer the other language, as a real link, so it works
// before hydration and gives the reader an address to copy.
for (const [lang, offers] of [
  ["en", "ar"],
  ["ar", "en"],
]) {
  const html = await (await fetch(`${BASE}/${lang}/app/services`)).text();
  if (!html.includes(`href="/${offers}/app/services"`))
    fail(`the ${lang} page should link to /${offers}/app/services`);
}

// Each page must name both of its addresses, or a crawler never learns the
// other language exists.
for (const lang of ["en", "ar"]) {
  const html = await (await fetch(`${BASE}/${lang}/app/services`)).text();
  for (const other of ["en", "ar"])
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
