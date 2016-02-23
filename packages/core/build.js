
var js = [
	'ima/**/!(vendorLinker|build|test|*Spec).js',
	'!ima/polyfill/*.js'
];

var mainjs = ['ima/main.js'];

var vendors = {
	common: [
		'ima-helpers'
	],

	server: [],

	client: []
};

module.exports = {
	js,
	mainjs,
	vendors
};
