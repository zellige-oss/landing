# Public landing on Vercel

This deployment belongs to `zellige-oss/landing`. Configure its own Actions
variables and secrets before the first release; credentials and environment
settings are not copied from `zellige-oss/Zellige`. The existing public domain
and Vercel project do not need to change.

## Automatic deployment

`CI marketing` runs its jobs only after a pull request is merged into `main`.
Pushing commits, opening or updating a PR, and closing a PR without merging it
do not execute those jobs. After all validations pass, CI calls the reusable
`Deploy marketing to Vercel` workflow. Both workflows check out the exact merged
commit, and CD confirms that it is still the current `main` before publishing.
Pilot releases use their own CD and cannot be blocked by a landing deployment
failure. Deployments to `marketing-production` are queued without interrupting
a running publication.

## Vercel and GitHub configuration

Use a dedicated Vercel project with framework preset `Other`.
This workflow supplies prebuilt static output; it does not run a remote
build or deploy the repository root. The Vercel project's Git connection has
also generated previews from repository pushes. Configure its Ignored Build
Step as `exit 0` (or disconnect the Git repository) so that Git pushes cannot
publish the wrong root in parallel with this workflow. The ignored build step
does not replace the workflow's explicit prebuilt production deployment.

Keep installation-specific values outside the repository. Configure the two
identifiers as GitHub Actions variables and the token as a secret, either at
repository level or in the `marketing-production` environment. Variables are
not masked in Actions logs, so do not print their values in workflow steps.

| Setting | Type | Value |
| --- | --- | --- |
| `VERCEL_ORG_ID` | Variable | Team ID from the Vercel dashboard |
| `VERCEL_PROJECT_ID` | Variable | Project ID from the Vercel dashboard |
| `VERCEL_TOKEN` | Secret | Vercel deployment token authorized for that team |

The workflow reads the token only during deployment, passes it through the
environment, and never writes it into the artifact. A missing setting fails the
deployment with the setting name, without printing values. No credentials or
GitHub settings are created by the files in this change.

For another installation, configure its identifiers in GitHub Actions settings,
attach the domain to its Vercel project and configure
the exact DNS record Vercel returns in Cloudflare. Domain verification and HTTPS must succeed
before declaring the domain live. The workflow deploys to the project's assigned
production domains; it does not modify DNS or attach domains.

## Artifact and local verification

The landing is a Vite + React + Tailwind/shadcn app in `marketing/`. Its build
prerenders the page to static HTML (content, anchors and disclosures work without
JavaScript) and hydrates it on the client. The workflow builds it, checks the
prerendered page, then packages `marketing/dist/` unchanged.

From the repository root, using Node.js 24:

```sh
(cd marketing && npm ci && npm run build)
node --test tests/marketing.test.mjs tests/marketing-build.test.mjs
node deploy/build-marketing.mjs
```

The output is `.output/marketing/.vercel/output/`, using Vercel Build Output API
version 3. Its `static/` directory is exactly `marketing/dist/`: `index.html`,
hashed `assets/` (script, stylesheet, images, wordmark) and `fonts/` with their
licenses. Packaging refuses symlinks, unexpected file types (including source
maps), inline `data:` URIs or inline scripts that the CSP would block, and any
reference to the pilot, its API or the development domain.

The builder copies these files unchanged and copies
`deploy/vercel-marketing.json` to `.vercel/output/config.json`. That configuration
applies the same CSP, `nosniff`, frame denial, and referrer policy as
`deploy/marketing.Caddyfile`. There is no catch-all page fallback: unknown paths
remain 404s. The pilot screenshot, mascot, application, backend, databases,
documentation, and secrets are excluded by the explicit file allowlist.

Rebuilding replaces only `.output/marketing/.vercel/output`, clearing stale
generated files while preserving siblings and project metadata. All source files
must exist before replacement starts. Symlinked inputs and output ancestors are
rejected. Do not store manual files in the generated output directory.

The deployment command runs from `.output/marketing` with the three settings
already available in its environment:

```sh
npm exec --yes --package=vercel@62.2.0 -- vercel deploy --prebuilt --prod --yes
```

The CLI version is pinned, runs without a global installation, and waits for
deployment completion. The workflow captures CLI output in a temporary runner
file, deletes it on exit, and reports only success or failure. It does not
publish raw logs or deployment URLs as Actions artifacts or step output.
For failures, inspect the private provider dashboard and Actions settings.
This avoids publishing deployment metadata, not discovery of the hosting
provider through the public site's DNS or HTTP behavior. No
`vercel pull` is needed because the static package has no build-time environment
variables; the project and team IDs select the existing project directly.

After the first deployment, verify `/` and its fonts, CSS, mosaic and emblem on
`https://zellige.dev`, inspect the response security headers, and check that
`/images/pilot-preview.png`, `/brand/zellige-companion-hello.png`, `/.env`, and
`/v1/conversations` return 404. The first actual GitHub run is required to verify
the configured credentials and end-to-end publication.

## References

- [Vercel Build Output API configuration](https://vercel.com/docs/build-output-api/configuration)
- [Vercel prebuilt deployments](https://vercel.com/docs/cli/deploy#prebuilt)
- [Vercel CLI project and token environment variables](https://vercel.com/docs/cli/global-options)
- [GitHub concurrency queue behavior](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#concurrency)
- [GitHub variables are not masked in logs](https://docs.github.com/en/actions/concepts/workflows-and-actions/variables)
