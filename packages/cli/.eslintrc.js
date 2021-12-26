// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../../.eslintrc');

module.exports = {
  ...config,
  parser: '@typescript-eslint/parser',
  plugins: [...config.plugins, '@typescript-eslint'],
  extends: [...config.extends, 'plugin:@typescript-eslint/recommended'],
  rules: {
    ...config.rules,
    'no-console': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-namespace': ['error', { allowDeclarations: true }]
  }
};
