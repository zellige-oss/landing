import test from 'node:test';
import assert from 'node:assert/strict';
import { releaseHead } from '../deploy/release-head.mjs';
const env = { GITHUB_REPOSITORY: 'zellige-oss/landing', APPROVED_BRANCH: 'main', GITHUB_TOKEN: 'test-only' };
test('authenticates private repository reads with the workflow token', async () => {
  const sha = 'a'.repeat(40);
  assert.equal(await releaseHead({ env, fetchImpl: async (url, options) => {
    assert.equal(url, 'https://api.github.com/repos/zellige-oss/landing/git/ref/heads/main');
    assert.equal(options.headers.Authorization, 'Bearer test-only');
    return Response.json({ object: { sha } });
  } }), sha);
});
test('rejects missing tokens and unexpected release sources before network access', async () => {
  for (const change of [{ GITHUB_TOKEN: '' }, { APPROVED_BRANCH: 'other' }, { GITHUB_REPOSITORY: 'other/landing' }]) {
    await assert.rejects(releaseHead({ env: { ...env, ...change }, fetchImpl: () => assert.fail('must not request') }));
  }
});
test('rejects failed or malformed branch reads', async () => {
  for (const response of [new Response('', { status: 403 }), Response.json({}), Response.json({ object: { sha: 'invalid' } })]) {
    await assert.rejects(releaseHead({ env, fetchImpl: async () => response }));
  }
});
