import { defineConfig } from 'vitest/config';

// Tests sit next to what they check: the prerendered landing in src/__tests__/
// (build it first with `npm run build`), the build and deploy scripts in
// scripts/__tests__/, and the mosaic study beside it in openspec/.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx,mjs}', 'scripts/**/*.test.mjs', 'openspec/**/*.test.mjs'],
  },
});
