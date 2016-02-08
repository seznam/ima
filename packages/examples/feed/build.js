module.exports = (() => {

	var js = [
		'./app/config/*.js',
		'./app/interface/**/*.js',
		'./app/interface/**/*.jsx',
		'./app/base/**/*.js',
		'./app/base/**/*.jsx',
		'./app/module/**/*.js',
		'./app/module/**/*.jsx',
		'./app/component/**/*.js',
		'./app/component/**/*.jsx',
		'./app/page/*.js',
		'./app/page/*.jsx',
		'./app/page/**/*.js',
		'./app/page/**/*.jsx'
	];

	var less = [
		'./app/assets/less/trivia.less',
		'./app/assets/less/rem.less',
		'./app/assets/less/grid.less',
		'./app/assets/less/app.less',
		'./app/assets/bower/1680540/reset.less',
		'./app/assets/bower/lesshat/build/lesshat-prefixed.less',
		'./app/assets/less/setting.less',
		'./app/assets/bower/Responsable-Framework/assets/less/grid.less',
		'./app/assets/less/base.less',
		'./app/assets/less/layout.less',
		'./app/assets/less/main.less',
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
			'./build/static/js/app.client.js',
			'./server/static/js/facebook.js'
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
