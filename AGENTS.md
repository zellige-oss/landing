# landing

Rules for agents working in this repository. They add to the shared
`/home/kzzazzk/AGENTS.md`.

## Documentation

Specs, design notes and deployment docs live in `openspec/`, not in `docs/`:
`openspec/design/` (brand, marketing design, proposals) and
`openspec/deployment/` (Vercel). Brand scripts read from
`openspec/design/proposals/` too, such as the untouched original emblem.

## Before every push

Every push to `main`, including merging a PR on GitHub, runs CI and, if it
passes, deploys the landing to production. A push must never break `main`.

Before every `git push` or PR merge, run the same checks as CI and check each
exit code. Do not push if any of them fails:

```bash
cd marketing
npm run lint; echo "lint: $?"
npm run build; echo "build: $?"
cd ..
node --test tests/*.test.mjs; echo "tests: $?"
node deploy/build-marketing.mjs; echo "package: $?"
```

- Judge each check by its exit code, not by the last lines of its output. Never
  pipe lint through `tail`/`head` without also checking the status.
- If you changed brand scripts or `ZelFace.tsx`, also run `npm run brand` in
  `marketing/` and review which images changed.

## Branches and PRs

- One change per branch, created from `origin/main`. Never commit to `main` or
  to another person's branch.
- Open a PR and merge it only when asked. Merge with rebase so `main` stays
  linear.
- After merging, watch the CI run on `main` until the deploy job finishes.
