"use client";

import Link from "../i18n/Link";
import { usePathname } from "next/navigation";
import { stripLocale } from "../i18n/path";
import { useRouter } from "../i18n/Link";
import { useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { resetDemo, signOut, useStore } from "./store";
import { useT } from "../i18n/client";
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
export default function PortalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useT();
  const router = useRouter();
  // Same locale-prefix trap as the console: strip it before comparing, or
  // no tab is ever current once the browser takes over.
  const path = stripLocale(usePathname()).rest;
  const { session, requests, fines, loaded } = useStore();

  // An officer account has no citizen record behind it — no fines, no
  // documents, no requests of their own — so landing here is a misrouted link
  // rather than a permissions wall, and the console is where they meant to go.
  const citizen = session?.role === "citizen";

  useEffect(() => {
    if (!loaded) return;
    if (!session)
      router.replace(`/app/signin?next=${encodeURIComponent(path)}`);
    else if (!citizen) router.replace("/app/police");
  }, [loaded, session, citizen, router, path]);

  const counts: Record<string, number> = {
    "/app/portal/requests": requests.filter(
      (r) => r.status !== "Completed" && r.status !== "Rejected",
    ).length,
    "/app/portal/fines": fines.filter((f) => !f.paid).length,
  };

  return (
    <>
      <Header solid />
      <main
        id="main-content"
        tabIndex={-1}
        className="border-b border-npf-hairline outline-none"
      >
        <div className="relative min-h-[60vh] overflow-hidden bg-white pt-32 pb-(--npf-section-y) md:pt-40">
          {/* The same morning light every inner page opens under. */}
          <div className="pointer-events-none absolute top-0 end-0 h-80 w-56 translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(#3c78bd66_7%,#22599e33_40%,#22599e00_70%)] opacity-70 [mask-image:linear-gradient(to_bottom,#000_65%,transparent_90%)] md:size-250 md:opacity-60" />
          <div className="npf-container relative">
            {!loaded || !session || !citizen ? (
              <Loading />
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-6">
                  <div className="flex min-w-0 items-center gap-4 md:gap-5">
                    <span
                      aria-hidden
                      className="grid size-14 shrink-0 place-items-center rounded-full bg-npf-blue font-secondary text-lg font-bold text-white shadow-card md:size-18 md:text-2xl"
                    >
                      {session.name
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <div className="min-w-0">
                      <p className="npf-small text-npf-steel">
                        {t("Signed in as")}
                      </p>
                      <h1 className="npf-h2 text-npf-blue-deep">
                        {t(session.name)}
                      </h1>
                      <p className="npf-small mt-1 text-npf-body tabular-nums">
                        {t("NIN {id}", { id: session.nin })}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href="/app/services"
                      className="npf-btn npf-btn-primary"
                    >
                      <PlusIcon aria-hidden className="size-4.5" />
                      {t("New request")}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        signOut();
                        router.push("/app/home");
                      }}
                      className="npf-btn npf-btn-secondary"
                    >
                      <SignOutIcon aria-hidden className="size-4.5" />
                      {t("Sign out")}
                    </button>
                  </div>
                </div>

                <p className="npf-small mt-8 flex items-start gap-3 rounded-card bg-npf-gold-wash px-5 py-3.5 text-npf-warn md:items-center">
                  <AlertIcon
                    aria-hidden
                    className="size-4.5 shrink-0 max-md:mt-0.5"
                  />
                  <span>
                    {t(
                      "Sample account. The requests, fines and documents below are illustrative and live only in this browser.",
                    )}{" "}
                    <button
                      type="button"
                      onClick={resetDemo}
                      className="font-semibold underline underline-offset-2 hover:no-underline"
                    >
                      {t("Reset the demo data")}
                    </button>
                    .
                  </span>
                </p>

                <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
                  <nav
                    aria-label={t("Account")}
                    className="lg:sticky lg:top-28 lg:self-start"
                  >
                    {/* A phone scrolls the tabs as chips; a desktop stacks
                        them in one ruled panel, like the service rail. */}
                    <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:block lg:divide-y lg:divide-npf-hairline lg:overflow-hidden lg:rounded-card lg:border lg:border-npf-hairline lg:p-0">
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
                              className={`group flex min-h-11 items-center gap-3 rounded-full ps-2 pe-4 text-sm font-medium whitespace-nowrap ring-1 transition-colors ring-inset lg:min-h-14 lg:rounded-none lg:px-4 lg:ring-0 ${
                                active
                                  ? "bg-npf-blue text-white ring-npf-blue lg:bg-npf-mist lg:text-npf-blue-deep"
                                  : "text-npf-ink ring-npf-hairline hover:bg-npf-paper"
                              }`}
                            >
                              <span
                                className={`grid size-8 shrink-0 place-items-center rounded-full transition-colors lg:size-9 ${
                                  active
                                    ? "bg-white/15 lg:bg-npf-blue lg:text-white"
                                    : "bg-npf-cloud text-npf-blue-ink group-hover:bg-npf-chip"
                                }`}
                              >
                                <Icon className="size-4.5" />
                              </span>
                              {t(label)}
                              {counts[href] ? (
                                <span
                                  className={`ms-auto grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-xs font-semibold tabular-nums ${
                                    active
                                      ? "bg-white/20 text-white lg:bg-npf-blue"
                                      : "bg-npf-cloud text-npf-blue-ink lg:bg-npf-blue lg:text-white"
                                  }`}
                                >
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
  const t = useT();
  return (
    <div aria-hidden className="animate-pulse">
      <div className="flex items-center gap-5">
        <div className="size-14 rounded-full bg-npf-cloud-deep md:size-18" />
        <div>
          <div className="h-4 w-24 rounded-chip bg-npf-cloud-deep" />
          <div className="mt-3 h-10 w-72 max-w-[60vw] rounded-chip bg-npf-cloud-deep" />
        </div>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr] lg:gap-12">
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 rounded-chip bg-npf-cloud" />
          ))}
        </div>
        <div className="h-64 rounded-card bg-npf-cloud" />
      </div>
      <span className="sr-only">{t("Loading your account")}</span>
    </div>
  );
}
