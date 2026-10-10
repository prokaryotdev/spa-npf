/**
 * Renders app/opengraph-image.png — the share card every page falls back to
 * when it does not set its own. Run from the repo root:
 *   node scripts/gen-og-image.mjs
 *
 * The site's fonts are woff2, which the SVG rasteriser cannot read, so the
 * lettering is set in the system's Arial. The crest is the issued artwork.
 */
import fs from "node:fs";
import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;

const background = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0%" stop-color="#1b3f7a"/>
      <stop offset="60%" stop-color="#14315f"/>
      <stop offset="100%" stop-color="#0a1a35"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#g)"/>
  <text x="520" y="292" fill="#ffffff" font-family="Arial" font-weight="700" font-size="58" letter-spacing="1">NIGERIA POLICE</text>
  <text x="520" y="360" fill="#ffffff" font-family="Arial" font-weight="700" font-size="58" letter-spacing="1">FORCE</text>
  <text x="522" y="420" fill="#e6c766" font-family="Arial" font-size="28" letter-spacing="2">Safe · Secure · Together</text>
  <rect y="${HEIGHT - 10}" width="${WIDTH}" height="10" fill="#e6c766"/>
</svg>`);

const crest = await sharp(fs.readFileSync("public/brand/logo.png"))
  .resize({ height: 360, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();

await sharp(background)
  .composite([{ input: crest, left: 150, top: 125 }])
  .png()
  .toFile("app/opengraph-image.png");

console.log(`app/opengraph-image.png — ${WIDTH}x${HEIGHT}`);
