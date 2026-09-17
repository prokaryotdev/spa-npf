"use client";

import NextLink from "next/link";
import { useRouter as useNextRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useLang } from "./client";
import { localePath } from "./path";

type NextLinkProps = React.ComponentProps<typeof NextLink>;

/**
 * next/link with the current language on the front of the href.
 *
 * Every internal link on the site imports this instead of next/link, which is
 * why the change to URL-based locale touched twenty-two import lines and none
 * of the roughly hundred hrefs underneath them: the call sites still write
 * "/app/services" and this decides whether that is /en/app/services or
 * /ar/app/services. External links, mailto:, tel: and bare anchors pass
 * through untouched — see i18n/path.ts.
 *
 * `href` keeps next/link's own type, so typed routes still check the call
 * sites; only the prefixed string handed downwards has to be asserted, since
 * the prefix is a proxy rewrite and not a folder Next can see.
 */
export default function Link({ href, ...rest }: NextLinkProps) {
  const lang = useLang();
  const prefixed = useMemo(
    () =>
      typeof href === "string"
        ? (localePath(href, lang) as typeof href)
        : href,
    [href, lang],
  );
  return <NextLink href={prefixed} {...rest} />;
}

/**
 * The same prefixing for the handful of places that navigate in an effect or
 * a submit handler rather than with a link.
 */
export function useRouter() {
  const router = useNextRouter();
  const lang = useLang();
  return useMemo(
    () => ({
      ...router,
      push: (href: string, options?: { scroll?: boolean }) =>
        router.push(localePath(href, lang), options),
      replace: (href: string, options?: { scroll?: boolean }) =>
        router.replace(localePath(href, lang), options),
    }),
    [router, lang],
  );
}

/** For an href that has to be built by hand, outside a Link. */
export function useLocalePath() {
  const lang = useLang();
  return useCallback((href: string) => localePath(href, lang), [lang]);
}
