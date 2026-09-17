import { clampReport, type ErrorReport } from "../../report-error";

/**
 * Writes one line to stderr for each crash the error boundaries catch, so the
 * host's existing log collection sees it. This is the whole of the site's
 * monitoring: swap the body of `record` for `Sentry.captureException` when
 * there is a DSN, and nothing else has to change.
 *
 * Public and unauthenticated by necessity — a crash can happen before anyone
 * signs in — so it is written as a trust boundary: the body is size-capped
 * before it is parsed, every field is truncated, callers are rate limited, and
 * nothing that arrives is ever echoed back.
 */

/** Refuse anything larger than the clamped fields could possibly need. */
const MAX_BODY = 8 * 1024;

/**
 * ponytail: one Map in one process. It resets on deploy and does not see the
 * other instances behind a load balancer, which is the right trade for a log
 * line — the cap exists to stop a single client filling the log, not to be an
 * accounting record. Move it to Redis if this ever gates something that costs
 * money.
 */
const RATE = { windowMs: 60_000, max: 20 };
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(key: string) {
  const now = Date.now();
  const seen = hits.get(key);
  if (!seen || now > seen.resetAt) {
    hits.set(key, { count: 1, resetAt: now + RATE.windowMs });
    // Drop expired keys while we are here, so one Map cannot grow forever.
    if (hits.size > 5_000)
      for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
    return false;
  }
  seen.count += 1;
  return seen.count > RATE.max;
}

function record(report: ErrorReport) {
  console.error(
    "[client-error] " +
      JSON.stringify({ at: new Date().toISOString(), ...report }),
  );
}

export async function POST(request: Request) {
  // The first proxy hop the platform controls; falls back to a single bucket,
  // which still caps total volume when no header is present.
  const who =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(who)) return new Response(null, { status: 429 });

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY) return new Response(null, { status: 413 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  const report = clampReport(body);
  if (!report) return new Response(null, { status: 400 });

  record(report);
  // 204: the browser is already showing the fallback and has nothing to do
  // with a reply, and an empty body cannot reflect anything that arrived.
  return new Response(null, { status: 204 });
}
