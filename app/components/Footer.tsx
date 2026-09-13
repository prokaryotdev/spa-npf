"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  emergencyNumbers,
  footerColumns,
  legalLinks,
  storeBadges,
} from "../content";
import { ArrowUpRight, ChevronDown, PhoneIcon, SocialIcon } from "./icons";

const socials = ["Facebook", "Youtube", "Twitter", "Instagram"] as const;

export default function Footer() {
  const [open, setOpen] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer
      id="staticFooter"
      className="w-full pt-16 pb-32"
      style={{
        background:
          "linear-gradient(rgb(227,238,232) -15.6%, rgb(255,255,255) 25.33%)",
      }}
    >
      <div className="dp-container text-base text-dp-body">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            <span className="rounded-xl bg-[#E9FAF2] p-3.5 text-dp-green-ink">
              <PhoneIcon className="size-12" />
            </span>
            <span className="max-w-[188px] text-center font-secondary text-3xl font-bold text-dp-ink md:text-left">
              Emergency Numbers
            </span>
          </div>

          <div className="grid w-full grid-cols-2 gap-4 md:w-auto lg:grid-cols-4">
            {emergencyNumbers.map((item) => (
              <div
                key={item.number}
                className="flex h-[100px] flex-col items-center justify-center rounded-2xl bg-[#F9F9F9] px-4 lg:w-[159.5px]"
              >
                <span className="font-secondary text-sm font-bold">
                  {item.label}
                </span>
                <a
                  href={`tel:${item.number}`}
                  className="font-secondary text-[41px] leading-tight font-bold tabular-nums transition-opacity hover:opacity-80"
                  style={{ color: item.color }}
                >
                  {item.number}
                </a>
                {item.note ? (
                  <span className="text-[10px]">{item.note}</span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
        <hr className="my-6 border-black/10" />
      </div>

      <div className="dp-container grid grid-flow-row gap-3 text-base text-dp-body md:grid-flow-col md:gap-20">
        {footerColumns.map((col) => {
          const isOpen = open === col.heading;
          return (
            <div key={col.heading} className="border-b border-black/10 pb-4 md:border-none md:pb-0">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : col.heading)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between text-left md:cursor-default"
              >
                <h2 className="mb-0 font-medium text-dp-ink md:mb-6">
                  {col.heading}
                </h2>
                <ChevronDown
                  className={`size-5 transition-transform duration-300 md:hidden ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              <ul
                className={`space-y-3 overflow-hidden transition-all duration-300 md:max-h-full md:opacity-100 ${
                  isOpen ? "max-h-[420px] pt-4 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={"external" in link && link.external ? "_blank" : undefined}
                      rel={
                        "external" in link && link.external
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="inline-flex items-center gap-1.5 transition-colors hover:text-[#00a66f]"
                    >
                      {link.label}
                      {"external" in link && link.external ? (
                        <ArrowUpRight className="size-4" />
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        <div>
          <p className="mb-6">
            <Image
              src="/img/Dubai-Police.svg"
              alt="Dubai Police"
              width={185}
              height={64}
            />
          </p>
          <h2 className="mb-6 font-medium text-dp-ink">
            Subscribe to our Newsletter
          </h2>
          <p className="mb-3">
            Stay updated with the latest news and announcements.
          </p>
          {/* ponytail: no mailing-list backend, so this confirms and stops. */}
          <form
            className="mb-6"
            onSubmit={(e) => {
              e.preventDefault();
              setSubscribed(true);
              e.currentTarget.reset();
            }}
          >
            <div className="relative w-full">
              <label htmlFor="subscribeEmail" className="sr-only">
                Email Address
              </label>
              <input
                id="subscribeEmail"
                type="email"
                required
                placeholder="Email Address"
                className="w-full rounded-lg border border-[#E4E2E6] bg-white px-4 py-3 pr-32 text-dp-ink placeholder:text-[#6b6b6b]"
              />
              <button
                type="submit"
                className="absolute top-0 right-0 h-full rounded-lg bg-dp-green px-4 text-xl font-medium text-white transition-colors hover:bg-[#00a66f]"
              >
                Subscribe
              </button>
            </div>
            <p aria-live="polite" className="mt-2 min-h-[1.25rem] text-sm text-dp-green-ink">
              {subscribed ? "Thanks — you are on the list." : ""}
            </p>
          </form>
          <div className="flex gap-6">
            {socials.map((name) => (
              <a
                key={name}
                href="https://www.dubaipolice.gov.ae/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="text-dp-body transition-colors hover:text-dp-green"
              >
                <SocialIcon name={name} className="size-6" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="dp-container text-base text-dp-body">
        <hr className="mt-8 mb-6 border-black/10 md:mt-16" />
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div className="w-full max-w-[536px]">
            <p>© 2026 Dubai Police General HQ. All Rights Reserved</p>
            <p>
              This site is monitored and maintained by Dubai Police.
              <br />
              The site is best viewed using IE11 and above, Mozilla Firefox,
              Safari and Chrome
              <br />
              Last modified Date: 11/09/2026
            </p>
          </div>
          <div className="flex flex-col md:items-end">
            <ul className="mb-6 flex flex-wrap gap-x-6 gap-y-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-[#00a66f]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-6">
              {storeBadges.map((badge) => (
                <a
                  key={badge.label}
                  href="https://www.dubaipolice.gov.ae/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={badge.src}
                    alt={badge.label}
                    width={badge.width}
                    height={40}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
