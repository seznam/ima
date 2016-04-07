var versionCoef = 1000 * 30;
var version = '' + (Math.round(new Date().getTime() / versionCoef) * versionCoef);

module.exports = (() => {

	return {
		// The production environment is used as a template for configuration
		// of other environments
		prod: {
			$Debug: false, // Debug mode
			$Version: version, // Current server version. Version value is used
							   // for static assets timestamp.
			/*
			 * Key-value pairs used for configuring the languages used with
			 * specific hosts or starting paths.
			 *
			 * - Key: Has to start with '//' instead of a protocol, and you can
			 *        define the root path. Optional parameter ":language"
			 *        could be defined at the end to display language in the
			 *        URL.
			 *
			 * - Value: Language to use when the key is matched by the current
			 *          URL. If the ":language" parameter is used, the language
			 *          specified in this value is used as the default language
			 *          when the path part specifying the language is not
			 *          present in the current URL.
			 */
			$Language: {
				'//*:*': 'en'
			},
			$Server: {
				port: 3001, // The port at which the server listens for
							// incoming HTTP connections
				staticFolder: '/static', // Define the path to the folder with
										 // static assets
				concurrency: 100, // The number of application instances (not
								  // threads) used to handle concurrent
								  // connections within a single thread
				clusters: null, // Define the number of server processes you
								// want to start. Use null for the current
								// number of available CPU cores.
				serveSPA: {
					allow: true, // When enabled, and the number of concurrent
								 // connection exceeds the concurrency, the
								 // server will serve the application in SPA
								 // mode (without server-side rendering)
					blackList: ['Googlebot', 'SeznamBot'] // These user agents
														  // will always be
														  // served a
														  // server-rendered
														  // page
				},
				cache: {
					// boolean, or function(Express.Request): boolean
					enabled: false,

					// null or function(Express.Request): string
					cacheKeyGenerator: null,

					// the maximum time a cache entry is kept
					entryTtl: 60 * 60 * 1000, // milliseconds

					// the time after which the unused entries are discarded
					unusedEntryTtl: 15 * 60 * 1000 // milliseconds
				},
				logger: {
					formatting: 'simple' // use "simple" or "JSON"
				}
			},
			$Proxy: { // Configuration of REST API proxy. All requests to the
			          // specified path will be proxies to the specified
			          // server. This proxy should be used only in dev
			          // environment because of performance a possible security
			          // concerns.
				path: '/api', // Path at which the proxy will be listening for
							  // request
				server: 'https://example.com/api/v1'
			}
		},

		test: {
			$Language: {
				'//*:*': 'en'
			},
			$Proxy: {
				server: 'http://example.test/api'
			}
		},

		dev: {
			$Debug: true,
			$Language: {
				'//*:*': 'en'
			},
			$Server: {
				concurrency: 1
			},
			$Proxy: {
				server: 'http://localhost:3001/api'
			}
		}
	};
})();
