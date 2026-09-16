/**
 * Walks every route in both languages against a running server and reports
 * anything that would show a reader the wrong language. Needs `npm run dev`
 * (or `next start`) up, so it is not part of `npm test`:
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
    const res = await fetch(BASE + route, {
      headers: { cookie: `dp-lang=${lang}` },
      redirect: "follow",
    });
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

for (const [route, lang] of [
  ["/ar", "ar"],
  ["/en", "en"],
]) {
  const res = await fetch(BASE + route, { redirect: "manual" });
  if (res.status !== 307) fail(`${route} should redirect, got ${res.status}`);
  if (!new RegExp(`dp-lang=${lang}`).test(res.headers.get("set-cookie") ?? ""))
    fail(`${route} should set dp-lang=${lang}`);
}

// An open redirect on a police domain is a phishing gift: ?to= stays same-site.
const away = await fetch(`${BASE}/ar?to=https://example.com/steal`, {
  redirect: "manual",
});
if (!(away.headers.get("location") ?? "").endsWith("/"))
  fail("/ar?to= must not leave the site");
const deep = await fetch(`${BASE}/ar?to=/app/services`, { redirect: "manual" });
if (!(deep.headers.get("location") ?? "").endsWith("/app/services"))
  fail("/ar?to=/app/services should be honoured");

// The switcher has to offer the other language, and post rather than link, so
// it still works before hydration.
for (const [lang, offers] of [
  ["en", "ar"],
  ["ar", "en"],
]) {
  const html = await (
    await fetch(BASE + "/", { headers: { cookie: `dp-lang=${lang}` } })
  ).text();
  if (!html.includes(`name="lang" value="${offers}"`))
    fail(`the ${lang} page should offer ${offers}`);
  if (!/method="POST"/.test(html)) fail(`the ${lang} switcher should post`);
}

console.log(
  bad
    ? `\n${bad} problem(s) need attention`
    : "\nall routes ok in both languages",
);
process.exit(bad ? 1 : 0);
