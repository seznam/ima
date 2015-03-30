module.exports = (function() {

	var js = [
		'imajs/client/core/namespace/*.js',
		'imajs/client/core/objectContainer/*.js',
		'imajs/client/core/boot/*.js',
		'imajs/client/core/interface/*.js',
		'imajs/client/core/config/*.js',
		'imajs/client/core/abstract/*.js',
		'imajs/client/core/dictionary/*.js',
		'imajs/client/core/http/*.js',
		'imajs/client/core/file/*.js',
		'imajs/client/core/cache/*.js',
		'imajs/client/core/helper/*.js',
		'imajs/client/core/error/*.js',
		'imajs/client/core/pageRender/*.js',
		'imajs/client/core/router/*.js',
		'imajs/client/core/seo/*.js',
		'imajs/client/core/decorator/*.js',
		'imajs/client/core/socket/*.js',
		'imajs/client/core/dispatcher/*.js',
		'imajs/client/core/storage/*.js',
		'imajs/client/core/helper/*.js',
		'imajs/client/core/animate/*.js'
	];

	var mainjs = ['imajs/client/main.js'];

	return {
		js: js,
		mainjs: mainjs
	};
})();