import type { CSSProperties } from "react";

/**
 * Props for a block that arrives on scroll (see RevealObserver). `step` is
 * its place in a stagger: each step waits one --reveal-step longer.
 */
export function reveal(step = 0) {
  return {
    "data-reveal": "",
    style: step
      ? ({
          "--reveal-delay": `calc(var(--reveal-step) * ${step})`,
        } as CSSProperties)
      : undefined,
  };
}
