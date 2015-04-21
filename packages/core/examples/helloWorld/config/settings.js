export var init = (ns, oc, config) => { // jshint ignore:line

	var nsSetting = ns.namespace('$Settings');

	var settings = {
		dev: {
			$Http: {
				baseUrl: config.$Protocol + '//localhost:3001/api', // jshint ignore:line
				timeout: 2000,
				repeatRequest: 1,
				ttl: 0,
				accept: 'application/json',
				cachePrefix: 'http.',
				cachePrefixPromise: 'http.promise.'
			},
			$Socket:{
				webSocketUrl: '//localhost:3031',
				maxRepeatedAttempts: 2
			},
			$Cache: {
				enabled: true,
				ttl: 60000
			},
			$Page:{
				$Render: {
					scripts: [
						'/static/js/shim.js',
						'/static/js/vendor.client.js',
						'/static/js/locale/'+config.$Language+'.js',
						'/static/js/app.client.js'
					],
					masterView: 'App.Component.Layout.Master.View',
					masterElementId: 'page'
				}
			},
			$Static: {
				image: '/static/img/'
			}
		},
		prod: {
			$Http: {
				baseUrl: config.$Protocol + '//www.example.com/api', // jshint ignore:line
				timeout: 2000,
				repeatRequest: 1,
				ttl: 0,
				accept: 'application/json',
				cachePrefix: 'http.',
				cachePrefixPromise: 'http.promise.'
			},
			$Socket:{
				webSocketUrl: '//www.example.com',
				maxRepeatedAttempts: 2
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
				baseUrl: config.$Protocol + '//localhost:3001/api', // jshint ignore:line
					timeout: 2000,
					repeatRequest: 1,
					ttl: 0,
					accept: 'application/json',
					cachePrefix: 'http.',
					cachePrefixPromise: 'http.promise.'
			},
			$Socket:{
				webSocketUrl: '//localhost:3031',
				maxRepeatedAttempts: 2
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
		}
	};

	var envSettings = settings[config.$Env]; // jshint ignore:line

	for (var envKey of Object.keys(envSettings)) {
		nsSetting[envKey] = envSettings[envKey];
	}

	nsSetting['$Env'] = config.$Env; // jshint ignore:line
	nsSetting['$Protocol'] = config.$Protocol; // jshint ignore:line
	nsSetting['$Language'] = config.$Language; // jshint ignore:line
	nsSetting['$Domain'] = config.$Domain; // jshint ignore:line
	nsSetting['$Root'] = config.$Root; // jshint ignore:line
	nsSetting['$LanguagePartPath'] = config.$LanguagePartPath; // jshint ignore:line
};
