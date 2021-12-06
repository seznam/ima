// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../.eslintrc');

module.exports = {
  ...config,
  extends: [...config.extends, 'plugin:tailwindcss/recommended'],
  rules: {
    ...config.rules,
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'tailwindcss/no-custom-classname': [
      'error',
      {
        whitelist: ['hljs', 'language\\-javascript']
      }
    ]
  }
};
