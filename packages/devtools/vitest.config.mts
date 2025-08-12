import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from '../../vitest.config.base.mjs';
import path from 'path';

export default mergeConfig(
  baseConfig,
  defineConfig({
    esbuild: {
      jsx: 'automatic',
      jsxImportSource: 'react',
    },
    test: {
      setupFiles: [path.resolve(__dirname, './vitest.setup.js')],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      },
    },
  }),
);
