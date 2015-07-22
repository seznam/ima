var versionCoef = 1000 * 30;
var version = Math.round(new Date().getTime() / versionCoef) * versionCoef;

module.exports = (() => {

	//Production environment is used as default values for configuration items in other environments.
	return {
		prod: {
			$Debug: false,  // Debug mode.
			$Version: version, // Current server version. Version value is used for static assets timestamp.
			$Language:{     // Set domain, root and language. You have opportunity use '//*:*' as default for all request.
				'//example.com': 'en'
			},
			$Server: {
				port: 3001, // Port where server listen.
				staticFolder: '/static',    // Define path for static folder.
				concurrency: 100,    // Node prepared defined number of app instances. It is performance improvements. Concurrency
				clusters: null,   // Define number of cluster you want to create. Null value is number of CPUs.
				serveSPA: {
					allow: true,    // if node cluster will have lot's of request to process, then it start serve SPA page.
					blackList: ['Googlebot', 'SeznamBot'] // This user agents will always be serve as isomorphic page.
				}
			},
			$Proxy: {   // Proxy pass all request from $Proxy.path to defined server url. It should be used only for dev environment.
				path: '/api', // Url which would be proxy pass to $Proxy.server.
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

