module.exports = {
  'extends': ['eslint:recommended', 'plugin:react/recommended', 'prettier', 'prettier/react'],
  'parser': 'babel-eslint',
  'rules': {
    'prettier/prettier': [
      'error', {
        singleQuote: true,
        semi: true,
        jsxBracketSameLine: true
      }
    ],

    'no-console': ['error', {
      allow: ['warn', 'error']
    }],

    'react/prop-types': 0,
    'react/wrap-multilines': 0,
    'react/no-deprecated': 0
  },
  'plugins': [
    'prettier',
    'jest',
    'react',
    'jasmine'
  ],
  'settings': {
    'ecmascript': 2015,
    'jsx': true,
    'react': {
      'version': '16'
    }
  },
  'parserOptions': {
    'sourceType': 'module',
    'ecmaVersion': 6,
    'ecmaFeatures': {
      'jsx': true
    }
  },
  'env': {
    'browser': true,
    'node': true,
    'es6': true,
    'jasmine': true,
    'jest/globals': true
  },
  'globals': {
    '$Debug': true,
    '$IMA': true,
    'FB': true,
    'using': true,
    'extend': true
  }
};
