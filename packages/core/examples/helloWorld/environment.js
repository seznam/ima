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
				staticFolder: '/static',
				concurency: 100,
				clusters: null
			},
			$Proxy: {
				server: 'http://www.example.com/api'
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
				'//localhost:3001': 'en',
				'//127.0.0.1:3001': 'en'
			},
			$Server: {
				concurency: 1
			},
			$Proxy: {
				server: 'http://localhost:3001/api'
			}
		}

	};

})();

