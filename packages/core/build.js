module.exports = (() => {

	var js = [
		'imajs/client/core/**/!(vendor|imaError.es6).js'
	];

	var mainjs = ['imajs/client/main.js'];

	return {
		js: js,
		mainjs: mainjs
	};
})();
