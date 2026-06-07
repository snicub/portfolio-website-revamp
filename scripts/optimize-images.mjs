/**
 * Build-time image optimizer.
 *
 * For every image referenced from `src/` it:
 *   1. auto-orients (bakes EXIF rotation into pixels), caps the long edge to
 *      MAX_EDGE, and re-encodes to webp in place (replacing JPG/PNG sources).
 *   2. for gallery/PLP grid images, also emits a small `<name>-thumb.webp`
 *      used by the collage + gallery-card grids (the lightbox keeps the full image).
 *   3. writes a typed manifest to `src/lib/imageManifest.ts` (intrinsic
 *      dimensions + thumbnail paths) consumed by the grid components.
 *
 * Idempotent: already-optimized webp files (<= MAX_EDGE) and existing thumbnails
 * are skipped, so re-running it (e.g. via the `prebuild` hook) is cheap and lossless.
 *
 * Run with:  npm run optimize:images
 */
import sharp from "sharp";
import {
  readdirSync,
  readFileSync,
  writeFileSync,
  statSync,
  existsSync,
  rmSync,
} from "fs";
import { join, relative, dirname, basename, extname } from "path";

const ROOT = process.cwd();
const PUBLIC = join(ROOT, "public");
const SRC = join(ROOT, "src");

const MAX_EDGE = 2048; // full image cap (lightbox / full-bleed)
const THUMB_EDGE = 768; // grid thumbnail cap
const FULL_QUALITY = 78;
const THUMB_QUALITY = 70;
const EFFORT = 5;

const webToDisk = (web) => join(PUBLIC, web.replace(/^\//, ""));
const isGrid = (web) =>
  web.startsWith("/images/gallery/") || web.startsWith("/images/plp/");
const thumbPath = (web) => web.slice(0, -extname(web).length) + "-thumb.webp";
const longEdge = (m) => Math.max(m.width || 0, m.height || 0);

// 1. Collect every /images/... path referenced from source/config files.
// Skip the generated manifest itself — otherwise its own entries keep an image
// "referenced" forever and removals from data.ts never clean up.
const REF_RE = /\/images\/[A-Za-z0-9_\-./]+\.(?:webp|jpe?g|png|gif|avif)/gi;
const MANIFEST_FILE = join(SRC, "lib", "imageManifest.ts");
const referenced = new Set();
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(tsx?|json)$/.test(e.name) && p !== MANIFEST_FILE) {
      const txt = readFileSync(p, "utf8");
      for (const m of txt.matchAll(REF_RE)) referenced.add(m[0]);
    }
  }
})(SRC);

// Resolve the source file backing a (final, .webp) reference: itself if present,
// otherwise a same-basename sibling with a raster extension (the pre-conversion original).
function findSource(web) {
  const target = webToDisk(web);
  if (existsSync(target)) return target;
  const dir = dirname(target);
  if (!existsSync(dir)) return null;
  const base = basename(target, extname(target));
  for (const f of readdirSync(dir)) {
    if (
      basename(f, extname(f)) === base &&
      /\.(webp|jpe?g|png)$/i.test(f) &&
      !f.includes("-thumb.")
    ) {
      return join(dir, f);
    }
  }
  return null;
}

const manifest = {};
let fullBefore = 0; // size of full-image sources before this run
let fullAfter = 0; // size of full images after this run
let thumbBytes = 0; // size of grid thumbnails (additive)
const stats = { reencoded: 0, converted: 0, skipped: 0, thumbs: 0, missing: [] };

