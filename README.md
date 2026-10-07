# Zellige landing

Public website for [Zellige](https://github.com/zellige-oss/Zellige), served at
[zellige.dev](https://zellige.dev). This repository owns the React landing,
source artwork, brand generation, design studies, tests and static deployment.
The application and API live in `zellige-oss/Zellige`.

## Development

Use Node.js 24:

```sh
npm ci
npm run dev
```

## Layout

- `src/`: the React app. `pages/` holds the landing's four pages (hero, story,
  features, contact), `layout/` the header and footer, `components/` the pieces
  they share (Zel, the tile, the wordmark, the band), plus `hooks/`, `i18n/`
  and `assets/`. Tests sit beside the code: `src/__tests__/`.
- `public/`: served as is, including `public/brand/` (emblem, Zel's moods,
  logos and wordmarks).
- `scripts/`: brand generation, prerendering and packaging for Vercel, with
  their tests in `scripts/__tests__/`.
- `openspec/`: design notes, brand and deployment docs.

## Validation and packaging

```sh
npm run lint
npm run build
npm test
node scripts/package-vercel.mjs
```

The build prerenders Spanish and English pages; the tests check that output, so
build first. Only validated static output is packaged into
`.output/.vercel/output/`.

`npm run brand` rebuilds brand derivatives from `public/brand/` and
`openspec/design/proposals/`; it does not need a checkout of the application.
The application retains its own copies of the brand assets it uses.

## Deployment

See [Vercel setup](openspec/deployment/vercel.md). CI (`ci.yml`) runs for PRs and pushes
to `main`; CD (`cd.yml`) deploys the package CI built once CI passes on `main`.
GitHub Actions variables and secrets must be configured in this repository;
they are not transferred with Git history.

To check a production build locally, run `npm run preview` after
`npm run build`.

## Provenance

Extracted from `zellige-oss/Zellige` at
`a5c76598db0f76b4599a6cb1f0a3df555c67c599`. The original commits remain in the source repository; a filtered-history
bundle is also retained in the local migration backup. This repository starts
from the extracted, verified website snapshot. Existing application branches
remove this surface without rewriting their history.
