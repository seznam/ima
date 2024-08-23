module.exports = {
  rootDir: '.',
  modulePaths: ['<rootDir>/'],
  setupFiles: ['<rootDir>/setupJest.js'],
  testRegex: '(/__tests__/).*Spec\\.jsx?$',
  transform: {
    '^.+\\.(js|jsx)$': [
      '@swc/jest',
      {
        jsc: {
          experimental: {
            plugins: [['swc_mut_cjs_exports', {}]],
          },
          target: 'es2022',
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
            plugins: [['swc_mut_cjs_exports', {}]],
          },
          target: 'es2022',
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
