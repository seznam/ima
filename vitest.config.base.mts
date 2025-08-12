import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['**/__tests__/*'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/e2e/**'],
    pool: 'forks',
    maxConcurrency: 1,
    // isolate: false, // TODO Try me after everything is working
    poolOptions: {
      threads: {
        minThreads: 1,
        maxThreads: Math.max(1, Math.ceil(os.cpus().length * 0.75)),
      },
    },
  },
  resolve: {
    conditions: ['browser', 'default'],
    alias: [
      {
        find: /^@ima\/core$/,
        replacement: path.resolve(
          __dirname,
          'packages/core/dist/esm/client/index.js',
        ),
      },
      {
        find: /^app\/main$/,
        replacement: path.resolve(
          __dirname,
          'packages/testing-library/src/client/app/main.ts',
        ),
      },
    ],
  },
});
