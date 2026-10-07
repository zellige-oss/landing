import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'vitest';

const repositoryRoot = fileURLToPath(new URL('../..', import.meta.url));

test('CI validates PRs and main; CD deploys the package of a passing main push', async () => {
  const ci = await readFile(join(repositoryRoot, '.github/workflows/ci.yml'), 'utf8');
  const cd = await readFile(join(repositoryRoot, '.github/workflows/cd.yml'), 'utf8');
  assert.match(ci, /on:\n\s+pull_request:\n\s+branches: \[main\]\n\s+push:\n\s+branches: \[main\]/);
  for (const step of ['npm run lint', 'npm run build', 'npm test', 'node scripts/package-vercel\\.mjs']) {
    assert.match(ci, new RegExp(`run: ${step}$`, 'm'));
  }
  assert.match(ci, /sonar:\n(?:.*\n)*?\s+if: github\.event_name == 'push'\n\s+needs: \[checks\]/);
  assert.match(ci, /run: node scripts\/sonar-quality-gate\.mjs/);
  assert.match(cd, /on:\n\s+workflow_run:\n\s+workflows: \[CI\]\n\s+types: \[completed\]\n\s+branches: \[main\]/);
  assert.match(cd, /if: github\.event\.workflow_run\.conclusion == 'success' && github\.event\.workflow_run\.event == 'push'/);
  // Keep all pending publications: a late older CI must not cancel the newer CD.
  assert.match(cd, /concurrency:\n\s+group: production\n\s+queue: max\n\s+cancel-in-progress: false/);
  for (const workflow of [ci, cd]) {
    const installations = [...workflow.matchAll(/\bnpm\s+(?:ci|exec)\b[^\n]*/g)];
    assert.ok(installations.length > 0);
    for (const [command] of installations) {
      assert.match(command, /\s--ignore-scripts(?:\s|$)/, 'Dependency installation must not run lifecycle scripts');
    }
  }
  assert.match(cd, /if \[ "\$tip" = "\$APPROVED_SHA" \]/);
  assert.match(cd, /run-id: \$\{\{ github\.event\.workflow_run\.id \}\}/);
  assert.match(cd, /^\s+VERCEL_ORG_ID: \$\{\{ vars\.VERCEL_ORG_ID \}\}$/m);
  assert.match(cd, /^\s+VERCEL_PROJECT_ID: \$\{\{ vars\.VERCEL_PROJECT_ID \}\}$/m);
  assert.match(cd, /^\s+VERCEL_TOKEN: \$\{\{ secrets\.VERCEL_TOKEN \}\}$/m);
  assert.match(cd, /vercel deploy --prebuilt --prod --yes --meta sourceSha="\$APPROVED_SHA" --token="\$VERCEL_TOKEN" >"\$deployment_log" 2>&1/);
  assert.match(cd, /trap 'rm -f "\$deployment_log"' EXIT/);
});

test('CD files do not publish installation identifiers or internal deployment URLs', async () => {
  for (const path of [
    '.github/workflows/ci.yml', '.github/workflows/cd.yml', 'scripts/package-vercel.mjs',
    'scripts/vercel-output-config.json', 'openspec/deployment/vercel.md',
    'scripts/__tests__/package-vercel.test.mjs', 'scripts/__tests__/ci-cd.test.mjs',
  ]) {
    const contents = await readFile(join(repositoryRoot, path), 'utf8');
    assert.doesNotMatch(contents, /\b(?:team|prj|dpl)_[a-zA-Z0-9]{8,}\b/, path);
    assert.doesNotMatch(contents, /https?:\/\/[^\s<>]+\.(?:vercel\.app|vercel-dns-[0-9]+\.com)/, path);
  }
});
