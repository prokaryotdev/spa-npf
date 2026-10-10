/** Text matching shared by the site search and the Information tables. */

/**
 * One spelling per word.
 *
 * Hausa is written with four hooked letters — ɓ ɗ ƙ ƴ — and an apostrophe for
 * the glottal stop, none of which are on the keyboard most people search
 * from. They type "kasa" for "ƙasa" and "yan sanda" for "'yan sanda", and a
 * police site cannot answer "no results" because of a hook. The hooks fold to
 * their plain letters, the apostrophes drop, and Latin accents fold with
 * them. Applied to both the query and the index, so they always meet.
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
    .trim();

export const split = (s: string) => s.split(/[^\p{L}\p{N}]+/u).filter(Boolean);

// "police-clearance" and "police, clearance" are two words, like the titles.
export const terms = (query: string) => split(fold(query));

/** One slip apart: a letter wrong, missing, extra, or two swapped. */
export function near(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  while (i < a.length && a[i] === b[i]) i++;
  const rest = (x: number, y: number) => a.slice(x) === b.slice(y);
  return (
    rest(i + 1, i + 1) ||
    rest(i + 1, i) ||
    rest(i, i + 1) ||
    (a[i] === b[i + 1] && a[i + 1] === b[i] && rest(i + 2, i + 2))
  );
}

export const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * The filter for the small boards (requests, incidents, units): every query
 * word has to land somewhere in the item's text, in any order, hooks and
 * accents folded. A word found in no item is taken as a slip and matched one
 * letter off the start of a word, the same rule as the site search.
 */
export function filterBy<T>(items: T[], query: string, text: (item: T) => string) {
  // Two operator moves on top of the plain words: "road traffic" in quotes
  // has to appear as that run of words, and -closed drops anything with
  // "closed" in it. A hyphen inside a word (NPF-4416) is not a minus.
  const phrases: string[] = [];
  const rest = query.replace(/"([^"]*)"?/g, (_, p: string) => {
    const run = terms(p).join(" ");
    if (run) phrases.push(run);
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
  const words = terms(plain);
  if (!words.length && !phrases.length && !minus.length) return items;
  const index = items.map((item) => {
    const all = fold(text(item));
    const parts = split(all);
    return { item, all, split: parts, run: ` ${parts.join(" ")} ` };
  });
  const typo = words.map((w) => !index.some((e) => e.all.includes(w)));
  return index
    .filter(
      (e) =>
        phrases.every((p) => e.run.includes(` ${p}`)) &&
        !minus.some((m) => e.all.includes(m)),
    )
    .filter((e) =>
      words.every(
        (w, i) =>
          e.all.includes(w) ||
          (typo[i] &&
            w.length >= 4 &&
            e.split.some(
              (x) => near(x.slice(0, w.length), w) || near(x.slice(0, w.length + 1), w),
            )),
      ),
    )
    .map((e) => e.item);
}
