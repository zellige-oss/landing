# Reusable Zellige brand assets

Source: the mascot identity board supplied by the user on 2026-10-02. Generated
with the built-in image tool using that board as the reference, not copied from
an unrelated stock library. AI extraction may reinterpret small details; these
are not vector originals. The source moodboard is not shipped in the website; everything in
`public/brand/` is, so the brand kit is downloadable from the site.

- `public/brand/zellige-emblem.png`: 1254 × 1254 RGBA PNG. **The single source**
  for every derived asset. Corrected on 2026-10-03: its top point is teal like the
  other three (it was cobalt, breaking the four-fold symmetry); the uncorrected
  original is kept at `openspec/design/proposals/zellige-emblem-original.png`.
- `public/brand/zel/zel-<mood>.png`: Zel, the mascot, for each mood (`hello`,
  `look`, `thinking`, `excited`, `curious`, `focused`, `wink`, `content`). Zel is
  the emblem with an obsidian face on the centre star. The pilot uses `zel-hello`.
- `public/brand/zellige-wordmark{,-night}.svg`: moodboard wordmark, day (navy)
  and night (porcelain); gold stars in both, from `scripts/build-wordmark.mjs`.
- `public/brand/logo/zellige-logo-{horizontal,zel-top,wordmark-top}{,-night}.png`: the
  logo, Zel (`zel-look`, eyes open, no expression) with the wordmark beside it,
  under it (`zel-top`) or over it (`wordmark-top`). Every version has a transparent
  ground; `-night` uses the night wordmark, for dark grounds. Built
  by `scripts/build-brand.mjs` from the images above, so it follows any
  change to the emblem, Zel's face or the wordmark.
- Landing: `src/assets/layer-{centre,crown,cobalt,points}.webp` (the
  emblem's colour layers), `layer-{cobalt,points}-joined.webp` (the blue and the
  green each joined into one piece, an X and a diamond, for the story to show on
  their own), `glyph-{crown,cobalt,points}.webp` (each layer, joined where it has
  one, with Zel at its centre), `emblem.webp`, `zel-mark.webp` (Zel for the header's
  logo, beside the wordmark) and `public/favicon.png`.
- `public/brand/zellige-ceramic-source.png`: the approved ceramic mosaic the
  landing's texture (`src/assets/ceramic.webp`) is cut from.

Regenerate everything derived with `npm run brand` after changing
the emblem or Zel's face (`src/components/ZelFace.tsx`, the same
component the landing renders). Never edit the outputs by hand, and do not
generate a second, slightly different mascot for any surface.

## Generation prompts

### Companion (superseded: the generated companion PNG was replaced by Zel on 2026-10-03)

Use case: background-extraction. Asset type: transparent PNG for the existing Zellige app welcome screen. Input image is the user's approved Zellige brand board. Isolate ONLY the friendly smiling ceramic star mascot shown prominently in the tablet mockup on the right (blue top point, teal side/bottom points, ivory petals, thin brass-gold seams, glossy black face with two happy ivory curved eyes). Preserve exactly that character identity, ceramic material, geometry, proportions and frontal orientation; this is asset extraction, not a new mascot design. Output ONE centered complete mascot on a genuinely transparent background, generous 10% clear margin. Include its tiny ceramic/gold sparkle at upper right and lower left if visible, no glow halo. No tablet, floor, backdrop, text, labels, other expressions, scenery, badges or UI. Clean alpha edges, sharp enough to display at 200px. Square canvas.

### Emblem

Use case: background-extraction. Asset type: transparent PNG brand mark for existing Zellige app sidebar and favicon. Input image is the user's approved Zellige brand board. Isolate ONLY the default geometric ceramic Zellige star emblem shown at the upper left, next to the word zellige; NOT the mascot. Preserve the original exact eight-point modular geometry and arrangement, navy/cobalt blue top/diagonal tiles, teal left/right/bottom tiles and teal central star, ivory inner tiles, thin brass-gold seams, rich slightly cracked glazed ceramic surface. No face, no eyes, no text or lettering, no added shapes. ONE centered complete brand emblem on genuinely transparent background, frontal view, balanced 8% clear margin, no shadow or glow outside the silhouette. Preserve identity rather than reinterpret. Square canvas.

