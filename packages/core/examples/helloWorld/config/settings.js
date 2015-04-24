export var init = (ns, oc, config) => { // jshint ignore:line

	return  {
		prod: {
			$Http: {
				baseUrl: config.$Protocol + '//www.example.com/api', // jshint ignore:line
				timeout: 7000,
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
			$Page:{
				$Render: {
					scripts: [
						'/static/js/locale/'+config.$Language+'.js',
						'/static/js/app.bundle.js'
					],
					masterView: 'App.Component.Layout.Master.View',
					masterElementId: 'page'
				}
			},
			$Static: {
				image: '/static/img/'
			}
		},

		test: {
			$Http: {
				baseUrl: config.$Protocol + '//example.test/api', // jshint ignore:line
					timeout: 5000
			}
		},

		dev: {
			$Http: {
				baseUrl: config.$Protocol + '//localhost:3001/api', // jshint ignore:line
				timeout: 2000
			},
			$Page:{
				$Render: {
					scripts: [
						'/static/js/polyfill.js',
						'/static/js/shim.js',
						'/static/js/vendor.client.js',
						'/static/js/locale/'+config.$Language+'.js',
						'/static/js/app.client.js'
					]
				}
			}
		}
	};

};
