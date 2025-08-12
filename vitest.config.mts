import baseConfig from './vitest.config.base.mjs';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      projects: ['packages/*'],
    },
  })
);
