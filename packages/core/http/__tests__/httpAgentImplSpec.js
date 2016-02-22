describe('Ima.Http.HttpAgentImpl', function() {

	var proxy = null;
	var http = null;
	var cache = null;
	var cookie = null;
	var options = null;
	var data = null;
	var httpConfig = null;
	var cacheStorage = null;
	var cacheFactory = null;
	var Helper = ns.Vendor.$Helper;

	beforeEach(function() {
		cacheStorage = oc.create('$MapStorage');
		cacheFactory = oc.create('$CacheFactory');
		cache = oc.create('Ima.Cache.CacheImpl', [cacheStorage, cacheFactory, Helper, {enabled: true, ttl: 1000}]);

		proxy = oc.create('$SuperAgentProxy');
		cookie = oc.create('$CookieStorage');
		httpConfig = {
			defaultRequestOptions: {
				timeout: 7000,
				repeatRequest: 1,
				ttl: 0,
				headers: {
					'Accept': 'application/json',
					'Accept-Language': 'en'
				},
				cache: true
			},
			cacheOptions: {
				prefix: 'http.'
			}
		};

		http = oc.create('Ima.Http.HttpAgentImpl', [proxy, cache, cookie, httpConfig]);

		options = {
			ttl: httpConfig.defaultRequestOptions.ttl,
			timeout: httpConfig.defaultRequestOptions.timeout,
			repeatRequest: httpConfig.defaultRequestOptions.repeatRequest,
			headers: {},
			cache: true,
			withCredentials: true,
			language: httpConfig.defaultRequestOptions.language
		};

		data = {
			status: 200,
			body: 111,
			params:{
				url: 'url',
				data: {},
				options: options
			},
			header:{
				'set-cookie':[
					'cookie1=cookie1',
					'cookie2=cookie2'
				]
			}
		};
	});

	using([
		'get',
		'post',
		'put',
		'patch',
		'delete'
	], function(method) {
		describe(method + ' method', function() {

			beforeEach(function() {
				data.params.method = method;
			});

			it('should be return resolved promise with data', function(done) {
				spyOn(proxy, 'request')
					.and
					.callFake(function() {
						return Promise.resolve(data);
					});

				spyOn(proxy, 'haveToSetCookiesManually')
					.and
					.returnValue(false);

				http[method](data.params.url, data.params.data, data.params.options)
					.then(function(response) {
						var agentResponse = {
							status: data.status,
							params: data.params,
							body: data.body,
							headers: data.header,
							cached: false
						};

						expect(response).toEqual(agentResponse);
						done();
					})
					.catch(function(e) {
						console.error(e.message, e.stack);
						done();
					});
			});

			it('should be rejected with error', function(done) {
				spyOn(proxy, 'request')
					.and
					.callFake(function() {
						return Promise.reject(data.params);
					});

				http[method](data.params.url, data.params.data, data.params.options)
					.then(function() {}, function(error) {
						expect(error instanceof ns.Ima.IMAError).toBe(true);
						expect(proxy.request.calls.count()).toEqual(2);
						done();
					});
			});

			it('should be setted cookie', function(done) {
				spyOn(proxy, 'request')
					.and
					.callFake(function() {
						return Promise.resolve(data);
					});
				spyOn(proxy, 'haveToSetCookiesManually')
					.and
					.returnValue(true);
				spyOn(cookie, 'parseFromSetCookieHeader');

				http[method](data.params.url, data.params.data, data.params.options)
					.then(function() {
						expect(cookie.parseFromSetCookieHeader.calls.count()).toEqual(2);
						done();
					});
			});
		});
	});
});
