/**
 * The client half of error reporting, plus the shaping both halves share.
 *
 * Without this, a crash below the root layout renders a polite apology and
 * then vanishes: `console.error` lives in the visitor's browser and nobody
 * operating the site ever learns it happened. The error boundaries post here
 * instead, and app/api/report-error/route.ts writes one line to stderr, which
 * is wherever the host already collects logs.
 *
 * No dependency and no account, deliberately. Swapping in Sentry later means
 * changing the body of the route handler, not this file and not the
 * boundaries.
 */

/** A crash, as the boundaries see it. Everything optional but the message. */
export type ErrorReport = {
  message: string;
  stack?: string;
  /** Next's server-side id, the only thing support can match a log against. */
  digest?: string;
  url?: string;
  source?: string;
};

/**
 * Caps every field. The endpoint is public and unauthenticated, so treat what
 * arrives as hostile: a stack can be enormous, and an attacker can send
 * anything at all. Truncating here means the same limits apply whether the
 * report came from our boundary or from a stranger with curl.
 */
export const LIMITS = { message: 500, stack: 4000, digest: 64, url: 300 } as const;

const clamp = (value: unknown, max: number) =>
  typeof value === "string" && value.trim()
    ? value.trim().slice(0, max)
    : undefined;

export function clampReport(input: unknown): ErrorReport | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Record<string, unknown>;
  const message = clamp(raw.message, LIMITS.message);
  if (!message) return null;
  return {
    message,
    stack: clamp(raw.stack, LIMITS.stack),
    digest: clamp(raw.digest, LIMITS.digest),
    url: clamp(raw.url, LIMITS.url),
    source: clamp(raw.source, 40),
  };
}

/**
 * Fire and forget. An error reporter that throws, blocks a render or delays an
 * unload is worse than no reporter, so every failure here is swallowed and
 * `keepalive` lets the request outlive the page.
 */
export function reportError(error: Error & { digest?: string }, source: string) {
  try {
    const body: ErrorReport = {
      message: String(error?.message ?? error),
      stack: error?.stack,
      digest: error?.digest,
      url: typeof location === "undefined" ? undefined : location.href,
      source,
    };
    void fetch("/api/report-error", {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => {});
  } catch {
    // Reporting must never become the second thing that broke.
  }
}
