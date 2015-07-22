var versionCoef = 1000 * 30;
var version = Math.round(new Date().getTime() / versionCoef) * versionCoef;

module.exports = (() => {

	return {
		prod: {
			$Debug: false,
			$Version: version,
			$Language: {
				'//example.com': 'en'
			},
			$Server: {
				port: 3001,
				staticFolder: '/static',
				concurrency: 100,
				clusters: null,
				serveSPA: {
					allow: true,
					blackList: ['Googlebot', 'SeznamBot']
				}
			},
			$Proxy: {
				path: '/api',
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
				'//*:*': 'en'
			},
			$Server: {
				concurrency: 0
			},
			$Proxy: {
				server: 'http://localhost:3001/api'
			}
		}

	};

})();

