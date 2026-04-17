import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packagesDir = path.resolve(__dirname, 'packages');
const r = (...segments: string[]) =>
  path.resolve(__dirname, 'packages', ...segments);

/**
 * Shared Vitest base configuration for all packages in the IMA.js monorepo.
 * Per-package configs import and merge this with mergeConfig().
 */
const config = defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    include: ['**/__tests__/**/*Spec.{ts,tsx,js,jsx}'],
    setupFiles: [path.resolve(packagesDir, 'core/setupVitest.js')],
  },
  resolve: {
    alias: [
      {
        find: /^app\/main$/,
        replacement: r('testing-library/src/client/app/main'),
      },
      {
        find: /^@ima\/cli$/,
        replacement: r('cli/src/index'),
      },
      {
        find: /^@ima\/core$/,
        replacement: r('core/src/index'),
      },
      {
        find: /^@ima\/core\/setupVitest\.js$/,
        replacement: r('core/setupVitest'),
      },
      {
        find: /^@ima\/dev-utils\/(.*)$/,
        replacement: `${r('dev-utils/src')}/$1`,
      },
      {
        find: /^@ima\/error-overlay$/,
        replacement: r('error-overlay/src/index'),
      },
      {
        find: /^@ima\/helpers$/,
        replacement: r('helpers/src/index'),
      },
      {
        find: /^@ima\/hmr-client$/,
        replacement: r('hmr-client/src/index'),
      },
      {
        find: /^@ima\/plugin-cli$/,
        replacement: r('plugin-cli/src/index'),
      },
      {
        find: /^@ima\/react-page-renderer$/,
        replacement: r('react-page-renderer/src/index'),
      },
      {
        find: /^@ima\/react-page-renderer\/renderer\/(.*)$/,
        replacement: `${r('react-page-renderer/src/renderer')}/$1`,
      },
      {
        find: /^@ima\/react-page-renderer\/hook\/(.*)$/,
        replacement: `${r('react-page-renderer/src/hook')}/$1`,
      },
      {
        find: /^@ima\/storybook-integration$/,
        replacement: r('storybook-integration/src/index'),
      },
      {
        find: /^@ima\/storybook-integration\/preset$/,
        replacement: r('storybook-integration/src/preset'),
      },
      {
        find: /^@ima\/storybook-integration\/preview$/,
        replacement: r('storybook-integration/src/preview'),
      },
      {
        find: /^@ima\/storybook-integration\/helpers$/,
        replacement: r('storybook-integration/src/helpers/index'),
      },
      {
        find: /^@ima\/testing-library$/,
        replacement: r('testing-library/src/index'),
      },
      {
        find: /^@ima\/testing-library\/client$/,
        replacement: r('testing-library/src/client/index'),
      },
      {
        find: /^@ima\/testing-library\/server$/,
        replacement: r('testing-library/src/server/index'),
      },
      {
        find: /^@ima\/testing-library\/vitest-preset$/,
        replacement: r('testing-library/src/vitest-preset'),
      },
      {
        find: /^@ima\/testing-library\/vitestSetupFileAfterEnv$/,
        replacement: r('testing-library/src/vitestSetupFileAfterEnv'),
      },
      {
        find: /^@ima\/testing-library\/fallback\/app\/main$/,
        replacement: r('testing-library/src/client/app/main'),
      },
      {
        find: /^@ima\/testing-library\/fallback\/server\/(.*)$/,
        replacement: `${r('testing-library/src/server')}/$1`,
      },
    ],
  },
});

export default config;
