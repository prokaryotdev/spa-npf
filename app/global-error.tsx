"use client";

import "./globals.css";

/**
 * Replaces the root layout when the layout itself throws, so it owns its own
 * document and cannot reuse Header or Footer. Styles are inlined for the same
 * reason — the stylesheet import is best-effort here.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en" dir="ltr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
          background: "#fff",
          color: "#233234",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
        }}
      >
        <title>Something went wrong | Dubai Police</title>
        <div style={{ maxWidth: "42rem" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(2rem, 6vw, 3.5rem)",
              lineHeight: 1.15,
              color: "#0B3B2C",
            }}
          >
            Something went wrong
          </h1>
          <p style={{ marginTop: "1.25rem", fontSize: "1.125rem", color: "#4b5563" }}>
            The site failed to load. Trying again often clears it.
          </p>
          <div style={{ marginTop: "2rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => retry()}
              style={{
                border: 0,
                cursor: "pointer",
                borderRadius: "9999px",
                background: "#00925b",
                color: "#fff",
                font: "inherit",
                fontWeight: 500,
                padding: "0.75rem 1.5rem",
              }}
            >
              Try again
            </button>
            {/* A plain link on purpose: the root layout is what failed, so a
                full page load is the recovery, not a client-side route. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                borderRadius: "9999px",
                background: "#F4F8F6",
                color: "#00603b",
                fontWeight: 500,
                padding: "0.75rem 1.5rem",
                textDecoration: "none",
              }}
            >
              Back to home
            </a>
          </div>
          {error.digest ? (
            <p style={{ marginTop: "2rem", fontSize: "0.875rem", color: "#6b7280" }}>
              Reference: <span style={{ fontFamily: "monospace" }}>{error.digest}</span>
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
