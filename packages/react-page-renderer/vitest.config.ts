import { defineConfig, mergeConfig } from 'vitest/config';

import baseConfig from '../../vitest.config.base';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      name: '@ima/react-page-renderer',
      environment: 'jsdom',
      testRegex: '(/__tests__/).*Spec\\.[jt]sx?$',
    },
  })
);
