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
		'prettier'
	],
	'settings': {
		'ecmascript': 2016
	},
	'parserOptions': {
		'sourceType': 'module',
		'ecmaVersion': 6,
	},
	'env': {
		'browser': true,
		'node': true,
		'es6': true
	},
	'globals': {
	}
};
