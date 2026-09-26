"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * How far a tall section has travelled while its sticky child is pinned:
 * 0 when the section's top meets the viewport top, 1 when its bottom
 * reaches the viewport bottom.
 *
 * The progress never goes through React state. `onFrame` gets it once per
 * animation frame and writes transforms straight onto the elements that
 * move, so scrolling a pinned chapter re-renders nothing. The only state is
 * the chapter number, which changes three times in the whole section. The
 * listener only does work while the section is near the viewport.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  count: number,
  onFrame: (progress: number) => void,
) {
  const [active, setActive] = useState(0);
  const frameRef = useRef(onFrame);
  useEffect(() => {
    frameRef.current = onFrame;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    let near = false;
    // What the section shows, which glides after the scroll position rather
    // than jumping to it, so a wheel's notches read as one movement. It
    // closes ~63% of the gap every GLIDE ms whatever the frame rate, and
    // snaps when the section is off screen or motion is reduced.
    let shown = -1;
    let last = 0;
    const measure = (now = performance.now()) => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const target = span <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / span));
      const snap = shown < 0 || !near || matchMedia(REDUCED).matches;
      const k = 1 - Math.exp(-Math.min(32, now - last) / GLIDE);
      last = now;
      shown = snap ? target : shown + (target - shown) * k;
      if (Math.abs(target - shown) < 0.0004) shown = target;
      frameRef.current(shown);
      setActive(chapter(shown, count));
      if (shown !== target) schedule();
    };
    const schedule = () => {
      if (near && !frame) frame = requestAnimationFrame(measure);
    };
    const watch = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        if (near) schedule();
      },
      { rootMargin: "50% 0px" },
    );

    watch.observe(el);
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      watch.disconnect();
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref, count]);

  return active;
}

/** How long the glide takes to close most of the gap to the scroll, in ms. */
const GLIDE = 90;
const REDUCED = "(prefers-reduced-motion: reduce)";

/** Which of `count` chapters the progress sits in. */
function chapter(progress: number, count: number) {
  return Math.min(count - 1, Math.floor(progress * count));
}

/** Smooth-scroll to a point in a pinned section, `at` from 0 to 1. */
export function scrollToProgress(el: HTMLElement | null, at: number) {
  if (!el) return;
  const span = el.offsetHeight - window.innerHeight;
  window.scrollTo({
    top: el.offsetTop + span * at,
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
  });
}
