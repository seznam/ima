module.exports = {
  bail: true,
  preset: '@ima/testing-library',
  modulePaths: ['<rootDir>/'],
  testRegex: '(/__tests__/).*Spec\\.jsx?$',
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
