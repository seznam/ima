describe('Core.Http.Agent', function() {

	var proxy = null;
	var http = null;
	var cache = null;
	var cookie = null;
	var options = null;
	var data = null;
	var httpConfig = null;

	beforeEach(function() {
		proxy = oc.get('$HttpProxy');
		cache = oc.create('Core.Cache.Handler', oc.create('$MapStorage'), oc.get('$CACHE_CONFIG'));
		cookie = oc.make('Core.Storage.Cookie');
		httpConfig = oc.get('$HTTP_CONFIG');
		http = oc.create('Core.Http.Agent', proxy, cache, cookie, httpConfig);

		options = {ttl: httpConfig.ttl, timeout: httpConfig.timeout, repeatRequest: httpConfig.repeatRequest, language: httpConfig.language};

		data = {
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

				http[method](data.params.url, data.params.data, data.params.options)
					.then(function(respond) {
						expect(respond).toEqual(data.body);
						done();
					})
			});

			it('should be rejected with error', function(done) {
				spyOn(proxy, 'request')
					.and
					.callFake(function() {
						return Promise.reject(data.params);
					});

				http[method](data.params.url, data.params.data, data.params.options)
					.then(function() {}, function(error) {
						expect(error.getName()).toEqual('CoreError');
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