/**
 * Writes app/content-services.ts — the full Dubai Police service catalogue,
 * pulled live from the site's own CMS. Run from the repo root and commit what
 * it produces:
 *   node scripts/gen-services.mjs
 *   npx prettier@3 --write app/content-services.ts
 *   node scripts/fetch-assets.mjs scripts/service-images.txt
 *
 * The prettier line is not optional. This file writes JSON.stringify output —
 * quoted keys, different wrapping — so skipping it turns a four-line fee
 * change into a seven-thousand-line diff that hides it.
 *
 * The catalogue is one POST away, but every service's detail sits in a
 * `dPServiceOptions` array of differently-shaped components, and the booleans
 * that describe audiences and channels are spread flat across those objects.
 * Flattening happens here so the pages can render plain arrays.
 */
import fs from "node:fs";

const BASE = "https://www.dubaipolice.gov.ae";
const images = new Set();

async function cms(path, params = {}) {
  const res = await fetch(`${BASE}/dpcms/api/${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ mode: "dp", locale: "en", ...params }),
  });
  if (!res.ok) throw new Error(`${path} — HTTP ${res.status}`);
  return (await res.json()).data;
}

function asset(url) {
  if (!url) return null;
  const clean = url.replace(/^\/cmsUploads\//, "");
  if (clean === url) return url;
  images.add(clean);
  return "/cms/" + clean;
}

const text = (s, n = 600) => {
  if (!s) return "";
  const flat = String(s).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return flat.length > n ? flat.slice(0, n).replace(/\s+\S*$/, "") + "…" : flat;
};

const label = (v) =>
  String(v ?? "")
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z0-9])/g, "$1 $2")
    .split(/ +/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

/** Field names label() cannot rescue; two of them are misspelt in the CMS. */
const renamed = {
  dubaipoliceEmail: "Email",
  dubaiPoliceLiveCaht: "Live Chat",
  callCenter901: "Call Centre 901",
  poBox: "P.O. Box",
  sps: "Smart Police Stations",
  nonIslamicHousesOfworship_churches: "Non-Islamic Houses of Worship",
  personnelOfantiDrugAgencies: "Anti-Drug Agency Personnel",
  applePay: "Apple Pay",
  dubaiNow: "DubaiNow",
  walkinMachine: "Walk-in Machine",
  drivethruMachine: "Drive-thru Machine",
};

const flagsOn = (obj, skip = ["id", "__component", "description", "others"]) =>
  Object.entries(obj ?? {})
    .filter(([k, v]) => v === true && !skip.includes(k))
    .map(([k]) => renamed[k] ?? label(k));

/** "1 Months" reads wrong; the CMS always stores the plural noun. */
const plural = (n, noun) =>
  Number(n) === 1 ? `${n} ${noun.replace(/s$/, "")}` : `${n} ${noun}`;

const slugify = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * The slug inside a CMS service URL, or null. Some rows point at an absolute
 * URL on another Dubai Police host (the SRS portal, for one); taking the tail
 * of those produced a "slug" containing "https://", which is not a route.
 */
const internalSlug = (url) => {
  const match = /^\/services\/([A-Za-z0-9-]+)\/?$/.exec(url ?? "");
  return match ? match[1].toLowerCase() : null;
};

const [categories, services] = await Promise.all([
  cms("service-categories", { pagination_pageSize: 100 }),
  cms("dp-services", { pagination_pageSize: 300 }),
]);

/** The category link only travels one way, so build the reverse map once. */
const categoryOf = new Map();
for (const c of categories)
  for (const s of c.dp_services ?? []) categoryOf.set(s.id, c.name);

const opt = (service, name) =>
  (service.dPServiceOptions ?? []).find(
    (o) => o.__component === `dp-service-options.${name}`,
  ) ?? {};

const AUDIENCES = [
  ["individual", "Individuals"],
  ["visitor", "Visitors"],
  ["business", "Business"],
  ["student", "Students"],
];

const seen = new Set();

const catalogue = services
  .filter((s) => s.name?.trim())
  .map((s) => {
    const fees = opt(s, "service-fees");
    const period = opt(s, "period-of-service");
    const hours = opt(s, "working-hours");

    // Two services share a name, 27 ship no URL at all, and a handful point at
    // an absolute URL on another Dubai Police host. A stable unique slug is
    // what the detail route is keyed on, so it is derived here rather than
    // recomputed (and collided) at render time.
    let slug = internalSlug(s.url) ?? slugify(s.name);
    if (seen.has(slug)) slug = `${slug}-${s.serviceKey ?? s.id}`;
    seen.add(slug);

    // Fee values arrive inconsistently: "800", "AED 100", "100 AED". Take the
    // first number so the total is arithmetic rather than string
    // concatenation, and re-format the row only when that number is the whole
    // of it. One row reads "AED 300 or $ 88" — stripping every non-digit from
    // that produced 30088, which summed into a 30,508 dirham clearance
    // certificate on the catalogue. A row that carries more than its own
    // number keeps its own words.
    const feeOptions = (fees.options ?? [])
      .filter((f) => f.label && f.value)
      .map((f) => {
        const raw = String(f.value).trim();
        const amount = Number(/\d+(?:\.\d+)?/.exec(raw)?.[0]);
        const ok = Number.isFinite(amount) && amount > 0;
        const plain = ok && raw.replace(/aed|[^\d.]/gi, "") === String(amount);
        return {
          label: f.label.trim().replace(/\s+/g, " "),
          value: plain ? `AED ${amount}` : raw,
          amount: ok ? amount : 0,
        };
      });

    /**
     * Not every row is something everyone pays, so the summary is not the sum
     * of all of them.
     *
     * The knowledge and innovation dirhams are statutory and always due. A row
     * whose label says "additional" or "if" is conditional, so it is left out.
     * Whatever is left is the service's own fee — and where there is more than
     * one of those they are alternatives, not additions: a clearance
     * certificate costs a citizen 100 or a resident 200, never 300. The
     * cheapest one is the floor, which is why the answer is a "from".
     */
    const dirhams = feeOptions.filter((f) =>
      /knowledge|innovation/i.test(f.label),
    );
    const base = feeOptions.filter(
      (f) => !dirhams.includes(f) && !/\badditional\b|\bif\b/i.test(f.label),
    );
    const feeTotal =
      dirhams.reduce((sum, f) => sum + f.amount, 0) +
      (base.length ? Math.min(...base.map((f) => f.amount)) : 0);
    // "From" the moment a cheaper tier was chosen or a conditional row dropped.
    const feeFrom =
      base.length > 1 || base.length + dirhams.length < feeOptions.length;

    return {
      slug,
      name: s.name.trim(),
      action: (s.action || "Start Service").trim(),
      // Only 22 of the 92 are filed under a bundle in the CMS. The rest are
      // genuinely uncategorised upstream, so this stays null rather than
      // inventing a home for them.
      category: categoryOf.get(s.id) ?? s.service_category?.name ?? null,
      icon: asset(s.image?.url),
      // One description is written in markdown; the bullets read fine inline
      // but the bold markers do not. Delivery keeps its markers — the page
      // splits on them.
      description: text(opt(s, "description").text).split("**").join(""),
      audiences: AUDIENCES.filter(([key]) => s[key]).map(([, name]) => name),
      mostUsed: Boolean(s.mostUsed),
      // The CMS drives a signed-in landing grid off this; 1-based, sparse.
      dashboardOrder: s.dashboardOrder ?? null,
      uaePassOnly: Boolean(s.uaePassLogin),

      fees: feeOptions.map(({ label, value }) => ({ label, value })),
      // "Free of Charge" is not a row in the CMS — it is the absence of rows.
      feeSummary:
        feeTotal > 0
          ? `${feeFrom ? "From " : ""}AED ${feeTotal}`
          : "Free of Charge",
      payment: flagsOn(opt(s, "payment-methods"), [
        "id",
        "__component",
        "description",
        "others",
        "optional",
      ]),

      documents: (opt(s, "required-documents").requiredDocumentOptions ?? [])
        .filter((d) => d.label)
        .map((d) => ({
          label: d.label.trim().replace(/:$/, ""),
          items: (d.subKeys ?? []).map((k) => k.value).filter(Boolean),
        })),

      beneficiaries: flagsOn(opt(s, "beneficiaries")),
      channels: flagsOn(opt(s, "service-channels")),
      delivery: text(opt(s, "delivery-channels").text, 800),

      hours: [
        ["Digital Channels", hours.digitalChannels],
        ["Smart Police Stations", hours.sps],
        ["Police Stations", hours.policeStations],
        ["Other", hours.others],
      ]
        .filter(([, v]) => v)
        .map(([k, v]) => ({ label: k, value: text(v, 120) })),

      contacts: flagsOn(opt(s, "contact-details")),
      // "1 Months" / "1 Working Days" come straight out of the CMS.
      turnaround: period.validity
        ? plural(period.validity, label(period.timing))
        : label(period.timing) || "Instant",

      terms: (opt(s, "terms-and-conditions").options ?? [])
        .map((t) => t.label?.trim())
        .filter(Boolean),

      // Only sub-services that are themselves pages here; an off-site link
      // dressed as a related service would 404 on this host.
      related: (s.sub_services ?? [])
        .map((sub) => ({ name: sub.name?.trim(), slug: internalSlug(sub.url) }))
        .filter((sub) => sub.name && sub.slug),
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const banner = `/**
 * Generated by scripts/gen-services.mjs from the site's own CMS.
 * Edit the generator, not this file.
 */

export type Service = {
  slug: string;
  name: string;
  action: string;
  category: string | null;
  icon: string | null;
  description: string;
  audiences: string[];
  mostUsed: boolean;
  dashboardOrder: number | null;
  uaePassOnly: boolean;
  fees: { label: string; value: string }[];
  feeSummary: string;
  payment: string[];
  documents: { label: string; items: string[] }[];
  beneficiaries: string[];
  channels: string[];
  delivery: string;
  hours: { label: string; value: string }[];
  contacts: string[];
  turnaround: string;
  terms: string[];
  related: { name: string; slug: string }[];
};

`;

fs.writeFileSync(
  "app/content-services.ts",
  banner +
    `export const services: Service[] = ${JSON.stringify(catalogue, null, 2)};\n\n` +
    `export const serviceCategoryNames = ${JSON.stringify(
      categories.sort((a, b) => (a.order ?? 99) - (b.order ?? 99)).map((c) => c.name),
      null,
      2,
    )};\n`,
);

fs.writeFileSync(
  "scripts/service-images.txt",
  [...images].map((f) => `/dpcms/cmsUploads/${f}\tcms/${f}`).join("\n") + "\n",
);

console.log(
  "services:", catalogue.length,
  "with icons:", catalogue.filter((s) => s.icon).length,
  "with docs:", catalogue.filter((s) => s.documents.length).length,
  "categorised:", catalogue.filter((s) => s.category).length,
  "dashboard:", catalogue.filter((s) => s.dashboardOrder).length,
  "images:", images.size,
);
