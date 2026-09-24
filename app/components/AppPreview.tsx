import Image from "next/image";
import {
  BellIcon,
  FileIcon,
  InboxIcon,
  PhoneCallIcon,
  ServicesIcon,
  ShieldIcon,
  UserCircle,
} from "./icons";
import { PoliceWordmark } from "./Wordmark";

type Service = { title: string; icon: string };

/**
 * The app's home screen, drawn rather than captured, in a phone standing in
 * the app band: 112, the site's own services, a news card, a request being
 * tracked and the tab bar. Everything on the screen is sized in container
 * units, so it reads the same at every phone width. Decorative: the band's
 * heading and list say in words what it shows.
 */
export default function AppPreview({
  services,
  t,
}: {
  services: Service[];
  t: (key: string) => string;
}) {
  const side =
    "absolute w-[3px] bg-[linear-gradient(90deg,var(--color-npf-steel),var(--color-npf-night))]";
  return (
    <div
      aria-hidden
      className="relative mx-auto w-[240px] sm:w-[270px] lg:w-[300px] xl:w-[320px]"
    >
      {/* Light and the brand rings, centred on the phone. */}
      <span className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[240%] -translate-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.4),rgb(255_255_255/0.1)_50%,transparent)]" />
      {[150, 205, 260].map((size) => (
        <span
          key={size}
          className="pointer-events-none absolute top-1/2 left-1/2 aspect-square -translate-1/2 rounded-full border border-white/15"
          style={{ width: `${size}%` }}
        />
      ))}

      {/* Side buttons. */}
      <span className={`${side} top-[17%] -left-[2px] h-7 rounded-s-sm`} />
      <span className={`${side} top-[23%] -left-[2px] h-12 rounded-s-sm`} />
      <span className={`${side} top-[31%] -left-[2px] h-12 rounded-s-sm`} />
      <span
        className={`${side} top-[26%] -right-[2px] h-20 rotate-180 rounded-s-sm`}
      />

      {/* Black glass in a thin steel band: the band is an inset ring, so the
          edge catches light instead of reading grey. */}
      <div className="relative rounded-[3.4rem] bg-npf-glass p-[11px] shadow-float ring-[1.5px] ring-npf-steel ring-inset">
        <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2.65rem] bg-npf-night">
          {/* Status bar. */}
          <div className="absolute inset-x-0 top-0 z-20 flex h-[42px] items-center justify-between px-[11%] text-xs font-semibold text-white tabular-nums sm:text-[13px]">
            <span>9:41</span>
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 17 11" className="h-2.5 w-auto fill-white">
                <rect x="0" y="7" width="3" height="4" rx="0.7" />
                <rect x="4.5" y="5" width="3" height="6" rx="0.7" />
                <rect x="9" y="2.5" width="3" height="8.5" rx="0.7" />
                <rect x="13.5" y="0" width="3" height="11" rx="0.7" />
              </svg>
              <svg viewBox="0 0 26 12" className="h-3 w-auto">
                <rect
                  x="0.5"
                  y="0.5"
                  width="22"
                  height="11"
                  rx="3"
                  fill="none"
                  stroke="white"
                  strokeOpacity="0.4"
                />
                <rect x="2" y="2" width="16" height="8" rx="1.6" fill="white" />
                <rect
                  x="23.8"
                  y="4"
                  width="1.6"
                  height="4"
                  rx="0.8"
                  fill="white"
                  fillOpacity="0.4"
                />
              </svg>
            </span>
          </div>
          <span className="absolute top-2 left-1/2 z-10 h-[26px] w-[32%] -translate-x-1/2 rounded-full bg-black" />

          <div className="@container absolute inset-0 flex flex-col bg-npf-mist text-npf-ink">
            <div className="bg-npf-blue px-[6cqw] pt-[calc(42px+3cqw)] pb-[12cqw] text-white">
              <div className="flex items-center justify-between">
                <PoliceWordmark className="h-[10cqw]" />
                <span className="grid size-[9cqw] place-items-center rounded-full bg-white/12">
                  <BellIcon className="size-[4.6cqw]" />
                </span>
              </div>
              <p className="mt-[6cqw] font-secondary text-[6.6cqw] leading-tight font-bold tracking-[-0.02em]">
                {t("How can we help?")}
              </p>
            </div>

            <div className="-mt-[7cqw] flex flex-1 flex-col gap-[4cqw] px-[5cqw]">
              <div className="flex items-center justify-between rounded-[4cqw] bg-npf-alert px-[5cqw] py-[3.6cqw] text-white">
                <span className="flex flex-col">
                  <span className="text-[3.3cqw] font-semibold text-white/85">
                    {t("Emergency")}
                  </span>
                  <span className="font-secondary text-[8.4cqw] leading-none font-bold tabular-nums">
                    112
                  </span>
                </span>
                <span className="grid size-[11cqw] place-items-center rounded-full bg-white text-npf-alert">
                  <PhoneCallIcon className="size-[5.4cqw]" />
                </span>
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <span className="font-secondary text-[4cqw] font-bold">
                    {t("Services")}
                  </span>
                  <span className="text-[3cqw] font-semibold text-npf-blue-mid">
                    {t("See all")}
                  </span>
                </div>
                <ul className="mt-[2.6cqw] grid grid-cols-2 gap-[2.6cqw]">
                  {services.slice(0, 4).map((service) => (
                    <li
                      key={service.title}
                      className="flex flex-col gap-[2cqw] rounded-[3.4cqw] bg-white p-[3.2cqw] ring-1 ring-npf-ink/5"
                    >
                      <span className="relative block size-[9cqw]">
                        <Image
                          src={service.icon}
                          alt=""
                          fill
                          sizes="32px"
                          className="object-contain"
                        />
                      </span>
                      <span className="line-clamp-2 min-h-[2lh] text-[3.1cqw] leading-snug font-bold">
                        {service.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative h-[26cqw] overflow-hidden rounded-[3.4cqw] bg-npf-night">
                <Image
                  src="/npf/hero/fleet.jpg"
                  alt=""
                  fill
                  sizes="300px"
                  className="object-cover"
                />
                <span className="absolute inset-0 flex flex-col justify-end bg-[linear-gradient(to_top,rgb(10_21_38/0.9),transparent_70%)] p-[3.2cqw] text-white">
                  <span className="text-[2.6cqw] font-semibold text-npf-gold-soft">
                    {t("News")}
                  </span>
                  <span className="font-secondary text-[3.6cqw] leading-tight font-bold">
                    {t("Ready on Every Road")}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-[3cqw] rounded-[3.4cqw] bg-white p-[3.2cqw] ring-1 ring-npf-ink/5">
                <span className="grid size-[9cqw] shrink-0 place-items-center rounded-[2.4cqw] bg-npf-blue/10 text-npf-blue">
                  <FileIcon className="size-[4.8cqw]" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-[2.7cqw] text-npf-muted">
                    {t("Your request")}
                  </span>
                  <span className="truncate text-[3.2cqw] font-bold">
                    {t("Certificate application")}
                  </span>
                </span>
                <span className="rounded-full bg-npf-gold-wash px-[2.4cqw] py-[0.8cqw] text-[2.6cqw] font-semibold text-npf-gold">
                  {t("In review")}
                </span>
              </div>
            </div>

            {/* Tab bar, clear of the home indicator. */}
            <div className="grid grid-cols-4 border-t border-npf-ink/8 bg-white px-[3cqw] pt-[2.6cqw] pb-[7cqw] text-[2.5cqw] font-semibold text-npf-muted">
              {[
                { label: t("Home"), Icon: ShieldIcon, on: true },
                { label: t("Services"), Icon: ServicesIcon },
                { label: t("Requests"), Icon: InboxIcon },
                { label: t("Profile"), Icon: UserCircle },
              ].map(({ label, Icon, on }) => (
                <span
                  key={label}
                  className={`flex flex-col items-center gap-[1cqw] ${on ? "text-npf-blue" : ""}`}
                >
                  <Icon className="size-[5.4cqw]" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Home indicator, and a sheen across the glass. */}
          <span className="absolute bottom-2 left-1/2 z-10 h-1 w-[36%] -translate-x-1/2 rounded-full bg-npf-ink/80" />
          <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgb(255_255_255/0.08)_0%,transparent_30%)]" />
        </div>
      </div>
    </div>
  );
}
