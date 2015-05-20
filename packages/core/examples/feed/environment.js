module.exports = (() => {

	return {
		prod: {
			$Debug: false,
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
				'//example.com': 'en'
			},
			$Server: {
				port: 3001,
				apiUrl: '/api',
				staticFolder: '/static',
				concurency: 100
			},
			$Proxy: {
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
				'//localhost:3001': 'en',
				'//10.0.133.81:3001': 'en'
			},
			$Proxy: {
				server: 'http://dock1.dev:5000/api'
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
				'//localhost:3001': 'en'
			},
			$Proxy: {
				server: 'http://api.exmaple.test'
			}
		}
	};
})();

