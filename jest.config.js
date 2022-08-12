module.exports = {
  bail: false,
  verbose: true,
  testEnvironment: 'node',
  modulePaths: ['<rootDir>/'],
  testRegex: '(/__tests__/).*Spec\\.jsx?$',
  transform: {
    '\\.[jt]sx?$': [
      'babel-jest',
      {
        plugins: ['@babel/plugin-transform-modules-commonjs'],
      },
    ],
  },
};
