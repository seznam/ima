module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    // Eslint overrides
    'no-import-assign': 0,
    'no-console': [
      'error',
      {
        allow: ['warn', 'error']
      }
    ],

    // Prettier
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: true,
        trailingComma: 'none',
        jsxSingleQuote: true,
        bracketSameLine: false,
        arrowParens: 'avoid'
      }
    ],

    // React plugin overrides
    'react/prop-types': 0,
    'react/wrap-multilines': 0,
    'react/no-deprecated': 0,
    'react/jsx-uses-react': 0,
    'react/react-in-jsx-scope': 0
  },
  settings: {
    react: {
      version: '16'
    }
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-react']
    }
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  globals: {
    $Debug: true,
    $IMA: true,
    using: true,
    extend: true,
    spyOn: true
  }
};
