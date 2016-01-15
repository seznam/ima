module.exports = function(config) {
	config.set({
		urlRoot: '/',
		frameworks: ['jasmine'],
		port: 3002,
		logLevel: config.LOG_INFO,
		reporters: ['dots'],
		browsers: [
			'PhantomJS'
		],
		files: [
			'./imajs/client/test.js',
			'./build/static/js/polyfill.js',
			'./build/static/js/shim.js',
			'./build/static/js/vendor.client.js',
			'./build/static/js/locale/cs.js',
			'./build/static/js/app.client.js',
			'./app/test/**/*.js',
			'./app/test/*.js',
			'./imajs/client/test/**/*.js',
			'./imajs/client/test/*.js'
		]/*,
		preprocessors: {
			'./app/test/*.js': ['babel'],
			'./imajs/client/test/*.js': ['babel']
		},
		babelPreprocessor: {
			options: {
				presets: ['es2015'],
				sourceMap: 'inline'
			},
			filename: function (file) {
				return file.originalPath.replace(/\.js$/, '.es5.js');
			},
			sourceFileName: function (file) {
				return file.originalPath;
			}
		}*/,
		customLaunchers: {
	      Chrome_without_security: {
	        base: 'Chrome',
	        flags: ['--disable-web-security']
	      }
	    },
		plugins: [
			'karma-phantomjs-launcher',
			//'karma-babel-preprocessor',
			'karma-jasmine'
			//'karma-coverage'
		],
		autoWatch: true,
		singleRun: false,
		colors: true
	});
};
