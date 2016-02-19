module.exports = (() => {

	var js = [
		'ima/**/!(vendor|imaError.es6).js'
	];

	var mainjs = ['ima/main.js'];

	return {
		js: js,
		mainjs: mainjs
	};
})();
