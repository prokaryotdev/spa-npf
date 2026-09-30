import { PageShell } from "../../components/PageShell";
import { getT } from "../../i18n/server";

/**
 * Search is the one route rendered on demand, so it is the one route that can
 * show a gap. The skeleton mirrors the real layout: search box, then results.
 *
 * It is also the only loading.tsx on the site, and that is not an oversight.
 * Adding a generic one for the other twenty-two routes was tried at the app
 * root and at two segment depths; each placement made Next emit an extra async
 * bootstrap script with no nonce, which strict-dynamic then refused, and the
 * page lost a chunk. This file happens not to, because its route already sits
 * behind a Suspense boundary for useSearchParams. A skeleton is not worth
 * weakening the policy for, so the rest of the site has none until the
 * framework nonces that script.
 */
export default async function SearchLoading() {
  const t = await getT();
  return (
    <PageShell
      title={t("Search")}
      intro={t("Find a service, a news story, an event or a page.")}
      lead={
        <div className="mt-8 h-15 max-w-3xl animate-pulse rounded-full bg-npf-cloud md:mt-10" />
      }
    >
      <section
        className="bg-white pb-(--npf-section-y)"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="npf-container">
          <span className="sr-only">{t("Searching…")}</span>
          <div className="h-6 w-48 animate-pulse rounded-chip bg-npf-cloud" />
          <ul className="mt-5 max-w-3xl divide-y divide-npf-hairline rounded-card border border-npf-hairline">
            {[0, 1, 2, 3, 4].map((i) => (
              <li key={i} className="flex gap-4 px-5 py-5">
                <div className="size-10 shrink-0 animate-pulse rounded-chip bg-npf-cloud" />
                <div className="flex-1">
                  <div className="h-5 w-2/3 animate-pulse rounded-chip bg-npf-cloud-deep" />
                  <div className="mt-2 h-4 w-1/2 animate-pulse rounded-chip bg-npf-cloud" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
