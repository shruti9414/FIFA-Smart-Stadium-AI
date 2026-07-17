// One-off/reusable: rasterizes public/icons/icon.svg into the PNG sizes
// the manifest and Next metadata reference. Re-run after swapping in real
// brand art — nothing else needs to change.
import sharp from "sharp";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const dir = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.join(dir, "..", "public", "icons");

const svg = readFileSync(path.join(iconsDir, "icon.svg"));
const maskableSvg = readFileSync(path.join(iconsDir, "icon-maskable.svg"));

const targets = [
  { file: "icon-192.png", size: 192, src: svg },
  { file: "icon-256.png", size: 256, src: svg },
  { file: "icon-384.png", size: 384, src: svg },
  { file: "icon-512.png", size: 512, src: svg },
  { file: "icon-maskable-512.png", size: 512, src: maskableSvg },
  { file: "apple-touch-icon.png", size: 180, src: svg },
];

for (const t of targets) {
  await sharp(t.src).resize(t.size, t.size).png().toFile(path.join(iconsDir, t.file));
  console.log(`wrote ${t.file}`);
}
