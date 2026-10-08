// Regenerates every derived brand asset from the emblem as the landing draws it
// (build-layers.mjs makes it from public/brand/zellige-emblem.png, with even pieces).
// Run `npm run brand` after changing the emblem or Zel's face; never edit these
// outputs by hand.
//   public/brand/zel/zel-<mood>.png   Zel (emblem + face), one per mood, 1254 px
//   src/assets/emblem.webp       landing emblem, 320 px
//   public/favicon.png           landing favicon, 64 px
//   public/brand/logo/zellige-logo-{horizontal,zel-top,wordmark-top}{,-night}.png   Zel + wordmark
//   src/assets/glyph-{crown,cobalt,points}.webp   each layer, joined where it has one, with Zel at its centre, 128 px
// (The emblem layers come from build-layers.mjs, which `npm run brand` runs first.)
import { existsSync } from 'node:fs';
import { mkdir, rm } from 'node:fs/promises';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const path = (relative) => fileURLToPath(new URL(relative, import.meta.url));
const emblem = path('../node_modules/.cache/zellige/emblem.png');
const { faces } = await import(path('../.brand/brand-entry.js'));

await mkdir(path('../public/brand/zel'), { recursive: true });
for (const [mood, svg] of Object.entries(faces())) {
  const out = path(`../public/brand/zel/zel-${mood}.png`);
  await sharp(emblem).resize(1254, 1254).composite([{ input: Buffer.from(svg) }]).png({ compressionLevel: 9 }).toFile(out);
  console.log(`zel-${mood}.png`);
}

// Logo lockups: Zel, looking ahead, with the wordmark beside it, below it or above
// it, on a transparent ground. Laid out in wordmark units (its viewBox: 0 40 1480 730;
// ascenders from y 200, baseline at 568, descender and stars inside the box).
const zel = await sharp(path('../public/brand/zel/zel-look.png')).trim().toBuffer({ resolveWithObject: true });
const zelRatio = zel.info.width / zel.info.height;
// Each layer's glyph with Zel at its centre, for the story's steps and the server
// diagram: the centre layer with Zel's face (look) on it, over the layer, as the
// landing stacks them (the assembled emblem shares its rims, the layers do not).
const centre = await sharp(path('../src/assets/layer-centre.webp')).resize(1254, 1254).png().toBuffer();
const zelCentre = await sharp(await sharp(centre).composite([{ input: Buffer.from(faces().look) }]).png().toBuffer())
  .resize(960, 960).png().toBuffer();
for (const piece of ['crown', 'cobalt', 'points']) {
  // The joined piece where the emblem splits the layer into four, as the story shows it.
  const joined = path(`../src/assets/layer-${piece}-joined.webp`);
  const glyph = await sharp(existsSync(joined) ? joined : path(`../src/assets/layer-${piece}.webp`)).resize(960, 960)
    .composite([{ input: zelCentre }]).png().toBuffer();
  await sharp(glyph).trim().resize(128, 128, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 90 }).toFile(path(`../src/assets/glyph-${piece}.webp`));
}
console.log('glyph-crown.webp, glyph-cobalt.webp, glyph-points.webp');
const WORD = { x: 0, y: 40, width: 1480, height: 730 };
const lockups = {
  // Zel taller than the ascenders, centred a little above the x-height's middle.
  horizontal: () => {
    const height = 560, width = height * zelRatio, gap = 100, pad = 60;
    return {
      width: pad + width + gap + WORD.width + pad, height: WORD.height + 2 * pad,
      zel: { left: pad, top: pad + (410 - WORD.y) - height / 2, width, height },
      word: { left: pad + width + gap, top: pad },
    };
  },
  // Zel above the word, centred on its letters (x 15 to 1454).
  'zel-top': () => {
    const height = 720, width = height * zelRatio, gap = 90, pad = 60;
    return {
      width: WORD.width + 2 * pad, height: pad + height + gap + WORD.height + pad,
      zel: { left: pad + 734 - width / 2, top: pad, width, height },
      word: { left: pad, top: pad + height + gap },
    };
  },
  // The word above Zel; the word's box already leaves room under the g's descender.
  'wordmark-top': () => {
    const height = 720, width = height * zelRatio, gap = 20, pad = 60;
    return {
      width: WORD.width + 2 * pad, height: pad + WORD.height + gap + height + pad,
      zel: { left: pad + 734 - width / 2, top: pad + WORD.height + gap, width, height },
      word: { left: pad, top: pad },
    };
  },
};
const SCALE = 1.25; // px per wordmark unit
await mkdir(path('../public/brand/logo'), { recursive: true });
for (const [name, layout] of Object.entries(lockups)) {
  const l = layout();
  const px = (n) => Math.round(n * SCALE);
  const zelImage = await sharp(zel.data).resize(px(l.zel.width), px(l.zel.height)).toBuffer();
  for (const night of [false, true]) {
    const word = await sharp(path(`../public/brand/zellige-wordmark${night ? '-night' : ''}.svg`), { density: 72 * SCALE }).png().toBuffer();
    const out = `zellige-logo-${name}${night ? '-night' : ''}.png`;
    await sharp({ create: { width: px(l.width), height: px(l.height), channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([
        { input: zelImage, left: px(l.zel.left), top: px(l.zel.top) },
        { input: word, left: px(l.word.left), top: px(l.word.top) },
      ])
      .png({ compressionLevel: 9 })
      .toFile(path(`../public/brand/logo/${out}`));
    console.log(out);
  }
}

await sharp(emblem).resize(320).webp({ quality: 90 }).toFile(path('../src/assets/emblem.webp'));
await sharp(emblem).resize(64).png().toFile(path('../public/favicon.png'));
await rm(path('../.brand'), { recursive: true, force: true });
console.log('emblem.webp, favicon.png');
