module.exports = {
  'extends': ['eslint:recommended', 'prettier'],
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
      allow: ['warn', 'error', 'info']
    }]

  },
  'plugins': [
    'prettier',
    'jasmine'
  ],
  'settings': {
    'ecmascript': 2015
  },
  'parserOptions': {
    'sourceType': 'module',
    'ecmaVersion': 6,
  },
  'env': {
    'browser': true,
    'node': true,
    'es6': true,
    'jasmine': true
  },
  'globals': {
    '$IMA': true,
    '$Debug': true,
    'jest': true
  }
};
