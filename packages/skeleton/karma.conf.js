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
			'./build/static/js/polyfill.js',
			'./build/static/js/shim.js',
			'./build/static/js/vendor.client.test.js',
			'./build/static/js/ima.client.js',
			'./build/static/js/locale/cs.js',
			'./build/static/js/app.client.js',
			'./app/**/*Spec.{js,jsx}'
		],
		preprocessors: {
			'./app/**/*Spec.jsx': ['babel']
		//	'./node_modules/ima/**/__tests__/*Spec.js': ['babel']
		},
		babelPreprocessor: {
			options: {
				presets: ['react'],
				sourceMap: 'inline'
			},
			filename: function(file) {
				return file.originalPath.replace(/\.jsx$/, '.js');
			},
			sourceFileName: function(file) {
				return file.originalPath;
			}
		},
		customLaunchers: {
			Chrome_without_security: {
				base: 'Chrome',
				flags: ['--disable-web-security']
			}
		},
		plugins: [
			'karma-phantomjs-launcher',
			'karma-babel-preprocessor',
			'karma-jasmine'
			//'karma-coverage'
		],
		phantomjsLauncher: {
			exitOnResourceError: true
		},
		autoWatch: true,
		singleRun: false,
		colors: true
	});
};
