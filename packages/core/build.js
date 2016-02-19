module.exports = (() => {

	var js = [
		'ima/**/!(vendor|build|test|imaError.es6|*Spec).js',
		'!ima/polyfill/*.js'
	];

	var mainjs = ['ima/main.js'];

	return {
		js: js,
		mainjs: mainjs
	};
})();
