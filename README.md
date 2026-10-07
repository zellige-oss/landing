# Zellige landing

Public website for [Zellige](https://github.com/zellige-oss/Zellige), served at
[zellige.dev](https://zellige.dev). This repository owns the React landing,
source artwork, brand generation, design studies, tests and static deployment.
The application and API live in `zellige-oss/Zellige`.

## Development

Use Node.js 24:

```sh
npm --prefix marketing ci
npm --prefix marketing run dev
```

## Validation and packaging

```sh
npm --prefix marketing run lint
npm --prefix marketing run build
node --test tests/*.test.mjs
node deploy/build-marketing.mjs
```

The build prerenders Spanish and English pages. Only validated static output
is packaged into `.output/marketing/.vercel/output/`.

`npm --prefix marketing run brand` rebuilds brand derivatives from `brand/` and
`openspec/design/proposals/`; it does not need a checkout of the application.
The application retains its own copies of the brand assets it uses.

## Deployment

See [Vercel setup](openspec/deployment/vercel.md). CI runs for PRs and pushes to
`main`; production deployment follows successful push CI on the same commit.
GitHub Actions variables and secrets must be configured in this repository;
they are not transferred with Git history.

To check a production build locally, run `npm --prefix marketing run preview`
after `npm --prefix marketing run build`.

## Provenance

Extracted from `zellige-oss/Zellige` at
`a5c76598db0f76b4599a6cb1f0a3df555c67c599`. The original commits remain in the source repository; a filtered-history
bundle is also retained in the local migration backup. This repository starts
from the extracted, verified website snapshot. Existing application branches
remove this surface without rewriting their history.
