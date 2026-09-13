"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CalendarIcon,
  PhoneIcon,
  PinIcon,
  ServicesIcon,
  SmileIcon,
} from "./icons";

const right = [
  { label: "Events", href: "/app/home/media/events", Icon: CalendarIcon },
  { label: "Customer Centers", href: "/app/home/customer-centers", Icon: PinIcon },
  { label: "Contact Us", href: "/app/home/contactUs", Icon: PhoneIcon },
];

const partners = [
  { label: "dubai.ae", src: "/img/dubaiae.svg", width: 64 },
  { label: "Innovation", src: "/img/ai.svg", width: 32 },
  { label: "Dubai Police AIX", src: "/img/dashboard/aix-logo1.png", width: 32 },
];

/** Quick-access toolbar; rises once the hero is out of the way. */
export default function StickyBar() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-0 left-0 z-50 w-full md:pb-5">
      <div className="dp-container">
        <nav
          aria-label="Quick access toolbar"
          className={`pointer-events-auto overflow-hidden rounded-t-3xl border border-black/5 bg-white/90 shadow-[0_-8px_30px_-18px_rgba(0,60,40,0.5)] backdrop-blur-md transition-transform duration-500 ease-[var(--ease-custom)] md:rounded-full ${
            shown ? "translate-y-0" : "translate-y-[150%]"
          }`}
        >
          <div className="flex justify-between">
            <div className="flex items-center">
              <a
                href="https://www.happinessmeter.ae/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Happiness Meter (opens in a new window)"
                className="inline-flex min-w-[74px] items-center justify-center px-4 py-4 text-dp-green transition-colors hover:bg-black/[0.04]"
              >
                <SmileIcon className="size-7 lg:size-8" />
              </a>
              <Link
                href="/app/services"
                className="inline-flex min-w-[74px] items-center justify-center px-4 py-4 text-dp-green transition-colors hover:bg-black/[0.04]"
              >
                <ServicesIcon className="size-6 lg:size-7" />
                <span className="ms-2 hidden text-sm font-medium lg:block">
                  Services
                </span>
              </Link>
            </div>

            <div className="flex items-center">
              {right.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex min-w-[74px] items-center justify-center px-4 py-4 text-[#575757] transition-colors hover:bg-black/[0.04]"
                >
                  <Icon className="size-6 lg:size-7" />
                  <span className="ms-2 hidden text-sm leading-none lg:block">
                    {label}
                  </span>
                </Link>
              ))}
              {partners.map((partner) => (
                <a
                  key={partner.label}
                  href="https://www.dubaipolice.gov.ae/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={partner.label}
                  className="hidden min-w-[64px] items-center justify-center px-3 py-4 transition-colors hover:bg-black/[0.04] sm:inline-flex"
                >
                  <Image
                    src={partner.src}
                    alt={partner.label}
                    width={partner.width}
                    height={32}
                    className="h-8 w-auto"
                  />
                </a>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
