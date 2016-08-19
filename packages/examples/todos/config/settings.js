export let init = (ns, oc, config) => { // jshint ignore:line
	let versionStamp = `?version=${config.$Version}`;

	return {
		prod: {
			$Http: {
				defaultRequestOptions: {
					timeout: 7000,  // Request timeout
					repeatRequest: 1,   // Count of automatic repeated request after failing request.
					ttl: 0, // Default time to live for cached request in ms.
					headers: {  // Set default request headers
						'Accept': 'application/json',
						'Accept-Language': config.$Language
					},
					cache: true
				},
				cacheOptions: {
					prefix: 'http.' // Cache key prefix for response bodies (already parsed as JSON) of completed HTTP requests.
				}
			},
			$Cache: {
				enabled: true,
				ttl: 60000
			},
			$Page:{
				$Render: {
					scripts: [
						'/static/js/locale/' + config.$Language + '.js' + versionStamp,
						'/static/js/app.bundle.min.js' + versionStamp
					],
					documentView: 'app.component.document.View'
				}
			},
			$Static: {
				image: '/static/img',
				css: '/static/css',
				js: '/static/js'
			}
		},

		test: {
			$Http: {
				defaultRequestOptions: {
					timeout: 5000
				}
			}
		},

		dev: {
			$Http: {
				defaultRequestOptions: {
					timeout: 2000
				}
			},
			$Page:{
				$Render: {
					scripts: [
						'/static/js/polyfill.js' + versionStamp,
						'/static/js/shim.js' + versionStamp,
						'/static/js/vendor.client.js' + versionStamp,
						'/static/js/locale/' + config.$Language + '.js' + versionStamp,
						'/static/js/app.client.js' + versionStamp,
						'/static/js/hot.reload.js' + versionStamp
					]
				}
			}
		}
	};
};
