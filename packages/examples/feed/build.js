module.exports = (() => {

	var mainjs = ['./app/main.js'];

	var js = [
		'./app/!(assets|gulp)/**/!(*Spec).{js,jsx}'
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
			'./build/static/js/app.client.js',
			'./server/static/js/facebook.js'
		],
		css: [
			'./build/static/css/app.css'
		]
	};

	return {
		js,
		mainjs,
		vendors,
		less,
		languages,
		bundle
	};
})();
