const babelParser = require('@babel/eslint-parser');
const js = require('@eslint/js');
const vitest = require('@vitest/eslint-plugin');
const importPlugin = require('eslint-plugin-import');
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
  eslintPluginPrettierRecommended,
  importPlugin.flatConfigs.recommended,
  // Vitest globals and rules scoped to test files and vitest configs
  {
    files: [
      '**/__tests__/**/*.{js,ts,tsx}',
      '**/setupVitest.{js,ts}',
      '**/vitest.config.{js,ts}',
      '**/vitest.workspace.{js,ts}',
    ],
    plugins: { vitest },
    languageOptions: {
      globals: {
        ...vitest.configs.env.languageOptions.globals,
      },
    },
    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/no-mocks-import': 'off',
      'vitest/valid-title': 'off',
      'vitest/no-done-callback': 'warn',
      'vitest/no-disabled-tests': 'warn',
      'vitest/no-conditional-expect': 'warn',
      'vitest/prefer-expect-resolves': 'warn',
      'vitest/prefer-lowercase-title': [
        'warn',
        {
          ignore: ['describe'],
        },
      ],
    },
  },
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

      // React plugin overrides
      'react/prop-types': 'off',
      'react/no-deprecated': 'off',

      // Import plugin
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
        ...globals.es2024,
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
      'import/named': 'off', // @FIXME: Doesn't work properly when importing types - https://github.com/import-js/eslint-plugin-import/issues/3048
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
    },
  },
  // Type-checkd Typescript support
  // TODO gradually enable everywhere
  {
    files: ['packages/react-page-renderer/**/!(__tests__)/*.{ts,tsx}'],
    extends: [...typescriptEslint.configs.recommendedTypeChecked],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
  {
    files: ['packages/devtools/**'],
    rules: {
      // Don't work properly with aliases
      'import/named': 'off',
      'import/namespace': 'off',
    },
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
        // devtools and create-ima-app still use Jest
        jest: true,
        describe: true,
        it: true,
        test: true,
        expect: true,
        beforeEach: true,
        afterEach: true,
        beforeAll: true,
        afterAll: true,
      },
    },
  },
  {
    files: ['packages/create-ima-app/template/**'],
    rules: {
      // Template is generated dynamically and some imports are not resolvable at the time of linting
      'import/no-unresolved': 'off',
    },
  }
);
