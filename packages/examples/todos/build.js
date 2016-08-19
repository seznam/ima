var mainjs = ['./app/main.js'];

var js = [
	'./app/!(assets|gulp)/**/!(*Spec).{js,jsx}'
];

var less = [
	'./app/assets/less/app.less',
	'./app/assets/bower/todomvc-common/base.css',
	'./app/assets/bower/todomvc-app-css/index.css',
	'./app/component/**/*.less',
	'./app/page/**/*.less'
];

var languages = {
	en : [
		'./app/**/*EN.json'
	]
};

var vendors = {
	common: [
		'ima'
	],

	server: [
	],

	client: [
	],

	test: [
	]
};

var bundle = {
	js: [
		'./build/static/js/polyfill.js',
		'./build/static/js/shim.js',
		'./build/static/js/vendor.client.js',
		'./build/static/js/app.client.js'
	],
	css: [
		'./build/static/css/app.css'
	]
};

module.exports = {
	js,
	mainjs,
	less,
	languages,
	vendors,
	bundle
};
