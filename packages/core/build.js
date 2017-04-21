const js = [
	'./node_modules/ima/**/!(vendorLinker|gulpfile|build|test|*Spec).{js,jsx}',
	'!./node_modules/ima/polyfill/*.js'
];

const mainjs = [
	'./node_modules/ima/main.js'
];

const vendors = {
	common: [
		'ima-helpers',
		'classnames',
		'react',
		'react-dom',
		'prop-types',
		'superagent'
	],

	server: [
		'react-dom/server.js'
	],

	client: [],

	test: [
		'ima/test.js',
		'react-addons-test-utils',
		'enzyme'
	]
};

module.exports = {
	js,
	mainjs,
	vendors
};
