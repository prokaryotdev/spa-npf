# Nigeria Police Force, FCT Command — front end

A rebuild of a police services website for the Nigeria Police Force's Federal
Capital Territory Command, in Next.js, bilingual (English / Hausa), with a
citizen portal and an operations console on top of it. There is no backend:
everything behind the screens is seeded content and one object in
`localStorage` (see `app/components/store.ts`).

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # search ranking, Hausa coverage, asset paths
npm run lint
npm run test:e2e # smoke, accessibility and responsive, in both languages
```

## Languages

English is the official language of Nigeria and the one the Force publishes
in; Hausa is the language most widely spoken in the Territory and the states
around it. Both are written in the Latin alphabet, so there is no direction
to switch and one set of layout rules serves both.

Locale is the first path segment — `/en/app/services`, `/ha/app/services`.
`proxy.ts` strips the prefix on the way in and `app/i18n/Link.tsx` puts it
back on every link on the way out, so the page files never see it. Every page
has exactly one address per language, which is what makes the Hausa half of
the site indexable.

Everything under `app/i18n/`:

| file | what it is |
|---|---|
| `config.ts` | languages, cookie name, `Intl` locales |
| `translate.ts` | `translate(lang, text, vars)` — the dictionary lookup |
| `localize.ts` | walks a whole content object through `translate` |
| `client.tsx` | `useT`, `useLang`, `useFormat`, `useLocalized` |
| `server.ts` | `getT`, `getLang`, `getFormat`, `getLocalized` |
| `ha-*.ts` | the dictionary, split by area of the site |

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

Then add the Hausa to the matching `app/i18n/ha-*.ts`. `npm test` fails if any
reader-visible string has no Hausa, if two dictionary files disagree about the
same key, or if an entry was left in English.

Keys that identify rather than describe — `slug`, `href`, `status`, `category`
and the rest of the list in `localize.ts` — are never translated, because code
compares them. Where such a value is also displayed, the display site calls
`t()` on it.

### Names that are the same in both languages

An Arabic dictionary can tell "translated" from "left in English" by looking
at the script. Hausa cannot: a road name, a statute title or a callsign is the
same string in both languages, and so is a line somebody forgot. So the names
are listed once in `scripts/proper-nouns.mjs`, and both the coverage test and
the pruner read that list. Anything that describes rather than names belongs
in the dictionary, translated.

### Checking a change

`npm test` covers the dictionary. One thing needs a running server:

```bash
node --import ./scripts/ts-resolve.mjs scripts/check-locales.mjs
```

It walks every route in both languages and fails if a Hausa page still
contains one of the dictionary's English keys word for word.

Dates, numbers and money go through `useFormat()` / `getFormat()`, which pin
West Africa Time and format **both** languages through `en-NG`. That last part
is deliberate: Node ships full ICU and knows `ha-NG`, browsers do not and fall
back to `en-US`, and the two render different dates for the same instant —
which React throws the whole server tree away over, on every Hausa page.
`scripts/test-locale-path.mjs` fails if anyone points a language at a locale
the browser may not carry.

## Layout

One direction, so the logical properties (`ms-`, `pe-`, `start-`, `text-start`)
are there for readability rather than for mirroring. Physical `left`/`right`
survives on artwork that must not move — the skyline composition, the gradient
blooms.

The two institutional marks in the header are drawn in
`app/components/Wordmark.tsx` rather than loaded as files, so the lettering is
the site's own display face and one `currentColor` carries white-over-hero and
ink-on-white alike.

Hausa spells four letters with hooks — ɓ ɗ ƙ ƴ — which the brand faces do not
carry. CSS font fallback is per character, so those glyphs come from the next
family in the stack and everything else stays on brand. That is why the
fallback list in `globals.css` is not decorative. Search folds the hooks to
their plain letters in both the query and the index, because nobody has ɓ on
their keyboard.

## What is not real

Signing in accepts any eleven-digit NIN and opens a sample account. Requests,
fines, documents, incidents and units are seeded and live in the browser. Swap
the functions at the bottom of `app/components/store.ts` for API calls when
there is a backend; nothing else touches storage.

The statutes, traffic offences, penalty points, speed limits, Area Commands
and Divisional Headquarters are real and checkable. The photographs are not:
they are placeholders carried over from the site this was rebuilt from, and
every one of them should be replaced before this goes anywhere near a real
deployment.
