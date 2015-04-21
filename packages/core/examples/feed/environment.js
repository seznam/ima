module.exports = (function() {

	var config = {
		prod: {
			$Debug: false,
			$Env: 'prod',
			$Language:{
				'//example.com': 'en'
			},
			$Server: {
				port: 3001,
				apiUrl: '/api',
				staticFolder: '/static'
			},
			$Proxy: {
				server: 'http://example.com/api/v1'
			}
		},
		dev: {
			$Debug: true,
			$Env: 'dev',
			/*
			 * Pair (key:value) is used for pairing urls with language.
			 * 
			 * - Key: 	Url have to start with '//' instead protocol and you can define root path. 
			 * 			Optional parameter ":language" could be defined in the end, to display language in url.
			 * 
			 * - Value: Language definition for url. If ":language" optional parameter is used, 
			 *			this language is used like default language.
			 */ 
			$Language: {
				'//localhost:3001': 'en'
			},
			$Server: {
				port: 3001,
				apiUrl: '/api',
				staticFolder: '/static'
			},
			$Proxy: {
				server: 'http://api.example.dev'
			}
		},
		test: {
			$Debug: true,
			$Env: 'test',
			$Language:{
				'//localhost:3001': 'en'
			},
			$Server: {
				port: 3001,
				apiUrl: '/api',
				staticFolder: '/static'
			},
			$Proxy: {
				server: 'http://api.exmaple.test'
			}
		}
	};

	var environment = process.env.NODE_ENV || 'dev';

	if (environment === 'development') {
		environment = 'dev';
	}

	return config[environment];
})();

