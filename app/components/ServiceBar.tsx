"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "./icons";

/**
 * On a phone the action card sits at the top and scrolls away while the
 * reader is still deciding. This bar brings the price and the way back in
 * reach of a thumb, but only once the card is above the screen, and it
 * steps aside for the footer so it never covers the last links.
 */
export default function ServiceBar({
  target,
  fee,
  label,
  caption,
}: {
  target: string;
  fee: string;
  label: string;
  caption: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const card = document.getElementById(target);
    const footer = document.querySelector("footer");
    if (!card) return;
    let past = false;
    let atFooter = false;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === card)
          past = !e.isIntersecting && e.boundingClientRect.top < 0;
        else atFooter = e.isIntersecting;
      }
      setShow(past && !atFooter);
    });
    io.observe(card);
    if (footer) io.observe(footer);
    return () => io.disconnect();
  }, [target]);

  return (
    <div
      inert={!show}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-npf-hairline bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-card backdrop-blur transition-[translate,opacity] duration-(--dur-media) ease-(--ease-out) lg:hidden motion-reduce:transition-none ${show ? "" : "pointer-events-none translate-y-full opacity-0"}`}
    >
      <div className="mx-auto flex max-w-xl items-center gap-4">
        <span className="min-w-0 flex-1">
          <span className="npf-small block text-npf-steel">{caption}</span>
          <span className="npf-h5 block truncate text-npf-blue-deep tabular-nums">
            {fee}
          </span>
        </span>
        <a
          href={`#${target}`}
          className="npf-btn npf-btn-primary h-auto min-h-11 max-w-[60%] shrink-0 py-1.5 text-start leading-tight whitespace-normal hover:bg-npf-blue-mid"
        >
          {label}
          <span className="npf-btn-disc">
            <ArrowRight className="size-4 rtl:-scale-x-100" />
          </span>
        </a>
      </div>
    </div>
  );
}
