/**
 * Replaces the mirrored Dubai Police photographs with freely licensed
 * Nigerian ones from Wikimedia Commons.
 *
 * Every entry below was picked by hand against the caption it sits under —
 * a blind "first search hit" run put protest photographs and a bombed-out
 * station on a police portal. Re-running is safe; it overwrites in place.
 *
 * The Dubai cut-outs the first pass left behind — the Burj Khalifa, the marina
 * silhouette, the Ghiath patrol car, the "DUBAI POLICE" boat, the halftone
 * portraits — are gone rather than re-sourced: nobody publishes a freely
 * licensed transparent PNG of an NPF patrol car or the Abuja skyline, and a
 * circle punched out of a photograph is a worse lie than no cut-out at all.
 * The three sections that leaned on them now carry photographs full-bleed.
 *
 *   node scripts/fetch-nigeria-images.mjs
 */
import fs from "node:fs";
import path from "node:path";

const UA = "spa-npf-image-sourcing/1.0 (https://github.com/prokaryotdev/spa-npf)";
const WIDTH = 1600;

/** target path under public/ -> Commons file title (without the File: prefix) */
const picks = {
  // --- Smart policing cards ------------------------------------------------
  "cms/e_Crime_92e4e26ff1.jpg": "Nile.University Computer Laboratory 05.jpg",
  "cms/lost_and_found_a80bed6743.jpg": "Garki International Market 07.jpg",
  "cms/Home/Police_Eye_s_0f82177537.jpg": "A COVID-19 Response Ambulance.jpg",

  // --- The five kinds of station ------------------------------------------
  // Each of these carries the Force's own signboard, so the card names the
  // rank of counter it shows rather than leaving the reader to guess.
  "cms/Home/sps_original_53cd588de6.jpg": "The Nigeria police force.jpg", // Abakaliki State HQ
  "cms/Home/sps_walkin_be3b2b3d66.jpg": "Zaria Old Police Station.jpg",
  "cms/Home/sps_drive_thru_39157961d7.jpg": "Ilupeju Police Station.jpg", // "Ilupeju Division"
  "cms/Home/sps_suburban_5da0e23641.jpg": "Obudu police station.jpg", // signed "Police Post"
  // The Marine base keeps the lake itself: the copy names Jabi, and the one
  // marine station on Commons (Oron) is a derelict shed.
  "cms/Home/sps_floating_e877217271.jpg": "Jabi boat club, jabi lake. Abuja.jpg",

  // --- Community and initiatives ------------------------------------------
  "cms/positive_spirit_final_s_d8fef6b5f6.jpg":
    '"NSC- Organized community Empowerment Workshop featuring guest speaker Ubong Essien, CSP, engaging participants in group discussions.".".jpg',
  "cms/Volutneer_86db1585d3.jpg":
    "2014 01 06 Nigeria Formed Police Unit Police Replacement and Rotation 14 (11798245774).jpg",
  "cms/Hemaya_s_af272b586b.jpg": "A classroom of students (7138907393).jpg",
  "cms/e_Sport_75fdfaf219.jpg": "Abuja Stadium 02.jpg",
  "cms/p8_1ee31a74c5.jpg": "National Museum Lagos-Inside museum segment.jpg",
  "cms/World_Summit_Police_30fd9f4d13.jpg":
    "The UN Security Council attends a UN ECOWAS meeting (33217575491).jpg",

  // --- Safe / Secure / Together, the three pinned pillars ------------------
  // One photographer, one deployment, so the three read as a set the way the
  // halftone portraits they replace did. All CC0.
  "cms/pillar-safe.jpg":
    "2014 01 06 Nigeria Formed Police Unit Police Replacement and Rotation 07 (11797801835).jpg",
  "cms/pillar-secure.jpg":
    "2014 01 06 Nigeria Formed Police Unit Police Replacement and Rotation 15 (11798253434).jpg",
  "cms/pillar-together.jpg":
    "2014 01 06 Nigeria Formed Police Unit Police Replacement and Rotation 17 (11798186144).jpg",

  // --- Water / ground / sky, now one photograph each -----------------------
  // These three carry their whole panel since the vehicle cut-outs went, so
  // each has to show the domain itself, not scenery near it.
  "img/3d-static/boat-bg.jpg":
    "A boatman paddles over the wide length of man-made Jabi Lake in the heart of Abuja.jpg",
  "img/3d-static/car-bg.jpg": "A police officer coordinating traffic.jpg",
  "img/3d-static/drone-bg.jpg": "Aerial photograph of trees at Guzape, Abuja.jpg",
  // The closing shot. Dusk over Abuja from Katampe, which lands on the navy
  // the section is painted in; the file keeps its old name, like every other
  // mirrored asset here.
  "img/assets-home/static/smart/Sky-2.jpg": "Katampe Hill Abuja.jpg",

  // --- Information pages ---------------------------------------------------
  "img/information/Laws-and-legislation.jpg": "National Assembly Complex, Abuja.jpg",
  // The LASTMA officer this replaces is a tall snapshot whose foreground is
  // roadside litter; cropped to the index card it showed the rubbish and not
  // the road. This one is shot wide, which is the shape the card wants.
  "img/information/blackpoints.jpg":
    "A view from Berger overhead bridge in Lagos.jpg",
  "img/information/Street-Speed-Limits.jpg":
    "Traffic light and roads signs on the Opebi Road.jpg",

  // --- Area Commands and Divisions, in content-footer.ts order -------------
  "cms/7645_D9_85_D8_B1_D9_83_D8_B2_D8_A7_D9_84_D8_A8_D8_B1_D8_B4_D8_A7_D8_A1_705bc8ce9b.jpg":
    "Tafawa Balewa Way.jpg", // Central Area Command, Area 10 Garki
  "cms/3152_KRM_9488_cf562f8589.jpg": "Gwagwalada Road Abuja.jpg",
  "cms/6176_KRM_8062_50432d72da.jpg": "Kubwa Rock, Abuja.jpg", // Bwari
  "cms/3193_image_7516066b91.jpg": "Sunrise in Kubwa, Abuja, Nigeria.jpg",
  "cms/6519_MN_1448_832x440_388961a3ed.jpg":
    "The Karu Water Fall Besides a Tree 2.jpg",
  "cms/4513_N_B02736_832x440_450c673242.jpg": "Kuje Post Office, Kuje -FCT Abuja.jpg",
  "cms/5276_2_1_832x440_qq_59ebc12b9e.jpg":
    "Road traffic and confiscation around CBN junction Garki Abuja.jpg",
  "cms/7038_3_M7_A5995_ac1d088ee2.jpg":
    "WUSE MARKET ENTRANCE GATE ABUJA NIGERIA.jpg",
  "cms/4377_N_B03597_optimized_f2d96b90c9.jpg": "Panorama view of wuse 2, Abuja.jpg",
  "cms/3619_N_B04394_5e9017812e.jpg":
    "Ventures park entrance - 5 Kwaji close Maitama.jpg",
  "cms/7718_N_B02505_1_832x600_6c1d155fb6.jpg": "Asokoro Abuja green area 01.jpg",
  "cms/5967_N_B04285_832x440_f0fd1f25ef.jpg": "Traffic junction at Utako Abuja.jpg",
  "cms/1737_N_B111_832x440_eb376c7ae5.jpg": "Jabi Lake Abuja from bridge.jpg",
  "cms/6706_N_B00942_eb37e765de.jpg":
    "Passengers boarding BRT at Life Camp, Abuja by Dike Chukwuma.jpg",
  "cms/2375_3_M7_A4443_35ae9361a2.jpg": "A view from under The bridge.jpg", // Gwarinpa
  "cms/5871_3_M7_A4020_HDR_cb49d254e2.jpg": "Major bus stop in Abuja, Nigeria.jpg", // Karmo
  "cms/3031_3_M7_A5690_faf65a9220.jpg": "Rock View, Dei-Dei Abuja.jpg",
  "cms/5808_N_B04419_832x440_552369e48d.jpg":
    "Mini Market at Zuba, Abuja, along the roadside.jpg",
  "cms/8307_PDP_9241_194115ff1e.jpg": "Gwagwalada Giri Road Abuja 3.jpg", // Dutse-Alhaji
  "cms/8455_3_M7_A4544_832x440_4ae88b9d4c.jpg": "Abuja Highway Panoramic.jpg", // Lugbe
  "cms/510_N_B02759_832x440_718691f996.jpg":
    "Apo legislative Quarters Juma'at Mosque.jpg",
  "cms/3547_3_S2_A3181_df17026e53.jpg": "Woman Crossing Street - Abuja.jpg", // Durumi
  "cms/5454_N_B02391_3_832x600_4c752f6670.jpg": "Nyanya traffic, Abuja Nigeria.jpg",
  "cms/7097_N_B04423_67f2cabe86.jpg":
    "At Nnamdi Azikiwe International Airport 02.jpg",
};

