# landing

Rules for agents working in this repository. They add to the shared
`/home/kzzazzk/AGENTS.md`.

## Documentation

Specs, design notes and deployment docs live in `openspec/`, not in `docs/`:
`openspec/design/` (brand, marketing design, proposals) and
`openspec/deployment/` (Vercel). Brand scripts read from
`openspec/design/proposals/` too, such as the untouched original emblem.

## CI and `main`

CI (`.github/workflows/ci.yml`) runs on every PR and every push to `main`. Every
push to `main`, including merging a PR on GitHub, also deploys the landing to
production once CI passes (`cd.yml`).

`main` is protected by the "Protect main" ruleset on GitHub, so it cannot break:

- Changes reach `main` only through a PR; direct pushes and force-pushes are
  rejected, and nobody can bypass the ruleset.
- A PR merges only once "Lint, build and tests" and "SonarCloud Code Analysis"
  pass and the branch is up to date with `main`.
- Rebase is the only merge method, so `main` stays linear.

Merge with auto-merge, which waits for the checks itself:

```bash
gh pr merge <number> --auto --rebase
```

CI is the gate, but run its checks locally before pushing to catch failures
sooner, and judge each by its exit code, not by the last lines of its output:

```bash
npm run lint; echo "lint: $?"
npm run build; echo "build: $?"
npm test; echo "tests: $?"
node scripts/package-vercel.mjs; echo "package: $?"
```

If you changed brand scripts or `ZelFace.tsx`, also run `npm run brand` and
review which images changed; CI does not check that.

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
- Open a PR and merge it only when asked, with `gh pr merge <number> --auto --rebase`.
- After merging, watch the CI run on `main` until the deploy job finishes.
