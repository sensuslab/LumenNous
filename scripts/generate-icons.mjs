/**
 * Generates the PWA icons (design.md §10 — "PWA icons: aperture gold-on-#0A0E1A,
 * 192/512px, safe-zone 80%"). Renders the aperture mark — a minimal gold
 * orbit-ring system on deep midnight — to PNG via sharp.
 *
 * Usage: node scripts/generate-icons.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const GOLD = "#D9BA85";
const BG = "#0A0E1A";

/** Aperture mark SVG: three concentric rings, outer broken at 45° with a
    gold dot seated at the gap, faint violet zenith glow beneath. */
function apertureSvg(size, ringRatio) {
  const c = size / 2;
  const rOut = size * ringRatio;
  const rMid = rOut * 0.64;
  const rIn = Math.max(rOut * 0.15, 2);
  const swOut = Math.max(size * 0.017, 2);
  const swMid = Math.max(size * 0.011, 1.5);
  const dotR = size * 0.034;

  const pt = (deg, r) => {
    const rad = (deg * Math.PI) / 180;
    return [c + r * Math.cos(rad), c - r * Math.sin(rad)];
  };
  const [x1, y1] = pt(56, rOut);
  const [x2, y2] = pt(34, rOut);
  const [dx, dy] = pt(45, rOut);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="zenith" cx="50%" cy="0%" r="90%">
      <stop offset="0%" stop-color="#6C5BB7" stop-opacity="0.16"/>
      <stop offset="55%" stop-color="#6C5BB7" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="${BG}"/>
  <rect width="${size}" height="${size}" fill="url(#zenith)"/>
  <path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${rOut.toFixed(1)} ${rOut.toFixed(1)} 0 1 0 ${x2.toFixed(1)} ${y2.toFixed(1)}"
        fill="none" stroke="${GOLD}" stroke-width="${swOut.toFixed(1)}" stroke-linecap="round"/>
  <circle cx="${c}" cy="${c}" r="${rMid.toFixed(1)}" fill="none" stroke="${GOLD}" stroke-opacity="0.72" stroke-width="${swMid.toFixed(1)}"/>
  <circle cx="${c}" cy="${c}" r="${rIn.toFixed(1)}" fill="${GOLD}"/>
  <circle cx="${dx.toFixed(1)}" cy="${dy.toFixed(1)}" r="${dotR.toFixed(1)}" fill="${GOLD}"/>
</svg>`;
}

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "icons");

const targets = [
  { file: "icon-192.png", size: 192, ratio: 0.34 },
  { file: "icon-512.png", size: 512, ratio: 0.34 },
  /* Maskable: keep the mark inside the 80% safe zone (max radius 0.40S
     including the seated gold dot) */
  { file: "icon-maskable-192.png", size: 192, ratio: 0.29 },
  { file: "icon-maskable-512.png", size: 512, ratio: 0.29 },
];

await mkdir(outDir, { recursive: true });
for (const t of targets) {
  const svg = Buffer.from(apertureSvg(t.size, t.ratio));
  await sharp(svg, { density: 384 }).png().toFile(join(outDir, t.file));
  console.log(`wrote public/icons/${t.file}`);
}
/* Keep the master SVG alongside for future exports. */
await writeFile(join(outDir, "aperture-master.svg"), apertureSvg(512, 0.34));
console.log("wrote public/icons/aperture-master.svg");
