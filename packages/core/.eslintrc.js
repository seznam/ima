module.exports = {
	'extends': ['eslint:recommended', 'prettier', 'prettier/react', 'plugin:react/recommended'],
	'parser': 'babel-eslint',
	'rules': {
		'prettier/prettier': [
			'error', {
				singleQuote: true,
				semi: true,
				useTabs: true,
				tabWidth: 4,
				jsxBracketSameLine: true
			}
		],

		'no-console': ['error', {
			allow: ['warn', 'error']
		}],

		'react/prop-types': 0,
		'react/wrap-multilines': 0
	},
	'plugins': [
		'prettier',
		'jest',
		'react',
		'jasmine'
	],
	'settings': {
		'ecmascript': 2015,
		'jsx': true
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
		'using': true,
		'extend': true
	}
};
