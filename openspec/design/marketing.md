# Zellige landing — design

The public site at zellige.dev: a Vite + React app styled with Tailwind v4 and
shadcn components. The build prerenders Spanish (`/`, `/es/`) and English
(`/en/`) to static HTML and hydrates it; everything ships under a CSP that
allows only `'self'`. `public/locale.js` sends `/` to the browser's language.

## Narrative: four pages

Zellige is a tile made of many small stones; each stone is a way of using AI,
and Zel, the mascot, is the centre that holds them together.

1. **Hero** (`src/pages/Hero.tsx`): the brand. Wordmark, Zel and one line. A gold
   spark beside the wordmark opens where the name comes from ("Why Zellige?",
   `src/components/WhyZellige.tsx`). The emblem's layers fly in and lock around
   Zel, who wakes up. As the hero scrolls away, Zel flies, shrinking, into the
   header's logo; scrolling back flies it home.
2. **How it works** (`src/pages/Story.tsx`): what Zellige is. Zel stays in the centre
   of the tile and each scroll step shows one layer around it, one way of using
   Zel: the ivory crown is chat, the blue is the harness manager for building
   software with agents, the green points are the personal agent. The last step
   puts the whole tile together: set up your own server and reach all of it
   through Tailscale, from the desktop and mobile apps and the web. The story
   plays once; after the reader scrolls past, it settles into a still summary.
   Without JavaScript or with reduced motion it is a plain list.
3. **Features** (`src/pages/Features.tsx`): one pillar per layer, then what joins
   them: one story, on your own server, change models without losing it.
4. **Contact** (`src/pages/Contact.tsx`): the GitHub repository and the email,
   both set in `src/site.ts`.

The header (`src/layout/Header.tsx`) carries the logo (Zel beside the wordmark)
and links named like each page's label; on phones the links, and an icon button
to the GitHub repository, sit in a menu. The footer (`src/layout/Footer.tsx`) is
one line: logo, tagline, GitHub, email, back to top. A mosaic band
(`src/components/Band.tsx`) separates the pages.

## Zel

- `src/components/Companion.tsx`: Zel is the emblem itself, its four colour
  layers stacked, with an SVG face on the centre star (`ZelFace.tsx`). Each mood
  has eyes and body language: the tiles move in their own way per mood.
- `src/hooks/zel-motion.ts`: the hero's living Zel (wake-up, gaze, blinks, the
  greeting with its widening eyes and the layer spin). It writes each value
  straight onto the element that uses it, so phones never restyle all of Zel.
- `src/components/Trio.tsx`: the tile with its layer labels, used by the story.

## Brand and ornament

Zellige ornament is for brand moments (wordmark, mosaic, logo, Zel); buttons
and UI stay plain and modern. Brand art and how it is generated are described
in [brand-assets.md](brand-assets.md). Fonts are local Onest and Cormorant
Garamond (`public/fonts/`, SIL OFL).

## Checks

`src/__tests__/landing.test.mjs` checks the prerendered build: each page and
anchor exists, every asset is local, no inline scripts, styles or `data:` URIs,
contrast in both themes, hreflang pages, and links to GitHub only for the
project repository. Deployment checks live beside their scripts in
`scripts/__tests__/`; see [deployment/vercel.md](../deployment/vercel.md).
