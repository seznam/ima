
var js = [
	'./node_modules/ima/**/!(vendorLinker|build|test|*Spec).js',
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

	client: []
};

module.exports = {
	js,
	mainjs,
	vendors
};
