const babelParser = require('@babel/eslint-parser');
const js = require('@eslint/js');
const importPlugin = require('eslint-plugin-import');
const jest = require('eslint-plugin-jest');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const reactPlugin = require('eslint-plugin-react');
const globals = require('globals');
const typescriptEslint = require('typescript-eslint');

module.exports = typescriptEslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/docs/**',
      '**/.docusaurus/**',
      '**/coverage/**',
      'packages/create-ima-app/**/.eslintrc.js',
      'packages/create-ima-app/examples/todos/assets/**',
    ],
  },
  js.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  jest.configs['flat/recommended'],
  jest.configs['flat/style'],
  eslintPluginPrettierRecommended,
  importPlugin.flatConfigs.recommended,
  {
    rules: {
      'no-console': [
        'error',
        {
          allow: ['warn', 'error'],
        },
      ],
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
          caughtErrors: 'none',
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
      'jest/no-mocks-import': 'off',
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

      // React plugin overrides
      'react/prop-types': 'off',
      'react/no-deprecated': 'off',

      // Import plugin
      'import/named': 'off',
      'import/no-unresolved': [
        'warn',
        {
          ignore: [
            '^@\\/', // ignore @/* aliases
            '@(docusaurus|theme)',
          ],
        },
      ],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal'],
          pathGroups: [
            {
              pattern: '{preact|react|svelte|docusaurus|theme}{/**,**}',
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
      react: {
        version: 'detect',
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.mjs', '.json'],
        },
        typescript: {
          project: './packages/*/tsconfig.json',
        },
      },
    },
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        sourceType: 'module',
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react'],
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
        $Debug: true,
        $IMA: true,
      },
    },
  },
  // Typescript support
  {
    files: ['**/*.{ts,tsx}'],
    extends: [...typescriptEslint.configs.recommended],
    languageOptions: {
      ...typescriptEslint.configs.recommended.languageOptions,
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json', './packages/*/tsconfig.json'],
      },
    },
    rules: {
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        { 'ts-expect-error': false },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
          args: 'none',
          caughtErrors: 'none',
        },
      ],
      '@typescript-eslint/no-namespace': ['error', { allowDeclarations: true }],
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowObjectTypes: 'always', allowInterfaces: 'always' },
      ],
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      'import/named': 'off',
      'import/namespace': 'off',
    },
  },
  // Type-checkd Typescript support
  // TODO gradually enable everywhere
  {
    files: ['./packages/react-page-renderer/**/!(__tests__)/*.{ts,tsx}'],
    extends: [...typescriptEslint.configs.recommendedTypeChecked],
  },
  // Website/docs overrides
  {
    files: ['website/**'],
    rules: {
      'react/react-in-jsx-scope': 'error',
      'react/jsx-uses-react': 'error',
    },
  },
  // Other overrides
  {
    files: [
      'website/scripts/**',
      'packages/cli/**',
      'packages/hmr-client/**',
      'packages/plugin-cli/**',
      'packages/dev-utils/**',
      'packages/create-ima-app/**',
    ],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['packages/devtools/**', 'packages/create-ima-app/**'],
    languageOptions: {
      globals: {
        chrome: true,
        FB: true,
      },
    },
  }
);
