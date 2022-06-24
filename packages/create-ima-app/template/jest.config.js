module.exports = {
  bail: true,
  testEnvironment: 'node',
  modulePaths: ['<rootDir>/'],
  setupFiles: ['react-testing-library-shallow/lib/setup.js', '@ima/core/setupFile.js'],
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
          parser: {
            syntax: 'ecmascript',
            jsx: true,
          },
          transform: {
            react: {
              pragma: '__reactTestingLibraryShallow.createElement',
              runtime: 'classic',
            },
          },
        },
      },
    ],
  },
  verbose: true,
};
