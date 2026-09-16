import { PageShell } from "../../components/PageShell";

/**
 * Search is the one route rendered on demand, so it is the one route that can
 * show a gap. The skeleton mirrors the real layout: search box, then results.
 */
export default function SearchLoading() {
  return (
    <PageShell
      title="Search"
      intro="Find a service, a news story, an event or a page."
    >
      <section className="bg-white pb-24" aria-busy="true" aria-live="polite">
        <div className="dp-container">
          <span className="sr-only">Searching…</span>
          <div className="h-[68px] max-w-[680px] animate-pulse rounded-2xl bg-[#F4F8F6]" />
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
