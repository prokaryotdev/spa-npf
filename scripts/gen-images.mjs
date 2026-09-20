/**
 * Generates the site's photographs with Cloudflare Workers AI.
 *
 * The site launched on stock and Commons photographs, several of another
 * force. These are made to order instead, each framed for the slot it fills:
 * heroes leave the lower third empty for the caption and its scrim, cards are
 * 3:2, the pillar portraits are tall.
 *
 * Two rules run through every prompt, because they are where generated
 * photographs give themselves away:
 *   - No legible lettering anywhere. Signboards, door livery and name plates
 *     come out as garbled pseudo-text, so the framing is chosen to keep them
 *     out of shot or unreadable.
 *   - No invented insignia. Uniforms are described by colour and cut, never by
 *     badge, so nothing claims to be a real crest.
 *
 * Needs CF_ACCOUNT_ID and CF_API_TOKEN in .env.local. Run from the repo root:
 *   node scripts/gen-images.mjs            # everything still missing
 *   node scripts/gen-images.mjs hero       # only paths matching "hero"
 *   node scripts/gen-images.mjs --force …  # redo ones already on disk
 *
 * The free Workers AI allowance is 10,000 neurons a day, which is roughly six
 * of these. Nothing already on disk is regenerated, so a run resumes where the
 * allowance ran out: run it again the next day until it reports nothing left.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const MODEL = "@cf/leonardo/lucid-origin";

/** Shared tail — the look every photograph has to match. */
const LOOK =
  "shot on a full-frame DSLR, natural light, true-to-life colour, sharp " +
  "focus, high dynamic range, photojournalistic, no text, no lettering, no " +
  "signage, no watermark, no logos, no captions";

/** And the tail for anything showing officers. */
const FORCE =
  "West African officers in plain dark navy uniform with no visible badge or " +
  "crest. " +
  LOOK;

const CARD = { w: 1536, h: 1024 };
const WIDE = { w: 1920, h: 1280 };
const TALL = { w: 1280, h: 1920 };
const BAND = { w: 1920, h: 960 };
const THUMB = { w: 1280, h: 848 };

/**
 * One station exterior, varied by the ground it stands on. The signboard every
 * real station carries is deliberately out of frame — it is the one element
 * the model cannot render without inventing lettering.
 */
const station = (kind, setting) =>
  `Exterior of a ${kind} in Abuja, Nigeria, ${setting}. Photographed from ` +
  "across the road at a three-quarter angle, late afternoon, warm light. " +
  "Painted concrete walls, a covered veranda, louvre windows, a flagpole, a " +
  "few parked patrol vehicles in plain unlettered livery. The signboard is " +
  "out of frame and no lettering is readable anywhere. " +
  LOOK;

const AREA =
  "two-storey area command police headquarters with a walled compound";
const DIV =
  "single-storey divisional police station with a tin roof and a forecourt";

