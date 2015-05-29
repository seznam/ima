export var init = (ns, oc, config) => {

	return {
		prod: {
			$Http: {
				baseUrl: config.$Protocol + '//www.example.com/api',
				timeout: 2000,
				repeatRequest: 1,
				ttl: 0,
				accept: 'application/json',
				cachePrefix: 'http.',
				cachePrefixPromise: 'http.promise.',
				language: config.$Language
			},
			$Cache: {
				enabled: true,
				ttl: 60000
			},
			$Page: {
				$Render: {
					scripts: [
						'/static/js/locale/'+config.$Language+'.js',
						'/static/js/app.bundle.min.js'
					],
					documentView: 'App.Component.Document.View',
					masterElementId: 'page'
				}
			},
			$Static: {
				image: '/static/img'
			},
			Api: {
				items: '/items',
				categories: '/categories'
			},
			Images: {
				fbShare: '/imajs-share.png'
			}
		},
		dev: {
			$Http: {
				baseUrl: config.$Protocol + '//localhost:3001/api'
			},
			$Page:{
				$Render: {
					scripts: [
						'/static/js/shim.js',
						'/static/js/vendor.client.js',
						'/static/js/locale/'+config.$Language+'.js',
						'/static/js/app.client.js',
						'/static/js/facebook.js'
					],
					documentView: 'App.Component.Document.View',
					masterElementId: 'page'
				}
			}
		},
		test: {
			$Http: {
				baseUrl: config.$Protocol + '//www.example.test/api' // jshint ignore:line
			},
			$Page: {
				$Render: {
					scripts: [
						'/static/js/shim.js',
						'/static/js/vendor.client.js',
						'/static/js/locale/'+config.$Language+'.js',
						'/static/js/app.client.js',
						'/static/js/facebook.js'
					],
					documentView: 'App.Component.Document.View',
					masterElementId: 'page'
				}
			}
		}
	};
};
