
var js = [
	'ima/**/!(vendorLinker|build|test|*Spec).js',
	'!ima/polyfill/*.js'
];

var mainjs = ['ima/main.js'];

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
