"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * How far a tall section has travelled while its sticky child is pinned:
 * 0 when the section's top meets the viewport top, 1 when its bottom
 * reaches the viewport bottom. Reads on a rAF tick, never on layout write.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      setProgress(span <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / span)));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref]);

  return progress;
}

/** Which of `count` chapters the progress sits in. */
export function chapter(progress: number, count: number) {
  return Math.min(count - 1, Math.floor(progress * count));
}
