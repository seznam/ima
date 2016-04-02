
var js = [
	'./node_modules/ima/**/!(vendorLinker|build|test|*Spec).{js,jsx}',
	'!./node_modules/ima/polyfill/*.js'
];

var mainjs = ['./node_modules/ima/main.js'];

var vendors = {
	common: [
		'ima-helpers',
		'react',
		'react-dom',
		'superagent'
	],

	server: [
		'react-dom/server.js'
	],

	client: [],

	test: [
		'ima/test.js',
		'react-addons-test-utils'
	]
};

module.exports = {
	js,
	mainjs,
	vendors
};
