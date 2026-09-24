"use client";

import { useEffect } from "react";

/**
 * Brings every [data-reveal] block on the page in once, the first time it
 * scrolls into view. One IntersectionObserver for the whole page, so nothing
 * runs per scroll frame; the motion itself is a CSS transition.
 *
 * The hidden starting state only exists while `npf-reveal-on` is on <html>,
 * which this adds on mount and takes away on unmount. Without script, or on
 * any page that does not mount it, content simply shows.
 */
export default function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    const show = (el: Element) => el.setAttribute("data-shown", "");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // A block already scrolled past (a reload restored mid-page) shows
          // at once rather than waiting for the reader to scroll back up.
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
            show(entry.target);
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    document
      .querySelectorAll("[data-reveal]:not([data-shown])")
      .forEach((el) => observer.observe(el));
    root.classList.add("npf-reveal-on");
    return () => {
      observer.disconnect();
      root.classList.remove("npf-reveal-on");
    };
  }, []);

  return null;
}
