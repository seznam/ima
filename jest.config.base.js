/**
 * @type {import('jest').Config}
 */
module.exports = {
  rootDir: '.',
  modulePaths: ['<rootDir>/'],
  // @FIXME: It would be nice to generate `moduleNameMapper` dynamically, but is is not easily possible
  // due to our `exports` field definitions in package.json files. But maybe YOU can figure it out and send PR?
  moduleNameMapper: {
    // @ima/testing-library is using this import to get the main application file
    // It would map to the transpiled file by default, but we want to use the source file here
    '^app/main$': '<rootDir>/../testing-library/src/client/app/main',
    // Map all packages to their source entry points
    '^@ima/cli$': '<rootDir>/../cli/src/index',
    '^@ima/core$': '<rootDir>/../core/src/index',
    '^@ima/core/setupJest.js$': '<rootDir>/../core/setupJest',
    '^@ima/dev-utils/(.*)$': '<rootDir>/../dev-utils/src/$1',
    '^@ima/error-overlay$': '<rootDir>/../error-overlay/src/index',
    '^@ima/helpers$': '<rootDir>/../helpers/src/index',
    '^@ima/hmr-client$': '<rootDir>/../hmr-client/src/index',
    '^@ima/plugin-cli$': '<rootDir>/../plugin-cli/src/index',
    '^@ima/react-page-renderer$': '<rootDir>/../react-page-renderer/src/index',
    '^@ima/react-page-renderer/renderer/(.*)$':
      '<rootDir>/../react-page-renderer/src/renderer/$1',
    '^@ima/react-page-renderer/hook/(.*)$':
      '<rootDir>/../react-page-renderer/src/hook/$1',
    '^@ima/storybook-integration$':
      '<rootDir>/../storybook-integration/src/index',
    '^@ima/storybook-integration/preset$':
      '<rootDir>/../storybook-integration/src/preset',
    '^@ima/storybook-integration/preview$':
      '<rootDir>/../storybook-integration/src/preview',
    '^@ima/storybook-integration/helpers$':
      '<rootDir>/../storybook-integration/src/helpers/index',
    '^@ima/testing-library$': '<rootDir>/../testing-library/src/index',
    '^@ima/testing-library/client$':
      '<rootDir>/../testing-library/src/client/index',
    '^@ima/testing-library/server$':
      '<rootDir>/../testing-library/src/server/index',
    '^@ima/testing-library/fallback/app/main$':
      '<rootDir>/../testing-library/src/client/app/main',
    '^@ima/testing-library/fallback/server/(.*)$':
      '<rootDir>/../testing-library/src/server/$1',
    '^@ima/testing-library/jest-preset$':
      '<rootDir>/../testing-library/src/jest-preset',
    '^@ima/testing-library/jestSetupFileAfterEnv$':
      '<rootDir>/../testing-library/src/jestSetupFileAfterEnv',
  },
  setupFiles: ['<rootDir>/setupJest.js'],
  testRegex: '(/__tests__/).*Spec\\.jsx?$',
  transform: {
    '^.+\\.(js|jsx)$': [
      '@swc/jest',
      {
        jsc: {
          experimental: {
            plugins: [['@swc-contrib/mut-cjs-exports', {}]],
          },
          target: 'es2024',
          parser: {
            syntax: 'ecmascript',
            jsx: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
    '^.+\\.(ts|tsx)$': [
      '@swc/jest',
      {
        jsc: {
          experimental: {
            plugins: [['@swc-contrib/mut-cjs-exports', {}]],
          },
          target: 'es2024',
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
};
