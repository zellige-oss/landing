import { setTimeout as delay } from 'node:timers/promises';
import { pathToFileURL } from 'node:url';

// Automatic analysis stays in SonarCloud; CI waits for this exact commit's gate.
export async function waitForQualityGate({
  project,
  revision,
  timeoutMs = 600_000,
  intervalMs = 10_000,
  fetchImpl = fetch,
  sleep = delay,
  now = Date.now,
}) {
  if (!/^[a-zA-Z0-9_.:-]+$/.test(project ?? '') || !/^[a-f0-9]{40}$/.test(revision ?? '')) {
    throw new Error('A Sonar project key and full commit SHA are required.');
  }
  const deadline = now() + timeoutMs;
  let lastState = 'waiting for analysis';

  async function get(path, params) {
    const url = new URL(path, 'https://sonarcloud.io');
    url.search = new URLSearchParams(params).toString();
    const response = await fetchImpl(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(Math.max(1, Math.min(15_000, deadline - now()))),
    });
    if (!response.ok) {
      const error = new Error(`Sonar API returned HTTP ${response.status}.`);
      error.fatal = response.status === 401 || response.status === 403;
      throw error;
    }
    return response.json();
  }

  while (now() < deadline) {
    try {
      const data = await get('/api/project_analyses/search', { project, ps: '100' });
      if (!Array.isArray(data.analyses)) throw new Error('Sonar returned an invalid analysis list.');
      const analysis = data.analyses.find((item) => item.revision === revision);
      if (analysis?.key) {
        const gate = await get('/api/qualitygates/project_status', { analysisId: analysis.key });
        const status = gate.projectStatus?.status;
        if (status === 'OK') return { analysisId: analysis.key, revision, status };
        if (status === 'ERROR' || status === 'WARN') {
          const failures = (gate.projectStatus.conditions ?? [])
            .filter((condition) => condition.status !== 'OK')
            .map((condition) => condition.metricKey)
            .join(', ');
          const error = new Error(`Sonar Quality Gate ${status}${failures ? ': ' + failures : ''}.`);
          error.fatal = true;
          throw error;
        }
        lastState = `quality gate not ready (${status ?? 'missing'})`;
      }
    } catch (error) {
      if (error.fatal) throw error;
      lastState = error.message;
    }
    await sleep(Math.min(intervalMs, Math.max(0, deadline - now())));
  }
  throw new Error(`Timed out waiting for this commit's Sonar Quality Gate: ${lastState}.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const result = await waitForQualityGate({
      project: process.env.SONAR_PROJECT_KEY,
      revision: process.env.APPROVED_SHA,
    });
    console.log(`Sonar Quality Gate ${result.status} for ${result.revision}.`);
  } catch (error) {
    console.error(`::error::${error.message}`);
    process.exitCode = 1;
  }
}
