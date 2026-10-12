# Zellige landing — design

The public site at zellige.dev: a Vite + React app styled with Tailwind v4 and
shadcn components. The build prerenders Spanish (`/`, `/es/`) and English
(`/en/`) to static HTML and hydrates it; everything ships under a CSP that
allows only `'self'`. `/` is the Spanish page; `public/locale.js` sends readers of other languages on from it.

Adding `?perf` to any address shows a frame meter (`public/perf.js`, loaded by
`locale.js` only then). It is for reading on a real phone what a desktop cannot
show: frames the main thread lost while the page loaded and while it scrolled,
when the longest waits happened, when the page painted, when its script started
and when it was live (`zellige:script` and `zellige:ready` marks), the screen's
frame rate and whether the browser has scroll timelines. It warns when it is
reading the dev server, which is far slower than the built site.

## Narrative: four pages

Zellige is a tile made of many small stones; each stone is a way of using AI.
Zel, the mascot, is the whole tile: it divides into three parts, one for each way
of using Zellige. It arrives whole, then the scroll introduces its parts.

1. **Hero** (`src/pages/Hero.tsx`): the brand. Wordmark, Zel, one line
   (self-hosted and open source) and "Bring your own: harness · sub · API key"
   ("Conecta tu harness · suscripción · clave de API" in Spanish). As
   the hero scrolls away, only the wordmark moves into the header. Zel stays in
   the hero until it drops into "What is Zellige?": then the hero's Zel leaves
   downwards, so the two are never on screen together, and it returns when the
   reader scrolls back up. There is no down-arrow button.
2. **What is Zellige?** (`src/pages/Story.tsx`): the title stays in the sticky
   panel with the story. The complete Zel arrives with open eyes, turning in
   perspective from above. Its landing compresses, rebounds and settles through
   the ceramic layers, with a brief ground shadow. On small screens and touch
   devices it still drops in from above, as if it had followed the reader down
   from the hero: the whole character falls almost twice its height in 2D,
   flattens as it lands and bounces once (950 ms, transform and opacity only),
   without the perspective, the separate layer recoil or the landing shadow. Each scroll step then
   shows one layer around it: the personal agent (ivory crown), the harness manager
   (blue), then chat (green). Each part is named with its layer and Zel at its centre.
   Each part plays its gesture as soon as it takes the stage. Chat leads straight
   into "How does it work?", without a second assembled tile or summary. In the
   opening tile, hovering a layer lifts it, with Zel. The parts in the text do not
   answer to hovering: only scrolling and clicking move the story. Clicking or tapping a layer jumps
   to its step, as do the three progress buttons. The stage shows that part at once, while the page scrolls to it, instead of
   passing through the parts between. "How does it work?" explains the
   setup and draws it: your devices reach your server over Tailscale; the server
   runs Zellige (its three layers on one shared memory) and reaches the models by
   API or OAuth. Scrolling back retraces the story, including on return visits;
   its height stays stable rather than collapsing when finished. Without JavaScript
   or with reduced motion it is a list. On phones, each part gets its own readable
   panel; the progress buttons also let readers move directly between the parts.
3. **How it works** (`src/pages/Features.tsx`): a three-sentence introduction and one
   diagram with three aligned blocks: devices, server, and external providers.
   Devices reach the server over Tailscale. Inside its boundary, a harness and shared
   memory lead to two routes: local open models and credentials for external inference.
   The providers can serve open or proprietary models; openness is not a hosting location.
   Harness and local-model examples sit in a compact shared legend below the flow,
   within the same figure. Below 1100 px the flow stacks vertically.
   There are no disclosures. `#harness` and `#acceso` link to visible regions. A 12 s
   animation alternates local and external inference, with reduced-motion support.
   Tool marks keep their official colours (`src/components/providers.tsx` and
   `src/assets/marks/`).
4. **Contact** (`src/pages/Contact.tsx`): the GitHub repository and the email,
   both set in `src/site.ts`, in compact buttons matching the header's GitHub control,
   beside a mosaic panel still being laid
   (`src/components/TileInProgress.tsx`): the loose corner waits beside its gap;
   clicking it sends it along the guide into place, and clicking again lifts it out.
   The title is white. "Why Zellige?" is an always-visible definition under the
   mosaic: a heading between fine rules, the name's Arabic origin in larger type,
   its meaning in gold, and a short connection to the parts of Zellige. On phones the
   figure follows the invitation and contact links.

The header (`src/layout/Header.tsx`) pairs the wordmark with one `cta-secondary`
GitHub link, labelled on phones too. Its border and background appear immediately
after the first 8 px of scroll, independently of the wordmark's trip. Small screens
and touch devices use an opaque surface without backdrop blur.
The release version is a small text link
beside the large hero wordmark, pointing to that release (or the releases page
when none is available). Below it, a small construction icon accompanies the
single status "Work in progress", independently of the GitHub action. There is no extra
releases button or disclosure.
There are no section links in the header at any screen size. The footer
(`src/layout/Footer.tsx`) is one line: logo, tagline, GitHub, email, back to top.
A quiet divider (`src/components/Band.tsx`) separates the pages: a brass hairline
with three small tiles in the colours of Zel's parts.

## Zel

- `src/components/Companion.tsx`: Zel is the emblem itself, its four colour
  layers stacked, with an SVG face on the centre star (`ZelFace.tsx`). Each mood
  has eyes and body language: the tiles move in their own way per mood.
- `src/hooks/zel-motion.ts`: the hero's living Zel (wake-up, gaze, blinks, the
  greeting with its widening eyes and the layer spin). It writes each value
  straight onto the element that uses it, so phones never restyle all of Zel.
- `src/hooks/zel-eyes.ts`: the story's eye gestures. The ivory personal agent
  goes to its errands, without leaving the stage: three to-dos wait around it, and
  it walks to each in turn, gulps it, works on it a moment and leaves it back in its
  place as a different pill (a dashed to-do such as "Dentist" becomes a green "Appointment booked"); a new to-do pops up there later. Body and errands are CSS animations on one clock (`agent-body`,
  `agent-lane-*`, `agent-task` in `styles.css`), which run off the main thread; the
  eyes read that clock, so the three stay together. The blue harness manager is mildly annoyed, with a low
  lid and sideways glance, then a brief spark when its work is done.
  Eye gestures pause off screen and stay still with reduced motion.
  Chat is the attentive green character, with its quick wink and a nearby typing bubble.
  The parts read Personal agent, Harness manager, Chat in the story and diagram.
- `src/components/Trio.tsx`: the tile used by the story, and the glyphs that name
  its layers: `ZelGlyph` (the layer with Zel at its centre,
  `src/assets/glyph-*.webp`). Like the hero, the story uses the actual layer stack
  rather than the shared-rim overlay. The selected layer, centre and face lift by
  the same distance with identical timing, so the crown's seam never opens.

## Brand and ornament

Zellige ornament is for brand moments (wordmark, mosaic, logo, Zel); buttons
and UI stay plain and modern. Brand art and how it is generated are described
in [brand-assets.md](brand-assets.md). The font is local Onest (`public/fonts/`, SIL OFL);
the turn of a phrase keeps it and takes the accent colour.

## Checks

`src/__tests__/landing.test.mjs` checks the prerendered build: each page and
anchor exists, every asset is local, no inline scripts, styles or `data:` URIs,
text contrast across the one dark palette, hreflang pages, and links to GitHub only for the
project repository. Deployment checks live beside their scripts in
`scripts/__tests__/`; see [deployment/vercel.md](../deployment/vercel.md).
