import { headers } from "next/headers";
import type { Service } from "../content-services";

/**
 * schema.org JSON-LD. Without it a search engine sees a page of text; with it
 * a service can be shown as a service — who provides it, what it costs, who it
 * is for — which for a government site is the difference between a blue link
 * and an answer.
 *
 * Emitted as a <script type="application/ld+json"> from a server component,
 * carrying the request's nonce. A JSON-LD block is data rather than code, but
 * browsers enforce script-src on the element all the same, and under
 * 'strict-dynamic' an unnonced <script> is simply refused — the first version
 * of this file left it off and every page logged a CSP violation.
 *
 * The content is serialised with JSON.stringify and the closing-tag sequence
 * escaped below, so nothing in the data can end the block early.
 */

const BASE = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dubaipolice.gov.ae"
).replace(/\/$/, "");

/**
 * `</script>` inside a JSON string would close the block early and hand the
 * rest of the document to the parser as markup. Escaping the angle bracket
 * keeps the JSON identical and the tag intact.
 */
const serialise = (data: unknown) =>
  JSON.stringify(data).replace(/</g, "\\u003c");

async function Ld({ data }: { data: unknown }) {
  // proxy.ts sets this on the request; Next reads the same value out of the
  // CSP header for its own scripts.
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: serialise(data) }}
    />
  );
}

/** The force itself, on every page, so the knowledge panel has something to use. */
export async function OrganisationLd({ lang }: { lang: string }) {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": "GovernmentOrganization",
        name: lang === "ar" ? "شرطة دبي" : "Dubai Police",
        url: BASE,
        logo: `${BASE}/img/logo-dubai-police.svg`,
        areaServed: { "@type": "City", name: "Dubai" },
        parentOrganization: {
          "@type": "GovernmentOrganization",
          name: "Government of Dubai",
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+971-999",
            contactType: "emergency",
            areaServed: "AE",
          },
          {
            "@type": "ContactPoint",
            telephone: "+971-901",
            contactType: "customer service",
            areaServed: "AE",
            availableLanguage: ["en", "ar"],
          },
        ],
      }}
    />
  );
}

/** One service, with its fee and its audience. */
export async function ServiceLd({ service }: { service: Service }) {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": "GovernmentService",
        name: service.name,
        description: service.description || undefined,
        url: `${BASE}/app/services/${service.slug}`,
        serviceType: service.category || undefined,
        provider: {
          "@type": "GovernmentOrganization",
          name: "Dubai Police",
          url: BASE,
        },
        areaServed: { "@type": "City", name: "Dubai" },
        audience: service.audiences?.length
          ? service.audiences.map((a) => ({ "@type": "Audience", audienceType: a }))
          : undefined,
        // feeSummary is prose — "Free of Charge", "AED 100 per copy" — so it
        // goes in as a description rather than a number that would be wrong.
        offers: service.feeSummary
          ? { "@type": "Offer", description: service.feeSummary }
          : undefined,
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: `${BASE}/app/services/${service.slug}`,
        },
      }}
    />
  );
}

/** Breadcrumbs, so a result shows the path rather than a bare URL. */
export async function BreadcrumbLd({
  trail,
}: {
  trail: { name: string; href: string }[];
}) {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: BASE + item.href,
        })),
      }}
    />
  );
}
