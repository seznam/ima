const imaConfig = require('./ima.config');

module.exports = {
  bail: true,
  testEnvironment: 'node',
  modulePaths: ['<rootDir>/'],
  setupFiles: ['@ima/core/setupFile.js', '<rootDir>/jest.setup.js'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testRegex: '(/__tests__/).*Spec\\.jsx?$',
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
              runtime: imaConfig.jsxRuntime ?? 'classic',
            },
          },
        },
      },
    ],
  },
  verbose: true,
};
