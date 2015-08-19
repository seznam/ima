module.exports = function(config) {
	config.set({
		urlRoot: '/',
		frameworks: ['jasmine'],
		port: 3002,
		logLevel: config.LOG_INFO,
		reporters: ['dots'],
		browsers: [
			'Chrome'
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
		],
		customLaunchers: {
	      Chrome_without_security: {
	        base: 'Chrome',
	        flags: ['--disable-web-security']
	      }
	    },
		plugins: [
			'karma-phantomjs-launcher',
			'karma-chrome-launcher',
			'karma-firefox-launcher',
			'karma-opera-launcher',
			'karma-jasmine'
			//'karma-coverage'
		],
		autoWatch: true,
		singleRun: false,
		colors: true
	});
};
