import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { onTestFinished, test } from 'vitest';
import { packageLanding } from '../package-vercel.mjs';

const repositoryRoot = fileURLToPath(new URL('../..', import.meta.url));
// A stand-in for the Vite output in dist/.
const distFiles = {
  'index.html': '<!doctype html><html lang="es"><body><div id="root"><main>zellige</main></div><script type="module" src="/assets/index-abc.js"></script></body></html>',
  'assets/index-abc.js': 'console.log("landing");',
  'assets/index-abc.css': 'body{background:url(/assets/ceramic-abc.webp)}',
  'assets/ceramic-abc.webp': 'RIFF....WEBP',
  'fonts/onest-variable.ttf': 'font',
  'fonts/OFL.txt': 'license',
};
const expectedFiles = Object.keys(distFiles).sort();

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'zellige-landing-package-'));
  onTestFinished(() => rm(root, { recursive: true, force: true }));
  for (const [file, contents] of Object.entries(distFiles)) {
    await mkdir(dirname(join(root, 'dist', file)), { recursive: true });
    await writeFile(join(root, 'dist', file), contents);
  }
  await mkdir(join(root, 'scripts'));
  await cp(join(repositoryRoot, 'scripts/vercel-output-config.json'), join(root, 'scripts/vercel-output-config.json'));
  return root;
}

async function listFiles(root, prefix = '') {
  const files = [];
  for (const entry of await readdir(join(root, prefix), { withFileTypes: true })) {
    const path = join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(root, path));
    else files.push(path);
  }
  return files.sort();
}

test('the artifact contains exactly the built landing, unchanged', async () => {
  const root = await fixture();
  // Put private material beside the build to catch accidental copying from outside dist.
  for (const file of [
    '.env', 'data/private.sqlite', 'docs/private.md', 'zellige/server.py',
    'src/App.tsx', 'public/brand/zellige-emblem.png', 'openspec/design/marketing.md',
  ]) {
    await mkdir(dirname(join(root, file)), { recursive: true });
    await writeFile(join(root, file), 'must remain private');
  }
  const { output } = await packageLanding(root);
  assert.deepEqual(await listFiles(output), [
    'config.json', ...expectedFiles.map((file) => `static/${file}`),
  ].sort());
  for (const file of expectedFiles) {
    assert.equal(await readFile(join(output, 'static', file), 'utf8'), distFiles[file]);
  }
});

test('rebuilds remove stale generated assets and preserve sibling data', async () => {
  const root = await fixture();
  const { output } = await packageLanding(root);
  const before = await readFile(join(output, 'config.json'));
  await writeFile(join(output, 'static/private.txt'), 'stale output');
  await writeFile(join(root, '.output/keep.txt'), 'unrelated output');
  await writeFile(join(root, '.output/.vercel/project.json'), 'project metadata');
  await packageLanding(root);
  assert.deepEqual(await listFiles(join(output, 'static')), expectedFiles);
  assert.deepEqual(await readFile(join(output, 'config.json')), before);
  assert.equal(await readFile(join(root, '.output/keep.txt'), 'utf8'), 'unrelated output');
  assert.equal(await readFile(join(root, '.output/.vercel/project.json'), 'utf8'), 'project metadata');
});

test('a missing build fails before replacing a previous artifact', async () => {
  const root = await fixture();
  const { output } = await packageLanding(root);
  const before = await readFile(join(output, 'static/index.html'));
  await rm(join(root, 'dist/index.html'));
  await assert.rejects(packageLanding(root), /Missing dist\/index.html/);
  assert.deepEqual(await readFile(join(output, 'static/index.html')), before);
});

test('symlinked build files cannot package a different file', async () => {
  const root = await fixture();
  await rm(join(root, 'dist/index.html'));
  await writeFile(join(root, 'private.txt'), 'private contents');
  await symlink(join(root, 'private.txt'), join(root, 'dist/index.html'));
  await assert.rejects(packageLanding(root), /without symlinks/);
});

test('unexpected files, inline data URIs, inline scripts and pilot links are refused', async () => {
  const cases = [
    ['assets/index-abc.js.map', '{}', /Unexpected public file type/],
    ['assets/index-abc.css', 'body{background:url("data:image/svg+xml,%3Csvg%3E")}', /Inline data: URI/],
    ['index.html', '<html><script>alert(1)</script></html>', /Inline script/],
    ['assets/index-abc.js', 'fetch("/v1/conversations")', /private surfaces/],
    ['index.html', '<a href="https://zellige-dev.example">pilot</a>', /private surfaces/],
  ];
  for (const [file, contents, error] of cases) {
    const root = await fixture();
    await writeFile(join(root, 'dist', file), contents);
    await assert.rejects(packageLanding(root), error, file);
  }
});

test('symlinked output ancestors cannot redirect cleanup or writes', async () => {
  const root = await fixture();
  await mkdir(join(root, 'protected'));
  await writeFile(join(root, 'protected/keep.txt'), 'preserve');
  await symlink(join(root, 'protected'), join(root, '.output'));
  await assert.rejects(packageLanding(root), /Refusing to replace/);
  assert.equal(await readFile(join(root, 'protected/keep.txt'), 'utf8'), 'preserve');
  assert.deepEqual(await readdir(join(root, 'protected')), ['keep.txt']);
});

test('all paths get the landing security headers', async () => {
  const config = JSON.parse(await readFile(join(repositoryRoot, 'scripts/vercel-output-config.json')));
  assert.equal(config.version, 3);
  const headers = {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'X-Frame-Options': 'DENY',
    'Content-Security-Policy': "default-src 'self'; img-src 'self'; style-src 'self'; frame-ancestors 'none'; base-uri 'none'",
  };
  assert.deepEqual(config.routes[0], { src: '/.*', headers, continue: true });
  assert.deepEqual(config.routes.slice(1), [
    { src: '^/$', dest: '/index.html' },
    { src: '^/es/?$', dest: '/es/index.html' },
    { src: '^/en/?$', dest: '/en/index.html' },
    { handle: 'filesystem' },
  ]);
});
