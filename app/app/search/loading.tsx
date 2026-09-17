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
    >
      <section className="bg-white pb-24" aria-busy="true" aria-live="polite">
        <div className="npf-container">
          <span className="sr-only">{t("Searching…")}</span>
          <div className="h-[68px] max-w-[680px] animate-pulse rounded-2xl bg-[#F4F6FA]" />
          <ul className="mt-8 max-w-[80ch] divide-y divide-black/10">
            {[0, 1, 2, 3, 4].map((i) => (
              <li key={i} className="py-5">
                <div className="h-3 w-24 animate-pulse rounded bg-black/[0.06]" />
                <div className="mt-2 h-5 w-2/3 animate-pulse rounded bg-black/[0.08]" />
                <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-black/[0.05]" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
