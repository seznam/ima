module.exports = (function() {

	var js = [
		'./app/config/*.js',
		'./app/base/*.js',
		'./app/page/*.js',
		'./app/page/*.jsx',
		'./app/page/**/*.js',
		'./app/page/**/*.jsx',
		'./app/component/**/*.js',
		'./app/component/**/*.jsx'
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

	var bundle = {
		js: [],
		css: []
	};

	return {
		js: js,
		less: less,
		languages: languages,
		bundle: bundle
	};
})();