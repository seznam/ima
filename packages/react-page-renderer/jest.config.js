module.exports = {
  bail: false,
  verbose: true,
  rootDir: './src',
  testEnvironment: 'jsdom',
  modulePaths: ['<rootDir>/'],
  testRegex: '(/__tests__/).*Spec\\.[jt]sx?$',
  transform: {
    '\\.[jt]sx?$': ['ts-jest'],
  },
};
