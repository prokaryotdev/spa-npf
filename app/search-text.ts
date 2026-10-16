/** Text matching shared by the site search and the Information tables. */

/**
 * One spelling per word.
 *
 * Hausa is written with four hooked letters — ɓ ɗ ƙ ƴ — and an apostrophe for
 * the glottal stop, none of which are on the keyboard most people search
 * from. They type "kasa" for "ƙasa" and "yan sanda" for "'yan sanda", and a
 * police site cannot answer "no results" because of a hook. The hooks fold to
 * their plain letters, the apostrophes drop, and Latin accents fold with
 * them — which also takes the dots and tones off Yoruba's ẹ ọ ṣ and Igbo's
 * ị ọ ụ ṅ. Applied to both the query and the index, so they always meet.
 */
const HOOKED: Record<string, string> = {
  "ɓ": "b",
  "ɗ": "d",
  "ƙ": "k",
  "ƴ": "y",
  "Ɓ": "b",
  "Ɗ": "d",
  "Ƙ": "k",
  "Ƴ": "y",
};

export const fold = (s: string) =>
  s
    .replace(/[ɓɗƙƴƁƊƘƳ]/g, (c) => HOOKED[c])
    .toLowerCase()
    .normalize("NFKD")
    // NFKD splits é into e plus an acute and à into a plus a grave; dropping
    // every non-spacing mark folds both, along with the tone marks Hausa
    // dictionaries write and ordinary typing leaves off.
    .replace(/\p{Mn}/gu, "")
    // The glottal stop, in every quote character a keyboard might produce.
    .replace(/['‘’ʼʻ]/g, "")
    // "&" is "and" wherever it is written: "Lost & Found", "lost and found".
    .replace(/&/g, " and ")
    .trim();

export const split = (s: string) => s.split(/[^\p{L}\p{N}]+/u).filter(Boolean);

// "police-clearance" and "police, clearance" are two words, like the titles;
// "50,000" is one number, the way the rows store it.
export const terms = (query: string) =>
  split(fold(query.replace(/(\d),(?=\d{3}\b)/g, "$1")));

/** One slip apart: a letter wrong, missing, extra, or two swapped. */
export function near(a: string, b: string) {
  return edits(a, b, 1) <= 1;
}

/**
 * Edits between two words — a letter wrong, missing, extra, or two
 * neighbours swapped — counted only up to `cap`: anything further is cap + 1.
 */
export function edits(a: string, b: string, cap: number) {
  if (Math.abs(a.length - b.length) > cap) return cap + 1;
  let prev2: number[] = [];
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let low = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let d = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1])
        d = Math.min(d, prev2[j - 2] + 1);
      row.push(d);
      low = Math.min(low, d);
    }
    if (low > cap) return cap + 1;
    prev2 = prev;
    prev = row;
  }
  return Math.min(prev[b.length], cap + 1);
}

/**
 * The English word under its ending, so "permits", "accidents" and
 * "speeding" meet "permit", "accident" and "speed". Always a prefix of the
 * word, and never shorter than four letters.
 */
export function stem(w: string) {
  if (w.length < 6 || /\d/.test(w)) return w;
  // "overspeeding" and "overloading" are speeding and loading.
  if (w.startsWith("over") && w.length >= 9) w = w.slice(4);
  for (const end of ["ings", "ing", "ies", "es", "ed", "s"])
    if (w.endsWith(end) && w.length - end.length >= 4)
      return w.slice(0, -end.length);
  return w;
}

/**
 * Everyday words and the ones the official text uses instead. Tried only
 * after the word itself and its stem miss, so a text that does say "car"
 * still ranks by "car".
 */
const SAME: Record<string, string[]> = {
  drunk: ["alcohol"],
  drink: ["alcohol"],
  car: ["vehicle"],
  cars: ["vehicle"],
  motor: ["vehicle"],
  okada: ["motorcycle"],
  bike: ["motorcycle"],
  crash: ["accident"],
  gun: ["firearm"],
  id: ["identity"],
  cop: ["police", "officer"],
  cops: ["police", "officer"],
  jail: ["detain", "custody"],
  prison: ["detain", "custody", "inmate"],
  kidnap: ["missing", "abduct"],
  stolen: ["theft", "crime"],
  steal: ["theft", "crime"],
  scam: ["fraud", "cybercrime"],
  fake: ["verif"],
  license: ["licence"],
  licenses: ["licence"],
};

/** A text's words, padded so " cid" only ever meets the start of a word. */
export const run = (words: string[]) => ` ${words.join(" ")} `;

/**
 * Where one search word lands in a text, or null. The answer is the form that
 * was found — the word, its stem, or the indexed word it is a slip of — so a
 * ranker can score a typo by the word it actually matched.
 *
 * Under four letters a word has to start a word: "cid" is inside "incident"
 * and "id" is inside half the site. From four letters it can sit anywhere,
 * which is what joined-up Hausa needs. Slips are only guessed when `typo` is
 * set — the caller sets it for a word the whole list has nowhere, so "fine"
 * never drags in "line" — and a word of eight letters or more may carry two.
 */
