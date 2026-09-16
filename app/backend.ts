import { notFound } from "next/navigation";

/**
 * Refuses to serve the signed-in half of the site until an API exists.
 *
 * app/components/store.ts is still the whole backend: any Emirates ID of the
 * right shape opens the same sample account, out of localStorage. That is fine
 * on a laptop and fine in a demo, and not fine on a public URL, where a
 * stranger would be shown a stranger's name, fines and requests with nothing
 * saying otherwise. So the three routes that can reach an account — sign-in,
 * the portal and the console — 404 unless API_URL is set, which makes
 * "deployed without a backend" impossible rather than merely unwise.
 *
 * Server-side only, deliberately: NEXT_PUBLIC_ would ship the value to the
 * browser, and nothing in the client needs to read it.
 *
 * Delete this once store.ts talks to the API.
 */
export function requireBackend() {
  if (process.env.API_URL) return;
  console.error(
    "API_URL is not set — refusing to serve sign-in, the portal or the console. " +
      "Set it to the API base URL, or run with it set locally to work on these screens.",
  );
  notFound();
}
