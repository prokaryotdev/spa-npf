/**
 * Writes app/content-footer.ts — the copy behind the pages the footer links to.
 * Everything is pulled live from the site's own APIs, so run it from the repo
 * root and commit what it produces:
 *   node scripts/gen-footer-content.mjs
 *
 * Two quirks of that API: the CMS half only answers POST with flattened
 * "safe params" (filters[a][$b] arrives as filters_a_b), and the initiative
 * half sits on a different base path and wants the lang header.
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

async function dpapp(path) {
  const res = await fetch(`${BASE}/dpapp/${path}`, {
    headers: { accept: "application/json", lang: "en", "Profile-Type-ID": "1" },
  });
  if (!res.ok) throw new Error(`${path} — HTTP ${res.status}`);
  return res.json();
}

/** CMS uploads are mirrored under /cms; site-root art keeps its own path. */
function asset(url) {
  if (!url) return null;
  const clean = url.replace(/^\/cmsUploads\//, "");
  if (clean === url) return url;
  images.add(clean);
  return "/cms/" + clean;
}

const text = (s, n = 400) => {
  if (!s) return "";
  const flat = String(s).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return flat.length > n ? flat.slice(0, n).replace(/\s+\S*$/, "") + "…" : flat;
};

/** "working_days" / "businessSector" → "Working Days" / "Business Sector". */
const label = (v) =>
  String(v ?? "")
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z0-9])/g, "$1 $2")
    .split(/ +/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

/** Two CMS field names label() cannot rescue — one of them is misspelt. */
const renamed = {
  dubaipoliceEmail: "Dubai Police Email",
  dubaiPoliceLiveCaht: "Dubai Police Live Chat",
};

/** Service options arrive as booleans on one flat object; keep the true ones. */
const flagsOn = (obj, skip = ["id", "__component", "description", "others"]) =>
  Object.entries(obj)
    .filter(([k, v]) => v === true && !skip.includes(k))
    .map(([k]) => renamed[k] ?? label(k));

const jsonContent = (rows, key) => rows.find((r) => r.key === key)?.data;

const [contents, centers, categories, services, periods] = await Promise.all([
  cms("json-contents", { pagination_pageSize: 100 }),
  cms("dp-customer-centers", { pagination_pageSize: 100 }),
  cms("service-categories", { pagination_pageSize: 100 }),
  cms("dp-services", { pagination_pageSize: 200 }),
  dpapp("initiative/publishperiods"),
]);

const legal = (key, title) => ({ title, sections: jsonContent(contents, key).sections });

const contact = jsonContent(contents, "contactUsPage");

const leaders = services.find((s) => s.url === "/services/leaders-at-your-service");
const option = (name) =>
  leaders.dPServiceOptions.find((o) => o.__component === `dp-service-options.${name}`) ?? {};

const content = {
  privacyPolicy: legal("privacyPolicy", "Privacy Policy"),
  termsConditions: legal("generalTermsConditions", "Terms & Conditions"),
  customerServiceAgreement: legal(
    "customerServiceAgreement",
    "Customer Service Agreement",
  ),

  contactUs: {
    intro: contact.InnerBannerData?.description ?? "",
    reach: {
      title: contact.reachData.title,
      description: contact.reachData.description,
      lines: contact.reachData.data.map((c) => ({
        number: c.call,
        title: c.title,
        description: c.description,
      })),
      signLanguage: {
        title: contact.reachData.signLang.title,
        subTitle: contact.reachData.signLang.subTitle,
        description: contact.reachData.signLang.description,
      },
    },
    feedback: {
      title: contact.formsData.title,
      subTitle: contact.formsData.subTitle,
      description: contact.formsData.description,
      kinds: contact.formsData.data.map((f) => ({
        title: f.title,
        description: f.description,
        icon: f.icon,
      })),
    },
    leaders: contact.leadersData,
  },

  customerCenters: centers.map((c) => ({
    name: c.name.trim(),
    address: text(c.description, 160),
    about: text(c.html1, 320),
    // The two CMS values; "sps" is the self-service format.
    kind: c.type === "sps" ? "Smart Police Station" : "Police Station",
    timing: /^\s*24/.test(c.timing ?? "") ? "24 hours" : text(c.timing, 40),
    image: asset(c.cardImg?.url),
    map:
      c.latitude && c.longitude
        ? `https://www.google.com/maps/search/?api=1&query=${c.latitude},${c.longitude}`
        : null,
  })),

  serviceCategories: categories
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
    .map((c) => ({
      name: c.name,
      description: c.description ?? "",
      icon: asset(c.defaultImg?.url),
      services: (c.dp_services ?? []).map((s) => ({
        name: s.name,
        url: s.url ?? "",
      })),
    })),

  initiativePeriods: periods
    .filter((p) => p.titleEn)
    .map((p) => ({
      title: p.titleEn,
      details: text(p.detailsEn, 600),
      from: p.startDate,
      to: p.endDate,
    })),

  leadersService: {
    title: leaders.name,
    description: option("description").text ?? "",
    documents: (option("required-documents").requiredDocumentOptions ?? []).map(
      (d) => d.label,
    ),
    beneficiaries: flagsOn(option("beneficiaries")),
    channels: flagsOn(option("service-channels")),
    contacts: flagsOn(option("contact-details")),
    workingHours: option("working-hours").digitalChannels ?? "",
    turnaround: option("period-of-service").validity
      ? `${option("period-of-service").validity} ${label(option("period-of-service").timing)}`
      : "",
  },
};

const banner = `/**
 * Generated by scripts/gen-footer-content.mjs from the site's own APIs.
 * Edit the generator, not this file.
 */\n\n`;

fs.writeFileSync(
  "app/content-footer.ts",
  banner +
    Object.entries(content)
      .map(([k, v]) => `export const ${k} = ${JSON.stringify(v, null, 2)};\n`)
      .join("\n"),
);

fs.writeFileSync(
  "scripts/footer-images.txt",
  [...images].map((f) => `/dpcms/cmsUploads/${f}\tcms/${f}`).join("\n") + "\n",
);

console.log(
  "centers:", content.customerCenters.length,
  "categories:", content.serviceCategories.length,
  "periods:", content.initiativePeriods.length,
  "images:", images.size,
);
