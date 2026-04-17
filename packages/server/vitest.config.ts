import path from 'node:path';

import { defineConfig, mergeConfig } from 'vitest/config';

import baseConfig from '../../vitest.config.base';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      name: '@ima/server',
      setupFiles: [path.resolve(__dirname, 'setupVitest.js')],
    },
  })
);
