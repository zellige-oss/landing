import { pathToFileURL } from 'node:url';

export async function releaseHead({ env = process.env, fetchImpl = fetch } = {}) {
  if (env.GITHUB_REPOSITORY !== 'zellige-oss/landing' || env.APPROVED_BRANCH !== 'main') {
    throw new Error('Unexpected release repository or branch');
  }
  if (!env.GITHUB_TOKEN) throw new Error('Missing GITHUB_TOKEN');
  const response = await fetchImpl('https://api.github.com/repos/zellige-oss/landing/git/ref/heads/main', {
    headers: { Authorization: `Bearer ${env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error('Could not verify the release branch');
  const sha = (await response.json()).object?.sha;
  if (!/^[a-f0-9]{40}$/.test(sha ?? '')) throw new Error('Invalid release branch response');
  return sha;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  releaseHead().then(sha => console.log(sha)).catch(() => {
    console.error('Could not verify the release branch; refusing deployment.');
    process.exitCode = 1;
  });
}