for (const web of [...referenced].sort()) {
  if (web.includes("-thumb.")) continue;
  if (extname(web).toLowerCase() !== ".webp") {
    // After the data.ts migration every reference should already be .webp.
    stats.missing.push(`${web} (not webp — update its reference)`);
    continue;
  }

  const src = findSource(web);
  if (!src) {
    stats.missing.push(web);
    continue;
  }

  const target = webToDisk(web);
  const srcMeta = await sharp(src).metadata();
  fullBefore += statSync(src).size;

  let outW;
  let outH;
  const alreadyOptimal =
    src === target && srcMeta.format === "webp" && longEdge(srcMeta) <= MAX_EDGE;

  if (alreadyOptimal) {
    outW = srcMeta.width;
    outH = srcMeta.height;
    stats.skipped++;
  } else {
    const { data, info } = await sharp(src)
      .rotate() // bake EXIF orientation before stripping metadata
      .resize({
        width: MAX_EDGE,
        height: MAX_EDGE,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: FULL_QUALITY, effort: EFFORT })
      .toBuffer({ resolveWithObject: true });
    writeFileSync(target, data);
    outW = info.width;
    outH = info.height;
    if (src !== target) {
      rmSync(src); // remove the original JPG/PNG now that the webp exists
      stats.converted++;
    } else {
      stats.reencoded++;
    }
  }
  fullAfter += statSync(target).size;

  if (!isGrid(web)) continue;

  // Grid thumbnail (generated from the optimized full image).
  const tWeb = thumbPath(web);
  const tDisk = webToDisk(tWeb);
  let tW;
  let tH;
  if (existsSync(tDisk)) {
    const tMeta = await sharp(tDisk).metadata();
    tW = tMeta.width;
    tH = tMeta.height;
  } else {
    const { data, info } = await sharp(target)
      .resize({
        width: THUMB_EDGE,
        height: THUMB_EDGE,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: THUMB_QUALITY, effort: EFFORT })
      .toBuffer({ resolveWithObject: true });
    writeFileSync(tDisk, data);
    tW = info.width;
    tH = info.height;
    stats.thumbs++;
  }
  thumbBytes += statSync(tDisk).size;
  manifest[web] = { w: outW, h: outH, thumb: tWeb, thumbW: tW, thumbH: tH };
}

// 2. Emit the typed manifest consumed by the grid components.
const entries = Object.keys(manifest)
  .sort()
  .map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(manifest[k])},`)
  .join("\n");

const manifestTs = `// AUTO-GENERATED by scripts/optimize-images.mjs — do not edit by hand.
// Run \`npm run optimize:images\` to regenerate.

export interface ResponsiveImage {
  /** intrinsic width of the full (capped) image */
  w: number;
  /** intrinsic height of the full (capped) image */
  h: number;
  /** path to the small grid thumbnail */
  thumb: string;
  thumbW: number;
  thumbH: number;
}

export const imageManifest: Record<string, ResponsiveImage> = {
${entries}
};

/**
 * Build responsive <img> props for a grid image. Defaults \`src\` to the small
 * thumbnail and offers the full image as a larger srcSet candidate, so grids load
 * tiny images while high-DPR / large slots can still upgrade. Falls back to the
 * original src for any image not in the manifest.
 */
export function responsive(src: string, sizes: string) {
  const m = imageManifest[src];
  if (!m) return { src, sizes };
  return {
    src: m.thumb,
    srcSet: \`\${m.thumb} \${m.thumbW}w, \${src} \${m.w}w\`,
    sizes,
  };
}
`;
writeFileSync(join(SRC, "lib", "imageManifest.ts"), manifestTs);

// 3. Report.
const mb = (b) => (b / 1e6).toFixed(2);
console.log("image optimization complete");
console.log(
  `  referenced images processed: ${
    stats.reencoded + stats.converted + stats.skipped
  } (converted ${stats.converted}, re-encoded ${stats.reencoded}, skipped ${stats.skipped})`
);
console.log(`  thumbnails generated this run: ${stats.thumbs}`);
console.log(`  manifest entries (grid images): ${Object.keys(manifest).length}`);
const savedFull = fullBefore - fullAfter;
if (savedFull > 1e5) {
  console.log(
    `  full images: ${mb(fullBefore)} MB → ${mb(fullAfter)} MB ` +
      `(−${mb(savedFull)} MB, ${((savedFull / fullBefore) * 100).toFixed(1)}% smaller)`
  );
} else {
  console.log(`  full images: ${mb(fullAfter)} MB (already optimized)`);
}
console.log(
  `  grid thumbnails: ${mb(thumbBytes)} MB across ${Object.keys(manifest).length} images`
);
if (stats.missing.length) {
  console.log("  ⚠ unresolved references:");
  for (const m of stats.missing) console.log(`     - ${m}`);
}
