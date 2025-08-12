import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from '../../vitest.config.base.mjs';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      setupFiles: ['./vitest.setup.js'],
    },
  }),
);
