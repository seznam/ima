module.exports = (() => {

	var js = [
		'ima/core/**/!(vendor|imaError.es6).js'
	];

	var mainjs = ['ima/client/main.js'];

	return {
		js: js,
		mainjs: mainjs
	};
})();
