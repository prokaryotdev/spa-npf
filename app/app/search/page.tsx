import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "../../components/PageShell";
import { ArrowUpRight, SearchIcon } from "../../components/icons";
import { search } from "../../search-index";

export const metadata: Metadata = {
  title: "Search | Dubai Police",
  description: "Search Dubai Police services, news, events and information.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const results = search(query);

  return (
    <PageShell
      title="Search"
      intro="Find a service, a news story, an event or a page."
    >
      <section className="bg-white pb-24">
        <div className="dp-container">
          <form
            role="search"
            action="/app/search"
            className="flex max-w-[680px] items-center gap-3 rounded-2xl bg-[#F4F8F6] px-4 ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-dp-green"
          >
            <SearchIcon aria-hidden className="size-6 shrink-0 text-dp-green-ink" />
            <label htmlFor="q" className="sr-only">
              Search Dubai Police
            </label>
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Search for a service, news or page"
              className="w-full flex-grow bg-transparent py-4 text-base text-dp-ink outline-none placeholder:text-dp-muted"
            />
            <button
              type="submit"
              className="my-2 shrink-0 rounded-xl bg-dp-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-dp-green-mid"
            >
              Search
            </button>
          </form>

          {query ? (
            <p aria-live="polite" className="mt-6 text-sm text-dp-muted">
              {results.length} result{results.length === 1 ? "" : "s"} for
              {" “"}
              {query}
              {"”"}
            </p>
          ) : null}

          {query && results.length === 0 ? (
            <p className="mt-8 max-w-[60ch] text-base text-dp-body">
              Nothing matched. Try a shorter term, or browse the{" "}
              <Link
                href="/app/home/sitemap"
                className="font-medium text-dp-green underline underline-offset-2"
              >
                sitemap
              </Link>
              .
            </p>
          ) : null}

          <ul className="mt-8 max-w-[80ch] divide-y divide-black/10">
            {results.map((hit) => (
              <li key={hit.section + hit.title + hit.href}>
                <Link
                  href={hit.href}
                  target={hit.external ? "_blank" : undefined}
                  rel={hit.external ? "noopener noreferrer" : undefined}
                  className="group/hit block py-5"
                >
                  <span className="text-xs font-medium tracking-wide text-dp-muted uppercase">
                    {hit.section}
                  </span>
                  <span className="mt-1 flex items-start gap-1.5 font-secondary text-lg leading-snug font-bold text-dp-ink transition-colors group-hover/hit:text-dp-green">
                    {hit.title}
                    {hit.external ? (
                      <>
                        <ArrowUpRight aria-hidden className="mt-1 size-4 shrink-0" />
                        <span className="sr-only"> (opens in a new window)</span>
                      </>
                    ) : null}
                  </span>
                  {hit.body ? (
                    <span className="mt-1 block text-sm leading-relaxed text-dp-body">
                      {hit.body}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
