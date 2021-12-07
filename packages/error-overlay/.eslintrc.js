// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../../.eslintrc');

module.exports = {
  ...config,
  ignorePatterns: ['node_modules', 'dist'],
  parser: '@typescript-eslint/parser',
  plugins: [...config.plugins, '@typescript-eslint'],
  extends: [
    ...config.extends,
    'plugin:@typescript-eslint/recommended',
    'plugin:tailwindcss/recommended',
    'plugin:import/recommended'
  ],
  rules: {
    ...config.rules,
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-namespace': ['error', { allowDeclarations: true }],
    'tailwindcss/no-custom-classname': [
      'error',
      {
        whitelist: ['hljs', 'language\\-javascript']
      }
    ],
    'import/no-unresolved': 'off',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [
          {
            pattern: '{preact|react|svelte}{/**,**}',
            group: 'external',
            position: 'before'
          },
          {
            pattern: '@merkur{/**,**}',
            group: 'external',
            position: 'after'
          },
          {
            pattern: '#*/**',
            group: 'internal',
            position: 'after'
          },
          {
            pattern: '*.{css,less,json}',
            group: 'object',
            patternOptions: { matchBase: true },
            position: 'after'
          }
        ],
        pathGroupsExcludedImportTypes: ['#', '@merkur'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }
    ]
  }
};
