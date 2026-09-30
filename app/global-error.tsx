"use client";

import "./globals.css";
import { useEffect } from "react";
import { useT } from "./i18n/client";
import { reportError } from "./report-error";

/**
 * Replaces the root layout when the layout itself throws, so it owns its own
 * document and cannot reuse Header or Footer. Styles are inlined for the same
 * reason — the stylesheet import is best-effort here, so each colour names
 * its token with the token's own value as the fallback.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const t = useT();
  // The layout itself threw, so this is the more serious of the two.
  useEffect(() => {
    console.error(error);
    reportError(error, "global-error-boundary");
  }, [error]);
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
          color: "var(--color-npf-ink, #1a2338)",
          fontFamily: "var(--font-primary, system-ui, sans-serif)",
        }}
      >
        <title>{t("Something went wrong | Nigeria Police Force")}</title>
        <div style={{ maxWidth: "42rem" }}>
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            width="56"
            height="56"
            style={{
              padding: "14px",
              borderRadius: "9999px",
              background: "var(--color-npf-error-wash, #fbe4e4)",
              color: "var(--color-npf-error, #9b1c1c)",
              boxSizing: "border-box",
              marginBottom: "2rem",
            }}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          </svg>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(2rem, 6vw, 3.5rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              fontWeight: 700,
              fontFamily: "var(--font-secondary, system-ui, sans-serif)",
              color: "var(--color-npf-blue-deep, #14315f)",
            }}
          >
            {t("Something went wrong")}
          </h1>
          <p
            style={{
              marginTop: "1.25rem",
              fontSize: "1.125rem",
              color: "var(--color-npf-body, #4a5468)",
            }}
          >
            {t("The site failed to load. Trying again often clears it.")}
          </p>
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => retry()}
              style={{
                border: 0,
                cursor: "pointer",
                borderRadius: "9999px",
                background: "var(--color-npf-blue, #1b3f7a)",
                color: "#fff",
                font: "inherit",
                fontWeight: 700,
                height: "3rem",
                padding: "0 1.5rem",
              }}
            >
              {t("Try again")}
            </button>
            {/* A plain link on purpose: the root layout is what failed, so a
 full page load is the recovery, not a client-side route. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                borderRadius: "9999px",
                background: "var(--color-npf-cloud, #f4f6fa)",
                color: "var(--color-npf-blue-deep, #14315f)",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                height: "3rem",
                padding: "0 1.5rem",
                textDecoration: "none",
                boxShadow: "inset 0 0 0 1px rgb(26 35 56 / 0.14)",
              }}
            >
              {t("Back to home")}
            </a>
            {/* A broken site must never stand between someone and help. */}
            <a
              href="tel:112"
              style={{
                borderRadius: "9999px",
                background: "var(--color-npf-alert, #b30900)",
                color: "#fff",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                height: "3rem",
                padding: "0 1.5rem",
                textDecoration: "none",
              }}
            >
              {t("Call 112")}
            </a>
          </div>
          {error.digest ? (
            <p
              style={{
                marginTop: "2rem",
                fontSize: "0.875rem",
                color: "var(--color-npf-muted, #5c6880)",
              }}
            >
              {t("Reference:")}{" "}
              <span style={{ fontFamily: "monospace" }}>{error.digest}</span>
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
