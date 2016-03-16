var mainjs = ['./app/main.js'];

var js = [
	'./app/!(assets|gulp)/**/!(*Spec).{js,jsx}'
];

var less = [
	'./app/assets/less/app.less',
	'./app/assets/less/setting.less',
	'./app/assets/less/base.less',
	'./app/assets/less/layout.less',
	'./app/assets/less/main.less',
	'./app/component/**/*.less',
	'./app/page/**/*.less'
];

var languages = [
	'cs',
	'en'
];

var vendors = {
	common: [
	],

	server: [
	],

	client: [
	]
};

var bundle = {
	js: [
		'./build/static/js/polyfill.js',
		'./build/static/js/shim.js',
		'./build/static/js/vendor.client.js',
		'./build/static/js/ima.client.js',
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
