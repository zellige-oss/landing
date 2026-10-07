# Zellige landing — design

The public site at zellige.dev: a Vite + React app styled with Tailwind v4 and
shadcn components. The build prerenders Spanish (`/`, `/es/`) and English
(`/en/`) to static HTML and hydrates it; everything ships under a CSP that
allows only `'self'`. `public/locale.js` sends `/` to the browser's language.

## Narrative: four pages

Zellige is a tile made of many small stones; each stone is a way of using AI,
and Zel, the mascot, is the centre that holds them together.

1. **Hero** (`src/pages/Hero.tsx`): the brand. Wordmark, Zel, one line
   (self-hosted and open source) and "Bring your own: harness · sub · API key",
   kept in English as the jargon is. "Why Zellige?" beside the wordmark opens
   where the name comes from (`src/components/WhyZellige.tsx`): the literal
   meaning ("tile"), a line of history and a fun fact. It sits beside the
   wordmark on wide screens and in the flow on smaller ones, never over Zel. As
   the hero scrolls away, Zel flies, shrinking, into the header's logo.
2. **What is Zellige?** (`src/pages/Story.tsx`): the title stays in the sticky
   panel with the story. Zel stays in the centre of the tile and each scroll step
   shows one layer around it: chat (crown), the harness manager (blue), the
   personal agent (green). Each part is named with its layer and Zel at its centre.
   The whole tile comes last and briefly, with "Zellige is all of this" rising under
   it. On wide screens "How does it work?" then fades in in the same sticky panel, in the
   tile's place, without scrolling to it; on phones, where it is taller than the
   screen, it follows the story. Once the tile is whole, the tile and
   the parts point at each other: hovering a layer lifts it, with Zel, and lights
   up its part; hovering a part lifts its layer. Clicking or tapping a layer jumps
   to its step. "How does it work?" explains the
   setup and draws it: your devices reach your server over Tailscale; the server
   runs Zellige (its three layers on one shared memory) and reaches the models by
   API or OAuth. The story plays once, then settles; without JavaScript or with
   reduced motion it is a list.
3. **Bring your own** (`src/pages/Features.tsx`): "Bring your own", two cards. BYOK ·
   BYOS: your API keys, priced per token in the open, or a subscription you already
   pay for, signed in with OAuth (each tool's sign-in listed). BYOH: the
   open-source harness you choose (pi, OpenCode, oh-my-pi, DeepSeek Harness), as
   large tiles, or the one that comes with your subscription (Claude Code, Codex CLI). A bar below: on your server, one memory, change models without
   losing anything. Tool marks, in their official colours, live in
   `src/components/providers.tsx` and `src/assets/marks/`.
4. **Contact** (`src/pages/Contact.tsx`): the GitHub repository and the email,
   both set in `src/site.ts`, beside a mosaic panel still being laid
   (`src/components/TileInProgress.tsx`): as it comes into view the pieces slot in
   one by one; the corner's piece hovers over its place until you hover the section.

The header (`src/layout/Header.tsx`) carries the logo (Zel beside the wordmark)
and links named like each page's label; on phones they sit in a menu, each with a
piece of the tile, beside an icon button to the GitHub repository. The footer
(`src/layout/Footer.tsx`) is one line: logo, tagline, GitHub, email, back to top.
A mosaic band (`src/components/Band.tsx`) separates the pages.

## Zel

- `src/components/Companion.tsx`: Zel is the emblem itself, its four colour
  layers stacked, with an SVG face on the centre star (`ZelFace.tsx`). Each mood
  has eyes and body language: the tiles move in their own way per mood.
- `src/hooks/zel-motion.ts`: the hero's living Zel (wake-up, gaze, blinks, the
  greeting with its widening eyes and the layer spin). It writes each value
  straight onto the element that uses it, so phones never restyle all of Zel.
- `src/components/Trio.tsx`: the tile used by the story, and the glyphs that name
  its layers: `LayerGlyph` (the layer alone, in the phone menu) and `ZelGlyph`
  (the layer with Zel at its centre, `src/assets/glyph-*.webp`).

## Brand and ornament

Zellige ornament is for brand moments (wordmark, mosaic, logo, Zel); buttons
and UI stay plain and modern. Brand art and how it is generated are described
in [brand-assets.md](brand-assets.md). The font is local Onest (`public/fonts/`, SIL OFL);
the turn of a phrase keeps it and takes the accent colour.

## Checks

`src/__tests__/landing.test.mjs` checks the prerendered build: each page and
anchor exists, every asset is local, no inline scripts, styles or `data:` URIs,
contrast in both themes, hreflang pages, and links to GitHub only for the
project repository. Deployment checks live beside their scripts in
`scripts/__tests__/`; see [deployment/vercel.md](../deployment/vercel.md).
