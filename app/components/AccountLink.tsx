"use client";

import Link from "../i18n/Link";
import { useStore } from "./store";
import { UserCircle } from "./icons";
import { useT } from "../i18n/client";

/**
 * The header's account control. Signed out it says Sign In; signed in it
 * carries the first name and points at whichever side of the app the account
 * belongs to.
 */
export default function AccountLink({
  onNavigate,
  block = false,
  onDark = false,
}: {
  onNavigate?: () => void;
  /** The drawer wants a full-width button, the nav bar a pill. */
  block?: boolean;
  /** Over the hero photo Force blue sinks into the dark; white holds. */
  onDark?: boolean;
}) {
  const t = useT();
  const { session, loaded } = useStore();

  const className = `${
    block ? "w-full justify-center px-5 py-3" : "h-11 ps-4 pe-5 text-sm"
  } inline-flex shrink-0 items-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,color,scale] active:scale-[0.97] active:duration-(--dur-press) ${
    onDark
      ? "bg-white text-npf-blue-deep hover:bg-npf-mist focus-visible:outline-white"
      : "bg-npf-blue text-white hover:bg-npf-blue-deep"
  }`;

  if (!loaded || !session)
    return (
      <Link href="/app/signin" onClick={onNavigate} className={className}>
        <UserCircle className="size-4.5 shrink-0" />
        {t("Sign In")}
      </Link>
    );

  // The Hausa name has its own word order, so take the first word of
  // whichever name is on screen.
  const first = t(session.name).split(" ")[0];

  return (
    <Link
      href={session.role === "officer" ? "/app/police" : "/app/portal"}
      onClick={onNavigate}
      className={className}
    >
      <UserCircle className="size-4.5 shrink-0" />
      {session.role === "officer" ? t("Console") : first}
    </Link>
  );
}