const strip = (html) =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

const titles = [...new Set(Object.values(picks))];
const meta = new Map();

// The API takes up to 50 titles per call, which covers the whole list.
for (let i = 0; i < titles.length; i += 45) {
  const url =
    "https://commons.wikimedia.org/w/api.php?" +
    new URLSearchParams({
      action: "query",
      format: "json",
      titles: titles
        .slice(i, i + 45)
        .map((t) => `File:${t}`)
        .join("|"),
      prop: "imageinfo",
      iiprop: "url|extmetadata",
      iiurlwidth: String(WIDTH),
    });
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  const json = await res.json();
  // Commons silently normalises titles (underscores, capitalisation); map back.
  const back = new Map((json.query?.normalized ?? []).map((n) => [n.to, n.from]));
  for (const page of Object.values(json.query?.pages ?? {})) {
    const key = (back.get(page.title) ?? page.title).replace(/^File:/, "");
    const ii = page.imageinfo?.[0];
    if (!ii) {
      console.error(`no such file on Commons: ${key}`);
      continue;
    }
    meta.set(key, {
      src: ii.thumburl ?? ii.url,
      page: ii.descriptionurl,
      author: strip(ii.extmetadata?.Artist?.value ?? "Unknown"),
      licence: strip(ii.extmetadata?.LicenseShortName?.value ?? "see file page"),
    });
  }
}

const credits = [];
let written = 0;

for (const [target, title] of Object.entries(picks)) {
  const m = meta.get(title);
  if (!m) {
    console.error(`skipped ${target}: no metadata for "${title}"`);
    continue;
  }
  const res = await fetch(m.src, { headers: { "User-Agent": UA } });
  if (!res.ok) {
    console.error(`skipped ${target}: ${res.status} fetching "${title}"`);
    continue;
  }
  const out = path.join("public", target);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  credits.push(
    `| \`/${target}\` | [${title}](${m.page}) | ${m.author} | ${m.licence} |`,
  );
  written++;
  console.log(`${target}  <-  ${title}`);
}

fs.writeFileSync(
  "IMAGE-CREDITS.md",
  `# Image credits

Every photograph listed here comes from Wikimedia Commons and is reused under
the licence named in the last column. Most are CC BY-SA, which obliges us to
keep this attribution with the work — do not delete this file, and surface it
from the site before going live.

Regenerate with \`node scripts/fetch-nigeria-images.mjs\`.

| File | Source | Author | Licence |
| --- | --- | --- | --- |
${credits.join("\n")}
`,
);

console.log(`\n${written}/${Object.keys(picks).length} images written`);
