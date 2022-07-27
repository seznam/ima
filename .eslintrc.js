module.exports = {
  root: true,
  ignorePatterns: [
    '**/node_modules/**',
    '**/dist/**',
    '**/docs/**',
    '**/coverage/**',
    'packages/create-ima-app/examples/todos/assets/**',
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:prettier/recommended',
  ],
  rules: {
    'no-console': [
      'error',
      {
        allow: ['warn', 'error'],
      },
    ],

    // Prettier
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: true,
        trailingComma: 'es5',
        jsxSingleQuote: true,
        bracketSameLine: false,
        arrowParens: 'avoid',
      },
    ],

    // Jest plugin overrides
    'jest/valid-title': 'off',
    'jest/no-done-callback': 'warn',
    'jest/no-disabled-tests': 'warn',
    'jest/no-conditional-expect': 'warn',
    'jest/prefer-expect-resolves': 'warn',
    'jest/prefer-lowercase-title': [
      'warn',
      {
        ignore: ['describe'],
      },
    ],
    // Remove when migrated to jest >=27
    'jest/no-jasmine-globals': 'off',

    // React plugin overrides
    'react/prop-types': 'off',
  },
  settings: {
    react: {
      version: '17',
    },
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
  },
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  globals: {
    $Debug: true,
    $IMA: true,
    using: true,
    extend: true,
    spyOn: true,
  },
  overrides: [
    // TODO IMA@18 Enable repo-wide when merged to master
    // Import plugin
    {
      files: [
        'packages/cli/**',
        'packages/devtools/**',
        'packages/devtools-scripts/**',
        'packages/hmr-client/**',
        'packages/error-overlay/**',
        'packages/dev-utils/**',
      ],
      extends: ['plugin:import/recommended'],
      rules: {
        'import/no-unresolved': ['warn', { ignore: ['^@\\/'] }], // ignore @/* aliases
        'import/order': [
          'error',
          {
            groups: ['builtin', 'external', 'internal'],
            pathGroups: [
              {
                pattern: '{preact|react|svelte}{/**,**}',
                group: 'external',
                position: 'before',
              },
              {
                pattern: '@/**',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: '*.{css,less,json,html,txt,csv,png,jpg,svg}',
                group: 'object',
                patternOptions: { matchBase: true },
                position: 'after',
              },
            ],
            'newlines-between': 'always',
            alphabetize: {
              order: 'asc',
              caseInsensitive: true,
            },
          },
        ],
      },
      settings: {
        'import/resolver': {
          node: {
            extensions: ['.js', '.ts', '.jsx', '.tsx', '.mjs', '.json'],
          },
        },
      },
    },
    // Typescript support
    {
      files: ['**/*.{ts,tsx}'],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: './tsconfig.json',
      },
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/ban-ts-comment': [
          'error',
          { 'ts-expect-error': 'allow-with-description' },
        ],
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-namespace': [
          'error',
          { allowDeclarations: true },
        ],
      },
    },
    // Other overrides
    {
      files: [
        'packages/cli/**',
        'packages/dev-utils/**',
        'packages/create-ima-app/**',
      ],
      rules: {
        'no-console': 'off',
      },
    },
    {
      files: ['packages/devtools/**', 'packages/create-ima-app/**'],
      rules: {
        'no-unused-vars': 'warn',
      },
      globals: {
        chrome: true,
        FB: true,
      },
    },
  ],
};
