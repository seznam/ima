module.exports = (function() {

	var js = [
		'imajs/client/core/namespace.js',
		'imajs/client/core/component.js',
		'imajs/client/core/objectContainer.js',
		//'imajs/client/core/objectContainer.js',
		'imajs/client/core/bootstrap.js',
		'imajs/client/core/imaError.js',
		'imajs/client/core/interface/*.js',
		'imajs/client/core/config/*.js',
		'imajs/client/core/abstract/*.js',
		'imajs/client/core/dictionary/*.js',
		'imajs/client/core/http/*.js',
		'imajs/client/core/file/*.js',
		'imajs/client/core/cache/*.js',
		'imajs/client/core/helper/*.js',
		'imajs/client/core/page/render/*.js',
		'imajs/client/core/page/*.js',
		'imajs/client/core/router/*.js',
		'imajs/client/core/meta/*.js',
		'imajs/client/core/decorator/*.js',
		'imajs/client/core/event/*.js',
		'imajs/client/core/storage/map.js',
		'imajs/client/core/storage/*.js',
		'imajs/client/core/window/*.js'
	];

	var mainjs = ['imajs/client/main.js'];

	return {
		js: js,
		mainjs: mainjs
	};
})();