const IMAGES = [
  // --- Homepage hero -------------------------------------------------------
  {
    out: "cms/Home/hero/parade.jpg",
    ...WIDE,
    prompt:
      "Wide ceremonial parade ground in Abuja, Nigeria. Ranks of West African " +
      "police officers in dark navy dress uniform and peaked caps stand at " +
      "attention in the upper half of the frame, seen from a low angle. Empty " +
      "sunlit tarmac fills the bottom third. Green and white bunting, palm " +
      "trees and a modern government building behind. Golden morning light. " +
      LOOK,
  },
  {
    out: "cms/Home/hero/anniversary.jpg",
    ...WIDE,
    prompt:
      "A West African police honour guard in dark navy ceremonial uniform " +
      "carries a green and white national flag across the upper portion of " +
      "the frame. Backlit by warm late-afternoon sun, dust in the air, a " +
      "shallow crowd blurred far behind. The lower third is open shadowed " +
      "ground. Dignified, cinematic. " +
      LOOK,
  },
  {
    out: "cms/Home/hero/community.jpg",
    ...WIDE,
    prompt:
      "A West African police officer in a dark navy short-sleeved uniform " +
      "crouches to talk with schoolchildren on a clean Abuja street, warm and " +
      "relaxed, both smiling. Shot from across the street, subjects in the " +
      "upper two thirds, open pavement in the foreground. Soft late-afternoon " +
      "sun, green trees, modern low-rise buildings. " +
      LOOK,
  },
  {
    out: "cms/Home/hero/fleet.jpg",
    ...WIDE,
    prompt:
      "A row of new black and white police patrol SUVs parked in formation on " +
      "a wide Abuja boulevard at dusk, blue lightbars lit, photographed from " +
      "behind at a low three-quarter angle so no door lettering is legible. " +
      "Plain unlettered black and white livery. Vehicles sit in the upper " +
      "half, wet empty asphalt fills the foreground. Deep blue twilight sky, " +
      "palm trees and glass towers behind. " +
      LOOK,
  },

  // --- The three pillars, as tall portraits --------------------------------
  {
    out: "cms/gen/pillar-safe.jpg",
    replaces: "/cms/pillar-safe.jpg",
    ...TALL,
    prompt:
      "Vertical portrait of a West African police officer in dark navy " +
      "uniform standing on a quiet Abuja street at golden hour, calm and " +
      "confident, looking just off camera. Three-quarter length, shallow " +
      "depth of field, warm background bokeh of trees and low buildings. " +
      FORCE,
  },
  {
    out: "cms/gen/pillar-secure.jpg",
    replaces: "/cms/pillar-secure.jpg",
    ...TALL,
    prompt:
      "Vertical portrait of a West African family — a mother, a father and " +
      "two young children — standing together outside their home in a leafy " +
      "Abuja neighbourhood at dusk, warm and at ease. Soft window light " +
      "behind them, shallow depth of field. " +
      LOOK,
  },
  {
    out: "cms/gen/pillar-together.jpg",
    replaces: "/cms/pillar-together.jpg",
    ...TALL,
    prompt:
      "Vertical portrait of a West African police officer in dark navy " +
      "uniform and a market trader shaking hands and laughing in an open-air " +
      "Abuja market, mid-morning light, colourful produce blurred behind. " +
      FORCE,
  },

  // --- Smart policing cards ------------------------------------------------
  {
    out: "cms/gen/cybercrime.jpg",
    replaces: "/cms/e_Crime_92e4e26ff1.jpg",
    ...CARD,
    prompt:
      "A modern cybercrime analysis room, dim and blue-lit. A West African " +
      "analyst in a dark shirt works at a curved monitor showing abstract " +
      "network graphs, seen over the shoulder from behind so nothing on the " +
      "screen is readable. Clean desks, tidy cabling, one warm accent lamp. " +
      LOOK,
  },
  {
    out: "cms/gen/lost-and-found.jpg",
    replaces: "/cms/lost_and_found_a80bed6743.jpg",
    ...CARD,
    prompt:
      "A tidy lost property counter in a public building in Abuja. Neat " +
      "shelves of plain unlabelled cardboard boxes hold a phone, a set of " +
      "keys, a wallet and a backpack. A West African clerk in a dark navy " +
      "shirt hands a phone back across the counter to a relieved young woman. " +
      "Bright clean daylight. " +
      LOOK,
  },
  {
    out: "cms/gen/rescue-me.jpg",
    replaces: "/cms/Home/Police_Eye_s_0f82177537.jpg",
    ...CARD,
    prompt:
      "A West African police officer in dark navy uniform helps an elderly " +
      "woman across a sunlit Abuja street beside a parked patrol vehicle in " +
      "plain unlettered livery. Warm late-afternoon light, shallow depth of " +
      "field, unhurried and kind. " +
      FORCE,
  },

  // --- Land, water and air -------------------------------------------------
  {
    out: "img/gen/boat-bg.jpg",
    replaces: "/img/3d-static/boat-bg.jpg",
    ...WIDE,
    prompt:
      "A wide calm inland lake in Abuja at sunrise, low mist over the water, " +
      "green wooded shoreline and distant hills. A small unmarked patrol boat " +
      "sits far off in the upper third, tiny in the frame. Open glassy water " +
      "fills the lower half. Cool blue and gold light. " +
      LOOK,
  },
  {
    out: "img/gen/car-bg.jpg",
    replaces: "/img/3d-static/car-bg.jpg",
    ...WIDE,
    prompt:
      "A wide empty multi-lane boulevard in Abuja at dawn, seen head on down " +
      "the centre line. Palm trees, street lamps and modern glass buildings " +
      "recede toward a low sun. Clean asphalt fills the lower half. No " +
      "vehicles and no road signs. " +
      LOOK,
  },
  {
    out: "img/gen/drone-bg.jpg",
    replaces: "/img/3d-static/drone-bg.jpg",
    ...WIDE,
    prompt:
      "A high aerial view of Abuja, Nigeria at golden hour, looking down at " +
      "wide boulevards, roundabouts, green parkland and modern buildings, " +
      "with a rocky hill on the horizon. Soft haze, long shadows. " +
      LOOK,
  },

  // --- The five kinds of station -------------------------------------------
  {
    out: "cms/gen/station-command-hq.jpg",
    replaces: "/cms/Home/sps_original_53cd588de6.jpg",
    ...CARD,
    prompt: station(
      "large modern police command headquarters building",
      "four storeys of pale concrete and glass set behind a landscaped " +
        "forecourt and a flagpole",
    ),
  },
  {
    out: "cms/gen/station-area-command.jpg",
    replaces: "/cms/Home/sps_walkin_be3b2b3d66.jpg",
    ...CARD,
    prompt: station(AREA, "on a wide city-centre avenue lined with trees"),
  },
  {
    out: "cms/gen/station-divisional.jpg",
    replaces: "/cms/Home/sps_drive_thru_39157961d7.jpg",
    ...CARD,
    prompt: station(DIV, "with a public counter visible through open doors"),
  },
  {
    out: "cms/gen/station-post.jpg",
    replaces: "/cms/Home/sps_suburban_5da0e23641.jpg",
    ...CARD,
    prompt: station(
      "small rural police post",
      "a modest whitewashed building under a large tree at the edge of a " +
        "dusty satellite town, a single patrol pickup outside",
    ),
  },
  {
    out: "cms/gen/station-marine.jpg",
    replaces: "/cms/Home/sps_floating_e877217271.jpg",
    ...CARD,
    prompt:
      "A marine police base on the shore of an inland lake in Nigeria: a low " +
      "building beside a concrete jetty, two small unmarked patrol boats " +
      "moored alongside, green wooded banks behind. Late afternoon, calm " +
      "water. " +
      LOOK,
  },

  // --- Community programmes ------------------------------------------------
  {
    out: "cms/gen/pcrc.jpg",
    replaces: "/cms/positive_spirit_final_s_d8fef6b5f6.jpg",
    ...CARD,
    prompt:
      "A community meeting in a bright hall in Abuja: about fifteen West " +
      "African residents of mixed ages seated in a loose circle with two " +
      "police officers in dark navy uniform, one speaking, the others " +
      "listening. Daylight through tall windows, plastic chairs, plain walls. " +
      FORCE,
  },
  {
    out: "cms/gen/neighbourhood-watch.jpg",
    replaces: "/cms/Volutneer_86db1585d3.jpg",
    ...CARD,
    prompt:
      "A group of West African neighbourhood-watch volunteers in plain bright " +
      "yellow hi-vis vests stand together on a residential Abuja street at " +
      "dusk, relaxed and smiling, one police officer in dark navy uniform " +
      "among them. Warm street light. " +
      FORCE,
  },
  {
    out: "cms/gen/police-schools.jpg",
    replaces: "/cms/Hemaya_s_af272b586b.jpg",
    ...CARD,
    prompt:
      "A bright primary school classroom in Nigeria: West African children " +
      "aged seven to ten in neat uniforms at wooden desks, hands raised, a " +
      "teacher at the front. Sunlight through louvre windows, a plain green " +
      "chalkboard with nothing written on it. Warm, lively, hopeful. " +
      LOOK,
  },
  {
    out: "cms/gen/police-games.jpg",
    replaces: "/cms/e_Sport_75fdfaf219.jpg",
    ...CARD,
    prompt:
      "An athletics track in a stadium in Abuja at golden hour. Four West " +
      "African runners in plain unmarked sports kit sprint toward the camera " +
      "in the upper half of the frame, motion in their stride. Red track, " +
      "green infield, blurred stand behind. " +
      LOOK,
  },
  {
    out: "cms/gen/museum.jpg",
    replaces: "/cms/p8_1ee31a74c5.jpg",
    ...CARD,
    prompt:
      "The interior of a small history museum: glass display cases holding " +
      "vintage uniform tunics, brass buttons, old cameras and a 1930s " +
      "typewriter, lit by warm focused spotlights against dark walls. Blank " +
      "unlettered placards. Quiet and reverent, no visitors in shot. " +
      LOOK,
  },
  {
    out: "cms/gen/summit.jpg",
    replaces: "/cms/World_Summit_Police_30fd9f4d13.jpg",
    ...CARD,
    prompt:
      "A modern conference hall in Abuja during an international summit: " +
      "delegates in suits and in dark navy dress uniform seated at long " +
      "curved desks, a speaker at a lectern on a lit stage, seen from the " +
      "back of the room. Plain dark backdrop with nothing written on it. " +
      LOOK,
  },

  // --- Information pages ---------------------------------------------------
  {
    out: "img/gen/laws.jpg",
    replaces: "/img/information/Laws-and-legislation.jpg",
    ...BAND,
    prompt:
      "A close overhead view of an open leather-bound legal volume on a dark " +
      "wooden desk beside a wooden gavel and a pair of reading glasses, warm " +
      "window light from the left. The pages are turned far enough that no " +
      "words are readable. Shallow depth of field. " +
      LOOK,
  },
  {
    out: "img/gen/traffic-offences.jpg",
    replaces: "/img/information/blackpoints.jpg",
    ...BAND,
    prompt:
      "A busy Abuja intersection photographed from a pedestrian bridge in " +
      "late afternoon: cars and a minibus crossing, painted crossing stripes, " +
      "traffic lights, palm trees on the median. Long shadows, warm light, no " +
      "readable road signs or number plates. " +
      LOOK,
  },
  {
    out: "img/gen/speed-limits.jpg",
    replaces: "/img/information/Street-Speed-Limits.jpg",
    ...BAND,
    prompt:
      "A wide open highway outside Abuja at golden hour, photographed low " +
      "along the centre line, dry savannah and rocky outcrops on either side, " +
      "a single car far in the distance. Clean asphalt, painted lane markings " +
      "only, no road signs. " +
      LOOK,
  },

  // --- The twenty-four stations in the directory ---------------------------
  {
    out: "cms/gen/station-01.jpg",
    replaces: "/cms/7645_D9_85_D8_B1_D9_83_D8_B2_D8_A7_D9_84_D8_A8_D8_B1_D8_B4_D8_A7_D8_A1_705bc8ce9b.jpg",
    ...THUMB,
    prompt: station(AREA, "in the city centre, glass office towers rising behind it"),
  },
  {
    out: "cms/gen/station-02.jpg",
    replaces: "/cms/3152_KRM_9488_cf562f8589.jpg",
    ...THUMB,
    prompt: station(AREA, "in a university town, wide dusty road and mature trees"),
  },
  {
    out: "cms/gen/station-03.jpg",
    replaces: "/cms/6176_KRM_8062_50432d72da.jpg",
    ...THUMB,
    prompt: station(AREA, "below a rocky green hillside on the edge of town"),
  },
  {
    out: "cms/gen/station-04.jpg",
    replaces: "/cms/3193_image_7516066b91.jpg",
    ...THUMB,
    prompt: station(AREA, "on a busy suburban high street with market stalls opposite"),
  },
  {
    out: "cms/gen/station-05.jpg",
    replaces: "/cms/6519_MN_1448_832x440_388961a3ed.jpg",
    ...THUMB,
    prompt: station(AREA, "beside a main road junction with heavy traffic passing"),
  },
  {
    out: "cms/gen/station-06.jpg",
    replaces: "/cms/4513_N_B02736_832x440_450c673242.jpg",
    ...THUMB,
    prompt: station(AREA, "in a quiet farming town, open fields visible beyond"),
  },
  {
    out: "cms/gen/station-07.jpg",
    replaces: "/cms/5276_2_1_832x440_qq_59ebc12b9e.jpg",
    ...THUMB,
    prompt: station(DIV, "on a tree-lined government district street"),
  },
  {
    out: "cms/gen/station-08.jpg",
    replaces: "/cms/7038_3_M7_A5995_ac1d088ee2.jpg",
    ...THUMB,
    prompt: station(DIV, "in a commercial district, shopfronts on either side"),
  },
  {
    out: "cms/gen/station-09.jpg",
    replaces: "/cms/4377_N_B03597_optimized_f2d96b90c9.jpg",
    ...THUMB,
    prompt: station(DIV, "on a wide boulevard with a landscaped median"),
  },
  {
    out: "cms/gen/station-10.jpg",
    replaces: "/cms/3619_N_B04394_5e9017812e.jpg",
    ...THUMB,
    prompt: station(DIV, "in an affluent leafy district behind a low hedge"),
  },
  {
    out: "cms/gen/station-11.jpg",
    replaces: "/cms/7718_N_B02505_1_832x600_6c1d155fb6.jpg",
    ...THUMB,
    prompt: station(DIV, "on a quiet embassy street with high walls opposite"),
  },
  {
    out: "cms/gen/station-12.jpg",
    replaces: "/cms/5967_N_B04285_832x440_f0fd1f25ef.jpg",
    ...THUMB,
    prompt: station(DIV, "beside an open car park and a row of palms"),
  },
  {
    out: "cms/gen/station-13.jpg",
    replaces: "/cms/1737_N_B111_832x440_eb376c7ae5.jpg",
    ...THUMB,
    prompt: station(DIV, "on a residential street with parked cars along the kerb"),
  },
  {
    out: "cms/gen/station-14.jpg",
    replaces: "/cms/6706_N_B00942_eb37e765de.jpg",
    ...THUMB,
    prompt: station(DIV, "in a new housing estate, fresh paint and young trees"),
  },
  {
    out: "cms/gen/station-15.jpg",
    replaces: "/cms/2375_3_M7_A4443_35ae9361a2.jpg",
    ...THUMB,
    prompt: station(DIV, "at a wide roundabout in a planned suburb"),
  },
  {
    out: "cms/gen/station-16.jpg",
    replaces: "/cms/5871_3_M7_A4020_HDR_cb49d254e2.jpg",
    ...THUMB,
    prompt: station(DIV, "beside a dusty transport yard with lorries parked behind"),
  },
  {
    out: "cms/gen/station-17.jpg",
    replaces: "/cms/3031_3_M7_A5690_faf65a9220.jpg",
    ...THUMB,
    prompt: station(DIV, "at a timber and building-materials market"),
  },
  {
    out: "cms/gen/station-18.jpg",
    replaces: "/cms/5808_N_B04419_832x440_552369e48d.jpg",
    ...THUMB,
    prompt: station(DIV, "on the approach road to a motorway, open scrub behind"),
  },
  {
    out: "cms/gen/station-19.jpg",
    replaces: "/cms/8307_PDP_9241_194115ff1e.jpg",
    ...THUMB,
    prompt: station(DIV, "on a hillside road with rocky outcrops above"),
  },
  {
    out: "cms/gen/station-20.jpg",
    replaces: "/cms/8455_3_M7_A4544_832x440_4ae88b9d4c.jpg",
    ...THUMB,
    prompt: station(DIV, "near the airport road, flat open ground on both sides"),
  },
  {
    out: "cms/gen/station-21.jpg",
    replaces: "/cms/510_N_B02759_832x440_718691f996.jpg",
    ...THUMB,
    prompt: station(DIV, "beside a small roadside food market at dusk"),
  },
  {
    out: "cms/gen/station-22.jpg",
    replaces: "/cms/3547_3_S2_A3181_df17026e53.jpg",
    ...THUMB,
    prompt: station(DIV, "on a dense residential street with overhead cables"),
  },
  {
    out: "cms/gen/station-23.jpg",
    replaces: "/cms/5454_N_B02391_3_832x600_4c752f6670.jpg",
    ...THUMB,
    prompt: station(DIV, "at the edge of a dense neighbourhood, hills on the skyline"),
  },
  {
    out: "cms/gen/station-24.jpg",
    replaces: "/cms/7097_N_B04423_67f2cabe86.jpg",
    ...THUMB,
    prompt: station(DIV, "beside an airport perimeter road, low flat terminal behind"),
  },
];

