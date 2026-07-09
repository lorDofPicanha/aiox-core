/**
 * Rasteriza design/icon.svg nos PNGs que o manifest e o iOS consomem.
 * Rode após qualquer mudança no SVG: `node scripts/gen-icons.mjs`
 */

import { fileURLToPath } from "node:url";
import path from "node:path";
import { mkdir, readFile } from "node:fs/promises";
import sharp from "sharp";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const publicDir = path.join(root, "public");

const TARGETS = [
  { file: "icon-192.png", size: 192 },
  { file: "icon-512.png", size: 512 },
  { file: "apple-touch-icon.png", size: 180 },
];

const svg = await readFile(path.join(root, "design", "icon.svg"));
await mkdir(publicDir, { recursive: true });

for (const { file, size } of TARGETS) {
  const out = path.join(publicDir, file);
  await sharp(svg, { density: 512 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(`✓ ${file} (${size}x${size})`);
}
