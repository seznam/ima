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
			$Api: {
				server: 'http://example.com/api/v1'
			}
		},
		dev: {
			$Debug: true,
			$Env: 'dev',
			$Language:{
				'//localhost:3001': 'en'
			},
			$Server: {
				port: 3001,
				apiUrl: '/api',
				staticFolder: '/static'
			},
			$Api: {
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
			$Api: {
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