for (const line of fs.readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
  if (m) process.env[m[1]] ??= m[2];
}
const { CF_ACCOUNT_ID, CF_API_TOKEN } = process.env;
if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
  console.error("CF_ACCOUNT_ID and CF_API_TOKEN must be set in .env.local");
  process.exit(1);
}

const args = process.argv.slice(2);
const force = args.includes("--force");
const filters = args.filter((a) => a !== "--force");

const wanted = IMAGES.filter(
  (i) =>
    (!filters.length || filters.some((f) => i.out.includes(f))) &&
    (force || !fs.existsSync(path.join("public", i.out))),
);

if (!wanted.length) {
  console.log("nothing to generate");
  process.exit(0);
}
console.log(`${wanted.length} to generate`);

for (const { out, w, h, prompt } of wanted) {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${MODEL}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        width: w,
        height: h,
        steps: 40,
        guidance: 4.5,
      }),
    },
  );

  const body = await res.json();
  if (!res.ok || !body.result?.image) {
    console.error(
      `${out}: ${res.status} ${JSON.stringify(body.errors ?? body).slice(0, 200)}`,
    );
    // The daily allowance is gone, and everything after this would fail the
    // same way. Stop, and let the next run pick up where this one left off.
    if (res.status === 429) {
      console.error("daily allowance spent — run again tomorrow to continue");
      process.exit(1);
    }
    process.exitCode = 1;
    continue;
  }

  const file = path.join("public", out);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  // The model honours the aspect ratio but not always the exact pixels, and
  // every card in a row has to be the same size to avoid a layout shift.
  await sharp(Buffer.from(body.result.image, "base64"))
    .resize(w, h, { fit: "cover" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(file);

  console.log(`${out}  ${(fs.statSync(file).size / 1024).toFixed(0)}KB`);
}
// Point the content files at everything that is now on disk. Done in one pass
// at the end rather than per image so a part-finished run still leaves the
// site consistent: a slot shows the generated photograph or the old one, never
// a missing file.
let rewired = 0;
for (const file of fs.readdirSync("app").filter((f) => /^content.*.ts$/.test(f))) {
  const at = path.join("app", file);
  const before = fs.readFileSync(at, "utf8");
  let after = before;
  for (const i of IMAGES) {
    if (!i.replaces || !fs.existsSync(path.join("public", i.out))) continue;
    after = after.split(`"${i.replaces}"`).join(`"/${i.out}"`);
  }
  if (after === before) continue;
  fs.writeFileSync(at, after);
  rewired++;
}
console.log(`${rewired} content file(s) rewired`);
