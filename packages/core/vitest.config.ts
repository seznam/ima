import { defineConfig, mergeConfig } from 'vitest/config';

import baseConfig from '../../vitest.config.base';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      name: '@ima/core',
      testRegex: '(/__tests__/).*Spec\\.[jt]sx?$',
    },
  })
);
