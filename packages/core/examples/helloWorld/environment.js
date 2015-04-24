module.exports = (() => {

	return {
		prod: {
			$Debug: false,
			$Language:{
				'//example.com': 'en'
			},
			$Server: {
				port: 3001,
				apiUrl: '/api',
				staticFolder: '/static'
			},
			$Proxy: {
				server: 'http://localhost:3001/api/v1'
			}
		},

		test: {
			$Debug: true,
			$Language:{
				'//example.test': 'en'
			}
		},

		dev: {
			$Debug: true,
			$Language:{
				'//localhost:3001': 'en'
			}
		}

	};

})();

