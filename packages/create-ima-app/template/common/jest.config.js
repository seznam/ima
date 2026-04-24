module.exports = {
  bail: true,
  preset: '@ima/testing-library',
  modulePaths: ['<rootDir>/'],
  testRegex: '(/__tests__/).*Spec\\.jsx?$',
  // These @ima/* packages now ship pure ESM — they must be transformed by
  // @swc/jest instead of being loaded as-is (which would fail in Jest's CJS runtime).
  transformIgnorePatterns: [
    '/node_modules/(?!(@ima/core|@ima/react-page-renderer|@ima/helpers|@ima/testing-library|@ima/hmr-client|@ima/cli)/)',
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.jsx?$': [
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
    '^.+\\.tsx?$': [
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
  verbose: true,
};
