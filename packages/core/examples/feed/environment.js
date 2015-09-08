var versionCoef = 1000 * 30;
var version = Math.round(new Date().getTime() / versionCoef) * versionCoef;

module.exports = (() => {

	return {
		prod: {
			$Debug: false,
			$Version: version,
			/*
			 * Pair (key:value) is used for pairing urls with language.
			 * 
			 * - Key: 	Url have to start with '//' instead protocol and you can define root path. 
			 * 			Optional parameter ":language" could be defined in the end, to display language in url.
			 * 
			 * - Value: Language definition for url. If ":language" optional parameter is used, 
			 *			this language is used like default language.
			 */ 
			$Language:{
				'//*.*': 'en'
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
				server: 'http://example.com/api/v1'
			}
		},
		dev: {
			$Debug: true,
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
			$Proxy: {
				server: 'http://api.exmaple.dev'
			}
		},
		test: {
			$Debug: true,
			/*
			 * Pair (key:value) is used for pairing urls with language.
			 * 
			 * - Key: 	Url have to start with '//' instead protocol and you can define root path. 
			 * 			Optional parameter ":language" could be defined in the end, to display language in url.
			 * 
			 * - Value: Language definition for url. If ":language" optional parameter is used, 
			 *			this language is used like default language.
			 */ 
			$Language:{
				'//*:*': 'en'
			},
			$Proxy: {
				server: 'http://api.exmaple.test'
			}
		}
	};
})();

