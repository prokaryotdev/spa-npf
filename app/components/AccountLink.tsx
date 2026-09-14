"use client";

import Link from "next/link";
import { useStore } from "./store";
import { UserCircle } from "./icons";

/**
 * The header's account control. Signed out it says Sign In; signed in it
 * carries the first name and points at whichever side of the app the account
 * belongs to.
 */
export default function AccountLink({
  onNavigate,
  block = false,
}: {
  onNavigate?: () => void;
  /** The drawer wants a full-width button, the nav bar a pill. */
  block?: boolean;
}) {
  const { session, loaded } = useStore();

  const shape = block
    ? "w-full justify-center px-5 py-3"
    : "px-5 py-2.5 text-sm";

  if (!loaded || !session)
    return (
      <Link
        href="/app/signin"
        onClick={onNavigate}
        className={`inline-flex items-center gap-2 rounded-full bg-dp-green font-medium whitespace-nowrap text-white transition-colors hover:bg-dp-green-mid ${shape}`}
      >
        Sign In
        <UserCircle className="size-[18px]" />
      </Link>
    );

  const first = session.name.split(" ")[0];

  return (
    <Link
      href={session.role === "officer" ? "/app/police" : "/app/portal"}
      onClick={onNavigate}
      className={`inline-flex items-center gap-2 rounded-full bg-dp-green font-medium whitespace-nowrap text-white transition-colors hover:bg-dp-green-mid ${shape}`}
    >
      <UserCircle className="size-[18px]" />
      {session.role === "officer" ? "Console" : first}
    </Link>
  );
}
