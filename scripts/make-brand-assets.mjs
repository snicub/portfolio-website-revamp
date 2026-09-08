// Builds the site's brand assets from its own palette and typeface:
//
//   • public/og-image.jpg — the card Google, iMessage, Slack, LinkedIn and X
//     show when the site is shared;
//   • public/og/<slug>.jpg — the same card per gallery entry. The entry
//     photographs are portraits, and a portrait fails X's aspect requirement
//     for a large card and gets centre-cropped everywhere else;
//   • public/logo192.png, logo512.png, apple-icon.png — the install and
//     home-screen icons, matching the "dh" monogram already in favicon.ico.
//
// Not part of the build: these change when the design does, not when the
// content does, and rewriting three binaries on every `next build` is only
// git noise. Run by hand: node scripts/make-brand-assets.mjs
import sharp from "sharp";
import ts from "typescript";
import { statSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const p = (...parts) => path.join(root, ...parts);

/**
 * The gallery entries, read from the app's own `src/lib/data.ts`.
 *
 * Transpiled with the TypeScript compiler already in devDependencies rather
 * than pattern-matched out of the file: this has to stay correct as the data
 * grows, and a regex over source is the kind of thing that silently returns
 * five of six entries.
 */
async function galleryEntries() {
  const source = readFileSync(p("src/lib/data.ts"), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });

  const tmp = path.join(tmpdir(), `data-${process.pid}-${Date.now()}.mjs`);
  writeFileSync(tmp, outputText);
  try {
    const { default: Data } = await import(pathToFileURL(tmp).href);
    return Data.galleryCardInfo;
  } finally {
    rmSync(tmp, { force: true });
  }
}

const W = 1200;
const H = 630;
const PHOTO_W = 470;
const PAD = 72;

const PAPER = "#f1f0ea";
const INK = "#121211";
const FONT = p("public/fonts/favorit.ttf");

/** A line of text, rendered through Pango with the site's own display face. */
async function text(value, { size, color = INK, spacing = 0, width }) {
  return sharp({
    text: {
      text: `<span letter_spacing="${spacing}" foreground="${color}">${value}</span>`,
      fontfile: FONT,
      font: `favorit ${size}`,
      rgba: true,
      dpi: 72 * 4,
      align: "left",
      ...(width ? { width: width * 4, wrap: "word" } : {}),
    },
  })
    .png()
    .toBuffer();
}

/** Scale a rendered text layer back down — Pango is run at 4× for crisp edges. */
async function layer(buffer) {
  const img = sharp(buffer);
  const { width, height } = await img.metadata();
  return {
    input: await img
      .resize(Math.round(width / 4), Math.round(height / 4), {
        fit: "inside",
        kernel: "lanczos3",
      })
      .png()
      .toBuffer(),
    height: Math.round(height / 4),
  };
}

/**
 * One monogram icon. Content is held inside the middle ~60% so the icon
 * survives Android's maskable crop, which can take everything outside a
 * centred circle of 80% of the canvas.
 */
async function icon(size) {
  const rendered = await layer(
    await text("dh", { size: Math.round(size * 0.5), color: INK }),
  );

  // Centre on the glyphs' own ink, not on Pango's line box — that box carries
  // ascender and descender space "dh" does not fill, which reads as the
  // monogram sitting low and off to one side.
  const mark = await sharp(rendered.input)
    .trim({ threshold: 1 })
    .png()
    .toBuffer();
  const { width, height } = await sharp(mark).metadata();

  return sharp({
    create: { width: size, height: size, channels: 3, background: PAPER },
  })
    .composite([
      {
        input: mark,
        left: Math.round((size - width) / 2),
        top: Math.round((size - height) / 2),
      },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/**
 * One share card: a text column on paper, a photograph down the right edge,
 * a hairline between them. `blocks` are stacked from a fixed top with the gap
 * that follows each one, so a two-line title pushes what is under it down
 * instead of colliding with it.
 */
async function card({ photo, blocks, out }) {
  const image = await sharp(p(photo))
    .resize(PHOTO_W, H, { fit: "cover", position: "attention" })
    .toBuffer();

  const composites = [
    { input: image, left: W - PHOTO_W, top: 0 },
    // A hairline between the type and the photograph, like the site's rules.
    {
      input: {
        create: {
          width: 1,
          height: H,
          channels: 4,
          background: { r: 18, g: 18, b: 17, alpha: 0.18 },
        },
      },
      left: W - PHOTO_W - 1,
      top: 0,
    },
  ];

  const rendered = [];
  for (const block of blocks) {
    rendered.push({
      layer: await layer(await text(block.text, block)),
      gap: block.gap ?? 0,
    });
  }

  // Centre the stack vertically, so a one-line and a two-line title both sit
  // as if the card were laid out for them.
  const stack = rendered.reduce((h, r) => h + r.layer.height + r.gap, 0);
  let y = Math.round((H - stack) / 2);

  for (const { layer: block, gap } of rendered) {
    composites.push({ input: block.input, left: PAD, top: y });
    y += block.height + gap;
  }

  await sharp({ create: { width: W, height: H, channels: 3, background: PAPER } })
    .composite(composites)
    .jpeg({ quality: 88, chromaSubsampling: "4:4:4" })
    .toFile(p(out));
}

/** Pango reads its input as markup — an ampersand in the copy would throw. */
const escapeMarkup = (value) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** First whole sentence, or a clean word-boundary cut. */
function truncate(value, max) {
  const clean = value.trim().replace(/\s+/g, " ");
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

async function main() {
  const COLUMN = W - PHOTO_W - PAD * 2;

  await card({
    photo: "public/images/enterpage/danAsher.webp",
    out: "public/og-image.jpg",
    blocks: [
      { text: "Daniel Han", size: 76, gap: 22 },
      { text: "Software Engineer", size: 34, gap: 30 },
      {
        text: "New Jersey. Currently building Nespresso.com.",
        size: 25,
        color: "#5c5c58",
        width: COLUMN,
        gap: 44,
      },
      { text: "snicub.com", size: 22, color: "#4a3ecb", spacing: 2400 },
    ],
  });

  const { size } = statSync(p("public/og-image.jpg"));
  console.log(`public/og-image.jpg — ${W}×${H}, ${(size / 1024).toFixed(0)} KB`);

  mkdirSync(p("public/og"), { recursive: true });
  for (const entry of await galleryEntries()) {
    await card({
      photo: `public${entry.img}`,
      out: `public/og/${entry.slug}.jpg`,
      blocks: [
        { text: "Daniel Han", size: 24, color: "#5c5c58", spacing: 2400, gap: 30 },
        { text: escapeMarkup(entry.title), size: 64, width: COLUMN, gap: 34 },
        {
          text: escapeMarkup(truncate(entry.info, 96)),
          size: 23,
          color: "#5c5c58",
          width: COLUMN,
        },
      ],
    });
    console.log(`public/og/${entry.slug}.jpg — ${W}×${H}`);
  }

  // The React atom these replaced was left over from Create React App: it was
  // the icon on every install prompt and iOS home screen on the site.
  for (const [file, px] of [
    ["public/logo192.png", 192],
    ["public/logo512.png", 512],
    ["public/apple-icon.png", 180],
  ]) {
    await sharp(await icon(px)).toFile(p(file));
    console.log(`${file} — ${px}×${px}`);
  }
}

main();
