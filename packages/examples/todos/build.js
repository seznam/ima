module.exports = (function() {

	var js = [
		'./app/config/*.js',
		'./app/base/*.js',
		'./app/model/**/*.js',
		'./app/component/**/*.js',
		'./app/component/**/*.jsx',
		'./app/page/*.js',
		'./app/page/*.jsx',
		'./app/page/**/*.js',
		'./app/page/**/*.jsx'
	];

	var less = [
		'./app/assets/less/app.less',
		'./app/assets/bower/todomvc-common/base.css',
		'./app/assets/bower/todomvc-app-css/index.css',
		'./app/component/**/*.less',
		'./app/page/**/*.less'
	];

	var languages = [
		'en'
	];

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

	return {
		js: js,
		less: less,
		languages: languages,
		bundle: bundle
	};
})();
