/**
 * Where a call or a unit sits on the board map.
 *
 * The seed calls and units carry a place name ("Ikeja, Lagos"), not a
 * position. These are APPROXIMATE town centres, good enough to put a dot in
 * the right city on a demo board; they are not survey positions and must not
 * be read as an incident's real location. A live CAD feed would send
 * coordinates and this table would go.
 *
 * Matched by keyword, longest first, so "Sabon Gari" wins over "Kano" and a
 * place an operator types into Take a call still lands if it names a known
 * town. Anything unmatched has no dot rather than a wrong one.
 */
const PLACES: [string, [number, number]][] = [
  // Roads and districts the seeds name.
  ["lagos–ibadan expressway", [6.93, 3.63]],
  ["kaduna–kano expressway", [11.09, 7.72]],
  ["victoria island", [6.4281, 3.4219]],
  ["trans-amadi", [4.8167, 7.0333]],
  ["sabon gari", [12.0136, 8.5302]],
  ["bonny river", [4.45, 7.17]],
  ["ring road", [6.335, 5.6037]],
  ["rayfield", [9.85, 8.9]],
  ["bodija", [7.43, 3.91]],
  ["lekki", [6.4698, 3.5852]],
  ["ikeja", [6.6018, 3.3515]],
  ["wuse", [9.0765, 7.4686]],
  ["zaria", [11.0855, 7.7199]],
  // State capitals and the largest towns.
  ["port harcourt", [4.8156, 7.0498]],
  ["benin city", [6.335, 5.6037]],
  ["birnin kebbi", [12.4539, 4.1975]],
  ["ado-ekiti", [7.6211, 5.2215]],
  ["abakaliki", [6.3249, 8.1137]],
  ["abeokuta", [7.1475, 3.3619]],
  ["maiduguri", [11.8311, 13.151]],
  ["damaturu", [11.747, 11.9608]],
  ["umuahia", [5.5249, 7.4942]],
  ["yenagoa", [4.9267, 6.2676]],
  ["calabar", [4.9757, 8.3417]],
  ["jalingo", [8.8937, 11.3596]],
  ["makurdi", [7.7322, 8.5391]],
  ["katsina", [12.9908, 7.6018]],
  ["onitsha", [6.1413, 6.7855]],
  ["owerri", [5.485, 7.035]],
  ["osogbo", [7.7827, 4.5418]],
  ["lokoja", [7.8023, 6.7333]],
  ["sokoto", [13.0059, 5.2476]],
  ["ibadan", [7.3775, 3.947]],
  ["ilorin", [8.4966, 4.5421]],
  ["kaduna", [10.5105, 7.4165]],
  ["bauchi", [10.3158, 9.8442]],
  ["abuja", [9.0765, 7.3986]],
  ["enugu", [6.4584, 7.5464]],
  ["akure", [7.2571, 5.2058]],
  ["asaba", [6.1987, 6.7337]],
  ["gombe", [10.2897, 11.1673]],
  ["gusau", [12.1704, 6.6641]],
  ["lafia", [8.4939, 8.5153]],
  ["minna", [9.6139, 6.5569]],
  ["dutse", [11.7564, 9.3383]],
  ["lagos", [6.5244, 3.3792]],
  ["warri", [5.5167, 5.75]],
  ["bonny", [4.45, 7.17]],
  ["awka", [6.2104, 7.0741]],
  ["kano", [12.0022, 8.592]],
  ["yola", [9.2035, 12.4954]],
  ["jos", [9.8965, 8.8583]],
  ["uyo", [5.0377, 7.9128]],
].sort((a, b) => b[0].length - a[0].length) as [string, [number, number]][];

/** The middle of the country, for the map's opening view. */
export const NIGERIA_CENTRE: [number, number] = [9.08, 8.68];

/**
 * A small, stable nudge per id, so two calls in the same town sit side by
 * side once the map is zoomed in, instead of one hiding the other. Same id,
 * same offset, every render.
 */
function nudge(id: string): [number, number] {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) | 0;
  const a = ((h >>> 0) % 360) * (Math.PI / 180);
  const r = 0.012 + ((h >>> 9) % 5) * 0.006;
  return [Math.sin(a) * r, Math.cos(a) * r];
}

export function placeOf(area: string, id: string): [number, number] | null {
  const name = area.toLowerCase();
  const hit = PLACES.find(([key]) => name.includes(key));
  if (!hit) return null;
  const [dy, dx] = nudge(id);
  return [hit[1][0] + dy, hit[1][1] + dx];
}
