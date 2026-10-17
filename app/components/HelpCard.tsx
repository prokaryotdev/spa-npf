import Link from "../i18n/Link";
import { ArrowRight } from "./icons";

export type HelpRow = {
  Icon: (props: { className?: string }) => React.ReactNode;
  label: string;
  /** Who answers, or the address itself: the line under the action. */
  note?: string;
  href: string;
};

/**
 * The help card every rail ends with. Help is not the page's action, so it
 * does not borrow the action card's buttons: each way to reach us is a row,
 * drawn like "How you receive it", with the whole row as the target and the
 * number or address in plain sight before anyone presses.
 */
export function HelpCard({
  title,
  intro,
  rows,
  className = "",
}: {
  title: string;
  intro?: string;
  rows: HelpRow[];
  className?: string;
}) {
  return (
    <section
      aria-label={title}
      className={`overflow-hidden rounded-card bg-white shadow-card ring-1 ring-npf-hairline ring-inset ${className}`}
    >
      <div className="px-5 pt-5 pb-4">
        <h2 className="npf-h5 text-npf-blue-deep">{title}</h2>
        {intro ? <p className="npf-small mt-1 text-npf-body">{intro}</p> : null}
      </div>
      {rows.length ? (
        <ul className="divide-y divide-npf-hairline border-t border-npf-hairline">
          {rows.map((row) => {
            const body = (
              <>
                <span className="npf-disc">
                  <row.Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="npf-body block truncate font-medium text-npf-ink tabular-nums transition-colors group-hover:text-npf-blue">
                    {row.label}
                  </span>
                  {row.note ? (
                    <span className="npf-small block truncate text-npf-steel">
                      {row.note}
                    </span>
                  ) : null}
                </span>
                <ArrowRight className="npf-go" />
              </>
            );
            const cls =
              "npf-row-link group flex items-center gap-4 px-5 py-4 focus-visible:-outline-offset-2 active:bg-npf-cloud";
            return (
              <li key={row.href}>
                {/^(tel|mailto):/.test(row.href) ? (
                  <a href={row.href} className={cls}>
                    {body}
                  </a>
                ) : (
                  <Link href={row.href} className={cls}>
                    {body}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}