export function locate(
  term: string,
  all: string,
  words: string[],
  padded: string,
  typo: boolean,
): string | null {
  // Two letters ("id") are a word of their own or nothing.
  const exact =
    term.length < 3
      ? padded.includes(` ${term} `)
      : term.length < 4
        ? padded.includes(` ${term}`)
        : all.includes(term);
  if (exact) return term;
  const s = stem(term);
  if (s !== term && all.includes(s)) return s;
  // The everyday word for what the text calls something else.
  for (const alt of SAME[term] ?? SAME[s] ?? []) if (all.includes(alt)) return alt;
  // Two words typed as one: "seatbelt" is "seat belt".
  if (term.length >= 6)
    for (let i = 0; i + 1 < words.length; i++)
      if (
        term.startsWith(words[i]) &&
        term.length > words[i].length &&
        (words[i] + words[i + 1]).startsWith(term)
      )
        return `${words[i]} ${term.slice(words[i].length)}`;
  if (!typo || term.length < 4) return null;
  // The slip is looked for in the word and in its stem, so "speding" (stem
  // "sped") still meets "speed".
  for (const t of s !== term && s.length >= 4 ? [term, s] : [term]) {
    const cap = t.length >= 8 ? 2 : 1;
    for (const w of words) {
      if (w.length < 3) continue;
      for (let n = t.length - cap; n <= t.length + cap; n++) {
        const part = w.slice(0, n);
        // A slip of the whole word only: "polce" may meet "police", but a
        // four-letter word may not meet a three-letter one.
        if (part.length < n || part.length < 4) continue;
        if (edits(part, t, cap) <= cap) return part;
      }
    }
  }
  return null;
}

/**
 * A query split into its parts: plain words, "quoted runs" that must appear
 * as that run of words, and -minus words that must not appear. A hyphen
 * inside a word (NPF-4416) is not a minus.
 */
export function parse(query: string) {
  const phrases: string[] = [];
  const rest = query.replace(/"([^"]*)"?/g, (_, p: string) => {
    const words = terms(p).join(" ");
    if (words) phrases.push(words);
    return " ";
  });
  const minus: string[] = [];
  const plain = rest
    .split(/\s+/)
    .filter((w) => {
      if (w.length > 1 && w[0] === "-") {
        minus.push(...terms(w.slice(1)));
        return false;
      }
      return true;
    })
    .join(" ");
  return { words: terms(plain), phrases, minus };
}

export const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** One item's text, folded once for every query run against it. */
export type Folded = { all: string; words: string[]; padded: string };

export function folded(text: string): Folded {
  const all = fold(text);
  const words = split(all);
  return { all, words, padded: run(words) };
}

/**
 * The matcher behind every search box: each plain word has to land somewhere
 * (see locate), each quoted run has to appear in order from the start of a
 * word, and no minus word may appear. Returns, per item, the form each plain
 * word was found in — or null for an item that does not match.
 */
export function matcher(items: Folded[], query: string) {
  const parsed = parse(query);
  const { phrases, minus } = parsed;
  // "how do i get a police clearance" is a question, not six required words:
  // the small ones may match, but missing them never drops an item. A query
  // made of nothing else keeps them, or "for" would match everything.
  const words = parsed.words.some((w) => !STOP.has(w))
    ? parsed.words.filter((w) => !STOP.has(w))
    : parsed.words;
  const typo = words.map(
    (w) => !items.some((e) => locate(w, e.all, e.words, e.padded, false)),
  );
  const empty = !words.length && !phrases.length && !minus.length;
  return {
    words,
    phrases,
    empty,
    match(e: Folded): string[] | null {
      if (!phrases.every((p) => e.padded.includes(` ${p}`))) return null;
      if (minus.some((m) => e.all.includes(m))) return null;
      const forms: string[] = [];
      for (let i = 0; i < words.length; i++) {
        const at = locate(words[i], e.all, e.words, e.padded, typo[i]);
        if (!at) return null;
        forms.push(at);
      }
      return forms;
    },
  };
}

/** Question words and glue: matched when present, never required. */
const STOP = new Set(
  "a an the of for to in on at by and or with from my me i we you how do does can what where when is are get want need about please".split(
    " ",
  ),
);

/**
 * The filter for the small boards (requests, incidents, units): every query
 * word has to land somewhere in the item's text, in any order, hooks and
 * accents folded, a slip forgiven, "quotes" and -minus understood.
 */
export function filterBy<T>(items: T[], query: string, text: (item: T) => string) {
  const index = items.map((item) => ({ item, f: folded(text(item)) }));
  const m = matcher(
    index.map((e) => e.f),
    query,
  );
  if (m.empty) return items;
  return index.filter((e) => m.match(e.f)).map((e) => e.item);
}
