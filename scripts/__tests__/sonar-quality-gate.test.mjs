import assert from 'node:assert/strict';
import { test } from 'vitest';
import { safeDiagnostic, waitForQualityGate } from '../sonar-quality-gate.mjs';

const revision = 'a'.repeat(40);
const oldRevision = 'b'.repeat(40);

test('external diagnostics cannot inject lines or workflow command escapes into logs', () => {
  const diagnostic = safeDiagnostic('API failure\r\n::warning::forged%0A\u2028next');
  assert.doesNotMatch(diagnostic, /[\r\n\u2028%]/);
  assert.equal(safeDiagnostic('Sonar Quality Gate ERROR: new_security_rating.'), 'Sonar Quality Gate ERROR: new_security_rating.');
});

function harness(responses) {
  let time = 0;
  const requests = [];
  return {
    requests,
    options: {
      project: 'zellige-oss_landing', revision, timeoutMs: 30, intervalMs: 10,
      now: () => time,
      sleep: async (ms) => { time += ms; },
      fetchImpl: async (url) => {
        requests.push(url);
        const value = responses.shift();
        if (value instanceof Error) throw value;
        return value ?? Response.json({ analyses: [] });
      },
    },
  };
}

test('an older passing analysis cannot approve the pushed commit', async () => {
  const h = harness([
    Response.json({ analyses: [{ key: 'old', revision: oldRevision }] }),
    Response.json({ analyses: [{ key: 'current', revision }] }),
    Response.json({ projectStatus: { status: 'OK' } }),
  ]);
  assert.deepEqual(await waitForQualityGate(h.options), { analysisId: 'current', revision, status: 'OK' });
  const gates = h.requests.filter((url) => url.pathname.endsWith('/project_status'));
  assert.equal(gates.length, 1);
  assert.equal(gates[0].searchParams.get('analysisId'), 'current');
});

test('a newer analysis does not replace the immutable gate for this revision', async () => {
  const h = harness([
    Response.json({ analyses: [{ key: 'newer', revision: oldRevision }, { key: 'current', revision }] }),
    Response.json({ projectStatus: { status: 'OK' } }),
  ]);
  await waitForQualityGate(h.options);
  assert.equal(h.requests[1].searchParams.get('analysisId'), 'current');
});

test('a failed quality gate blocks release and reports the failing condition', async () => {
  const h = harness([
    Response.json({ analyses: [{ key: 'current', revision }] }),
    Response.json({ projectStatus: { status: 'ERROR', conditions: [{ status: 'ERROR', metricKey: 'new_security_rating' }] } }),
  ]);
  await assert.rejects(waitForQualityGate(h.options), /Quality Gate ERROR: new_security_rating/);
});

test('missing analysis times out without treating any previous result as approval', async () => {
  const h = harness([]);
  await assert.rejects(waitForQualityGate(h.options), /Timed out/);
});

test('an analysis with no quality gate cannot approve release', async () => {
  const h = harness([
    Response.json({ analyses: [{ key: 'current', revision }] }),
    Response.json({ projectStatus: { status: 'NONE' } }),
  ]);
  await assert.rejects(waitForQualityGate(h.options), /Timed out/);
});

test('temporary network failures are retried but denied access fails immediately', async () => {
  const h = harness([
    new Error('Temporary network failure'),
    Response.json({ analyses: [{ key: 'current', revision }] }),
    Response.json({ projectStatus: { status: 'OK' } }),
  ]);
  assert.equal((await waitForQualityGate(h.options)).status, 'OK');
  const denied = harness([new Response('', { status: 403 })]);
  await assert.rejects(waitForQualityGate(denied.options), /HTTP 403/);
  assert.equal(denied.requests.length, 1);
});

test('invalid project and revision values are rejected before network access', async () => {
  const h = harness([]);
  await assert.rejects(waitForQualityGate({ ...h.options, revision: 'HEAD' }), /full commit SHA/);
  await assert.rejects(waitForQualityGate({ ...h.options, project: '../private' }), /project key/);
  assert.equal(h.requests.length, 0);
});
