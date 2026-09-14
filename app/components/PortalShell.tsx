"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { resetDemo, signOut, useStore } from "./store";
import {
  AlertIcon,
  CardIcon,
  FileIcon,
  InboxIcon,
  PlusIcon,
  ServicesIcon,
  SignOutIcon,
  UserCircle,
} from "./icons";

const TABS = [
  { href: "/app/portal", label: "Overview", Icon: ServicesIcon },
  { href: "/app/portal/requests", label: "My Requests", Icon: InboxIcon },
  { href: "/app/portal/fines", label: "Fines", Icon: CardIcon },
  { href: "/app/portal/documents", label: "Documents", Icon: FileIcon },
  { href: "/app/portal/profile", label: "Profile", Icon: UserCircle },
];

/**
 * The frame around every portal screen: the guard, the rail and the account
 * strip. Screens below it can assume there is a session.
 */
export default function PortalShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const { session, requests, fines, loaded } = useStore();

  useEffect(() => {
    if (loaded && !session)
      router.replace(`/app/signin?next=${encodeURIComponent(path)}`);
  }, [loaded, session, router, path]);

  const counts: Record<string, number> = {
    "/app/portal/requests": requests.filter(
      (r) => r.status !== "Completed" && r.status !== "Rejected",
    ).length,
    "/app/portal/fines": fines.filter((f) => !f.paid).length,
  };

  return (
    <>
      <Header solid />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <div className="min-h-[60vh] bg-white pt-32 pb-24 md:pt-40">
          <div className="dp-container">
            {!loaded || !session ? (
              <Loading />
            ) : (
              <>
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-sm text-dp-muted">Signed in as</p>
                    <h1 className="mt-1 font-secondary text-3xl leading-tight font-bold text-dp-green-deep lg:text-5xl">
                      {session.name}
                    </h1>
                    <p className="mt-2 text-sm text-dp-body">
                      Emirates ID {session.emiratesId}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href="/app/services"
                      className="inline-flex items-center gap-2 rounded-full bg-dp-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-dp-green-mid"
                    >
                      <PlusIcon aria-hidden className="size-4" />
                      New request
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        signOut();
                        router.push("/app/home");
                      }}
                      className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-dp-ink ring-1 ring-black/10 transition-colors hover:bg-black/[0.04]"
                    >
                      <SignOutIcon aria-hidden className="size-4" />
                      Sign out
                    </button>
                  </div>
                </div>

                <p className="mb-8 flex items-start gap-3 rounded-2xl bg-[#FFF7E6] px-5 py-4 text-sm leading-relaxed text-[#6b4a00]">
                  <AlertIcon aria-hidden className="mt-0.5 size-5 shrink-0" />
                  <span>
                    Sample account. The requests, fines and documents below are
                    illustrative and live only in this browser.{" "}
                    <button
                      type="button"
                      onClick={resetDemo}
                      className="font-medium underline underline-offset-2"
                    >
                      Reset the demo data
                    </button>
                    .
                  </span>
                </p>

                <div className="grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-12">
                  <nav aria-label="Account" className="lg:sticky lg:top-28 lg:self-start">
                    <ul className="-mx-1 flex gap-1 overflow-x-auto pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:pb-0">
                      {TABS.map(({ href, label, Icon }) => {
                        const active =
                          href === "/app/portal"
                            ? path === href
                            : path.startsWith(href);
                        return (
                          <li key={href} className="shrink-0">
                            <Link
                              href={href}
                              aria-current={active ? "page" : undefined}
                              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm whitespace-nowrap transition-colors ${
                                active
                                  ? "bg-[#e7f6f1] font-medium text-dp-green-ink"
                                  : "text-dp-body hover:bg-black/[0.04]"
                              }`}
                            >
                              <Icon className="size-[18px] shrink-0" />
                              {label}
                              {counts[href] ? (
                                <span className="ml-auto rounded-full bg-dp-green px-2 py-0.5 text-[11px] font-medium text-white tabular-nums">
                                  {counts[href]}
                                </span>
                              ) : null}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>

                  <div className="min-w-0">{children}</div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

/** Shown while storage is read, and for the blink before the guard redirects. */
function Loading() {
  return (
    <div aria-hidden className="animate-pulse">
      <div className="h-4 w-24 rounded bg-black/[0.06]" />
      <div className="mt-3 h-10 w-72 rounded bg-black/[0.08]" />
      <div className="mt-10 grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-12">
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 rounded-xl bg-black/[0.05]" />
          ))}
        </div>
        <div className="h-64 rounded-3xl bg-black/[0.04]" />
      </div>
      <span className="sr-only">Loading your account</span>
    </div>
  );
}
