module.exports = (function() {

	var config = {
		prod: {
			debug: false,
			env: 'prod',
			language:{
				'http://www.example.com': 'en'
			},
			apiServer: 'http://localhost:4001/api/v1'
		},
		dev: {
			debug: true,
			env: 'dev',
			language:{
				'http://localhost:3001': 'en'
			},
			apiServer: 'http://localhost:4001/api/v1'
		},
		test: {
			debug: true,
			env: 'test',
			language:{
				'http://localhost:3001': 'en'
			},
			apiServer: 'http://localhost:4001/api/v1'
		}
	};

	var environment = process.env.NODE_ENV || 'dev';

	if (environment === 'development') {
		environment = 'dev';
	}

	return config[environment];
})();

