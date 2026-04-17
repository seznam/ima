import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      'packages/core/vitest.config.ts',
      'packages/helpers/vitest.config.ts',
      'packages/server/vitest.config.ts',
      'packages/cli/vitest.config.ts',
      'packages/react-page-renderer/vitest.config.ts',
      'packages/testing-library/vitest.config.ts',
      'packages/storybook-integration/vitest.config.ts',
    ],
  },
});
