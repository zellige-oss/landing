# landing

Rules for agents working in this repository. They add to the shared
`/home/kzzazzk/AGENTS.md`.

## Documentation

Specs, design notes and deployment docs live in `openspec/`, not in `docs/`:
`openspec/design/` (brand, marketing design, proposals) and
`openspec/deployment/` (Vercel). Brand scripts read from
`openspec/design/proposals/` too, such as the untouched original emblem.

## Before every push

CI (`.github/workflows/ci.yml`) runs on every PR and every push to `main`. Every
push to `main`, including merging a PR on GitHub, also deploys the landing to
production once CI passes (`cd.yml`). A push must never break `main`.

Before every `git push` or PR merge, run the same checks as CI and check each
exit code. Do not push if any of them fails:

```bash
npm run lint; echo "lint: $?"
npm run build; echo "build: $?"
npm test; echo "tests: $?"
node scripts/package-vercel.mjs; echo "package: $?"
```

- Judge each check by its exit code, not by the last lines of its output. Never
  pipe lint through `tail`/`head` without also checking the status.
- If you changed brand scripts or `ZelFace.tsx`, also run `npm run brand` and
  review which images changed.

## Layout

- `src/pages/`: one file per page of the landing; `src/layout/`: header and
  footer; `src/components/`: what pages share. Put a new piece where it will be
  reused rather than copying it into a page.
- Tests sit beside the code they check (`src/__tests__/`, `scripts/__tests__/`)
  and run with Vitest (`npm test`).
- Brand art lives in `public/brand/`; generated web copies in `src/assets/`.

## Branches and PRs

- One change per branch, created from `origin/main`. Never commit to `main` or
  to another person's branch.
- Open a PR and merge it only when asked. Merge with rebase so `main` stays
  linear.
- After merging, watch the CI run on `main` until the deploy job finishes.
