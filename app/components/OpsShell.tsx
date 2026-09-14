"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut, useStore } from "./store";
import {
  AlertIcon,
  ArrowUpRight,
  InboxIcon,
  LayersIcon,
  RadioIcon,
  ShieldIcon,
  SignOutIcon,
} from "./icons";

const TABS = [
  { href: "/app/police", label: "Overview", Icon: RadioIcon },
  { href: "/app/police/incidents", label: "Incidents", Icon: AlertIcon },
  { href: "/app/police/requests", label: "Service requests", Icon: InboxIcon },
];

/**
 * The console frame: guard, rail, shift strip.
 *
 * It deliberately does not use the site's Header and Footer. This is an
 * internal tool, not a page of the website — the navigation an officer needs
 * is three queues and a way out, and a marketing footer under a live incident
 * list would be noise.
 */
export default function OpsShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const { session, incidents, requests, loaded } = useStore();

  const officer = session?.role === "officer";

  useEffect(() => {
    if (!loaded) return;
    if (!session)
      router.replace(`/app/signin?next=${encodeURIComponent(path)}`);
  }, [loaded, session, router, path]);

  const counts: Record<string, number> = {
    "/app/police/incidents": incidents.filter((i) => i.status !== "Closed")
      .length,
    "/app/police/requests": requests.filter(
      (r) => r.status !== "Completed" && r.status !== "Rejected",
    ).length,
  };

  if (!loaded || !session)
    return (
      <div className="dp-ops grid min-h-[100dvh] place-items-center">
        <p className="text-sm text-[var(--ops-dim)]">Checking credentials…</p>
      </div>
    );

  if (!officer)
    return (
      <div className="dp-ops grid min-h-[100dvh] place-items-center px-6">
        <div className="max-w-[46ch] text-center">
          <ShieldIcon aria-hidden className="mx-auto size-10 text-[var(--ops-accent)]" />
          <h1 className="mt-4 font-secondary text-2xl font-bold">
            Force credentials required
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ops-dim)]">
            You are signed in as {session.name}, a public account. The
            operations console is for Dubai Police personnel.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/app/portal"
              className="rounded-full bg-[var(--ops-accent)] px-5 py-2.5 text-sm font-medium text-[#062018] transition-opacity hover:opacity-90"
            >
              Go to my account
            </Link>
            <button
              type="button"
              onClick={() => {
                signOut();
                router.push("/app/signin?next=/app/police");
              }}
              className="rounded-full px-5 py-2.5 text-sm font-medium ring-1 ring-[var(--ops-line)] transition-colors hover:bg-[var(--ops-raised)]"
            >
              Sign in as an officer
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="dp-ops min-h-[100dvh] lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="flex flex-col border-b border-[var(--ops-line)] lg:sticky lg:top-0 lg:h-[100dvh] lg:border-r lg:border-b-0">
        <div className="flex items-center gap-3 px-5 py-5">
          <span
            role="img"
            aria-label="Dubai Police"
            className="dp-logo dp-logo-police h-8 w-24 text-[var(--ops-text)]"
          />
          <span className="border-l border-[var(--ops-line)] pl-3 text-xs leading-tight tracking-[0.14em] text-[var(--ops-dim)] uppercase">
            Ops
            <br />
            Console
          </span>
        </div>

        <nav aria-label="Console" className="px-3">
          <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {TABS.map(({ href, label, Icon }) => {
              const active =
                href === "/app/police" ? path === href : path.startsWith(href);
              return (
                <li key={href} className="shrink-0">
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm whitespace-nowrap transition-colors ${
                      active
                        ? "bg-[var(--ops-raised)] font-medium text-[var(--ops-text)]"
                        : "text-[var(--ops-dim)] hover:bg-[var(--ops-panel)] hover:text-[var(--ops-text)]"
                    }`}
                  >
                    <Icon className="size-[18px] shrink-0" />
                    {label}
                    {counts[href] ? (
                      <span className="ml-auto rounded-full bg-[var(--ops-accent)] px-1.5 py-0.5 text-[11px] font-bold text-[#062018] tabular-nums">
                        {counts[href]}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Shown at every width: below lg the rail is a horizontal strip, and
            hiding this took the only way out of the console with it. */}
        <div className="mt-auto border-t border-[var(--ops-line)] px-5 py-4">
          <p className="flex items-center gap-2 text-sm font-medium">
            <LayersIcon aria-hidden className="size-4 text-[var(--ops-accent)]" />
            {session.name}
          </p>
          <p className="mt-1 text-xs text-[var(--ops-dim)]">
            {session.rank} · {session.station}
          </p>
          <div className="mt-4 flex flex-col gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                signOut();
                router.push("/app/home");
              }}
              className="inline-flex items-center gap-2 text-[var(--ops-dim)] transition-colors hover:text-[var(--ops-text)]"
            >
              <SignOutIcon className="size-4" />
              End shift
            </button>
            <Link
              href="/app/home"
              className="inline-flex items-center gap-2 text-[var(--ops-dim)] transition-colors hover:text-[var(--ops-text)]"
            >
              <ArrowUpRight className="size-4" />
              Public site
            </Link>
          </div>
        </div>
      </aside>

      <main id="main-content" tabIndex={-1} className="min-w-0 outline-none">
        <p className="flex items-start gap-2 border-b border-[var(--ops-line)] bg-[#2a1f06] px-5 py-2.5 text-xs leading-relaxed text-[#f0d79a]">
          <AlertIcon aria-hidden className="mt-px size-4 shrink-0" />
          Illustrative data. This console is part of a rebuild of the Dubai
          Police website and is not connected to any operational system.
        </p>
        <div className="px-5 py-6 lg:px-8 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
