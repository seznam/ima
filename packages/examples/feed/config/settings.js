import DocumentView from 'app/component/document/DocumentView';

export default (ns, oc, config) => {
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
						`/static/js/locale/${config.$Language}.js`,
						'/static/js/app.bundle.min.js'
					],
					documentView: DocumentView
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

		test: {
		},

		dev: {
			$Page:{
				$Render: {
					scripts: [
						'/static/js/shim.js' + versionStamp,
						'/static/js/vendor.client.js' + versionStamp,
						`/static/js/locale/${config.$Language}.js${versionStamp}`,
						'/static/js/app.client.js' + versionStamp,
						'/static/js/facebook.js' + versionStamp,
						'/static/js/hot.reload.js' + versionStamp
					]
				}
			}
		}
	};
};
