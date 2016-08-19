export let init = (ns, oc, config) => {

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
					}
				},
				cacheOptions: {
					prefix: 'http.' // Cache key prefix for response bodies (already parsed as JSON) of completed HTTP requests.
				}
			},
			$Cache: {
				enabled: true,
				ttl: 60000
			},
			$Page: {
				$Render: {
					scripts: [
						'/static/js/locale/' + config.$Language + '.js',
						'/static/js/app.bundle.min.js'
					],
					documentView: 'app.component.document.View'
				}
			},
			$Static: {
				image: '/static/img',
				css: '/static/css'
			},
			Api: {
				baseUrl: config.$Protocol + '//localhost:3001/api',
				items: '/items',
				categories: '/categories'
			},
			Images: {
				fbShare: '/imajs-share.png'
			}
		},
		dev: {
			$Page:{
				$Render: {
					scripts: [
						'/static/js/shim.js',
						'/static/js/vendor.client.js',
						'/static/js/locale/' + config.$Language + '.js',
						'/static/js/app.client.js',
						'/static/js/facebook.js',
						'/static/js/hot.reload.js'
					],
					documentView: 'app.component.document.View',
					masterElementId: 'page'
				}
			}
		},
		test: {
			$Page: {
				$Render: {
					scripts: [
						'/static/js/shim.js',
						'/static/js/vendor.client.js',
						'/static/js/locale/' + config.$Language + '.js',
						'/static/js/app.client.js',
						'/static/js/facebook.js'
					],
					documentView: 'app.component.Document.View',
					masterElementId: 'page'
				}
			}
		}
	};
};
