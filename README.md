# Dubai Police — front end

A rebuild of the Dubai Police website in Next.js, bilingual (English / Arabic
with full RTL), with a citizen portal and an operations console on top of it.
There is no backend: everything behind the screens is seeded content and one
object in `localStorage` (see `app/components/store.ts`).

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # search ranking, Arabic coverage, asset paths
npm run lint
```

## Languages

The site answers at one set of URLs in both languages. The chosen language
lives in a `dp-lang` cookie, the root layout reads it and sets `<html lang dir>`,
and the header's switcher posts a server action so the whole tree re-renders on
the server in the new language — no flash, and it works with scripting off.
`/ar` and `/en` are shareable entry links that set the cookie and redirect;
both accept a same-site `?to=` destination.

Everything under `app/i18n/`:

| file | what it is |
|---|---|
| `config.ts` | languages, cookie name, `Intl` locales |
| `translate.ts` | `translate(lang, text, vars)` — the dictionary lookup |
| `localize.ts` | walks a whole content object through `translate` |
| `client.tsx` | `useT`, `useLang`, `useFormat`, `useLocalized` |
| `server.ts` | `getT`, `getLang`, `getFormat`, `getLocalized` |
| `ar-*.ts` | the dictionary, split by area of the site |

### Adding a string

The dictionary is keyed by the English source string, so the English in the
JSX stays readable and a missing entry degrades to English rather than to a
bare key:

```tsx
const t = useT();            // await getT() in a server component
<button>{t("Read more")}</button>
```

Content objects go through `localize` once instead of a `t()` per field:

```tsx
import { news as newsSource } from "../content-news";
const news = useLocalized(newsSource);   // await getLocalized(...) on the server
```

Then add the Arabic to the matching `app/i18n/ar-*.ts`. `npm test` fails if any
reader-visible string has no Arabic, if two dictionary files disagree about the
same key, or if an entry was left in English.

Keys that identify rather than describe — `slug`, `href`, `status`, `category`
and the rest of the list in `localize.ts` — are never translated, because code
compares them. Where such a value is also displayed, the display site calls
`t()` on it.

### Checking a change

`npm test` covers the dictionary. Two things need a running server:

```bash
node scripts/check-locales.mjs     # every route in both languages, no English left
```

Dates, numbers and money go through `useFormat()` / `getFormat()`, which pin
Dubai time and use Western digits in Arabic — the numerals UAE government
services, plates and fines are read in.

## Layout

RTL is carried by CSS logical properties (`ms-`, `pe-`, `start-`, `text-start`),
so one class serves both directions. Physical `left`/`right` survives only on
artwork that must not mirror — the Dubai skyline composition, the gradient
blooms. The four directional icons (`ArrowRight`, `ArrowUpRight`, `ChevronLeft`,
`ChevronRight`) flip under `[dir="rtl"]` via `.dp-flip`; icons with an absolute
meaning, like download, do not.

## What is not real

Signing in accepts any Emirates ID of the right shape and opens a sample
account. Requests, fines, documents, incidents and units are seeded and live in
the browser. Swap the functions at the bottom of `app/components/store.ts` for
API calls when there is a backend; nothing else touches storage.
