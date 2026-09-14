/**
 * Renders app/opengraph-image.png — the share card every page falls back to
 * when it does not set its own. Run from the repo root:
 *   node scripts/gen-og-image.mjs
 *
 * Built by compositing, not by drawing text: the site's fonts are woff2, which
 * no SVG rasteriser here can read, and the logo already carries the wordmark.
 */
import fs from "node:fs";
import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;

const background = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0%" stop-color="#123D2E"/>
      <stop offset="55%" stop-color="#0C2A20"/>
      <stop offset="100%" stop-color="#071912"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.82" cy="0.16" r="0.6">
      <stop offset="0%" stop-color="#3CBD6B" stop-opacity="0.42"/>
      <stop offset="100%" stop-color="#3CBD6B" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#g)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>
  <rect y="${HEIGHT - 10}" width="${WIDTH}" height="10" fill="#00925B"/>
</svg>`);

// The logo is dark artwork. Negating it just shifts the hue, so paint solid
// white through the logo's own alpha instead: `blend: "in"` keeps the white
// only where the artwork is opaque.
const shape = await sharp(fs.readFileSync("public/img/Dubai-Police.svg"))
  .resize({ width: 620, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toBuffer();
const { width, height } = await sharp(shape).metadata();

const logo = await sharp(shape)
  .composite([
    {
      input: {
        create: { width, height, channels: 4, background: "#ffffff" },
      },
      blend: "in",
    },
  ])
  .png()
  .toBuffer();

await sharp(background)
  .composite([{ input: logo, gravity: "centre" }])
  .png()
  .toFile("app/opengraph-image.png");

console.log(`app/opengraph-image.png — ${WIDTH}x${HEIGHT}`);
