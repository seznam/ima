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
