describe('Ima.Http.Proxy', function() {

	var proxy = null;
	var apiUrl = 'http://localhost:3001/api/';
	var response = {
		body: {
			data: 'some data'
		}
	};
	var superAgent = null;

	var data = {};
	var options = {ttl: 3600000, timeout: 2000, repeatRequest: 1, headers: [], withCredentials: true};
	var HTTP_STATUS_CODE = oc.get('$HTTP_STATUS_CODE');
	var httpTransformer = oc.get('$HttpTransformer');
	var windowHelper = oc.get('$Window');

	beforeEach(function() {
		superAgent = {
			funcError: null,
			get: function() { return this; },
			post: function(){ return this; },
			put: function(){ return this; },
			del: function(){ return this; },
			patch: function() { return this; },
			set: function() { return this; },
			accept: function() { return this; },
			query: function() { return this; },
			send: function() { return this; },
			withCredentials: function() { return this; },
			timeout: function() {
				var self = this;
				setTimeout(function() {
					self.funcError({timeout: options.timeout});
				},options.timeout);
				return this; },
			end: function() {
				return this;
			}
		};

		proxy = oc.create('Ima.Http.Proxy', [superAgent, HTTP_STATUS_CODE, httpTransformer, windowHelper]);

		jasmine.clock().install();
	});

	afterEach(function() {
		jasmine.clock().uninstall();
	});

	using([
		'get',
		'post',
		'put',
		'delete',
		'patch'
	], function(method) {
		describe('method ' + method, function() {
			it('should return promise with response body', function(done) {
				spyOn(superAgent, 'end')
					.and
					.callFake(function(callback) {
						return callback(null, response);
					});

				proxy.request(method, apiUrl, data, options)
					.then(function(result) {
						expect(result.body).toEqual(response.body);
						done();
					})
					.catch(function(e){console.log(e); done();});
			});

			it('should reject promise for Timeout error', function(done) {
				spyOn(superAgent, 'end')
					.and
					.callFake(function(callback) {
						return callback({timeout: options.timeout});
					});

				proxy.request(method, apiUrl, data, options)
					.then(function(){}, function(error){
						expect(error.status).toEqual(HTTP_STATUS_CODE.TIMEOUT);
						done();
					});
			});

			it('should be timeouted for longer request then options.timeout', function(done) {
				spyOn(superAgent, 'end')
					.and
					.callFake(function(callback) {
						superAgent.funcError = callback;
						jasmine.clock().tick(options.timeout + 1);
					});


				proxy.request(method, apiUrl, data, options)
					.then(function() {},function(error){
						expect(error.status).toEqual(HTTP_STATUS_CODE.TIMEOUT);
						done();
					});
			});

			it('should reject promise for CORS', function(done) {
				spyOn(superAgent, 'end')
					.and
					.callFake(function(callback) {
						return callback({ crossDomain: true });
					});

				proxy.request(method, apiUrl, data, options)
					.then(function() {}, function(error){
						expect(error.status).toEqual(HTTP_STATUS_CODE.FORBIDDEN);
						done();
					});
			});

			it('should reject promise for Forbidden', function(done) {
				spyOn(superAgent, 'end')
					.and
					.callFake(function(callback) {
						return callback({status: 403});
					});

				proxy.request(method, apiUrl, data, options)
					.then(function() {},function(error){
						expect(error.status).toEqual(HTTP_STATUS_CODE.FORBIDDEN);
						done();
					});
			});

			it('should reject promise for Not found', function(done) {
				spyOn(superAgent, 'end')
					.and
					.callFake(function(callback) {
						return callback({status: 404});
					});

				proxy.request(method, apiUrl, data, options)
					.then(function() {},function(error){
						expect(error.status).toEqual(HTTP_STATUS_CODE.NOT_FOUND);
						done();
					});
			});

			it('should reject promise for Internal Server Error', function(done) {
				spyOn(superAgent, 'end')
					.and
					.callFake(function(callback) {
						return callback({status: 500});
					});

				proxy.request(method, apiUrl, data, options)
					.then(function() {},function(error){
						expect(error.status).toEqual(HTTP_STATUS_CODE.SERVER_ERROR);
						done();
					});
			});

			it('should reject promise for UNKNOWN', function(done) {
				spyOn(superAgent, 'end')
					.and
					.callFake(function(callback) {
						return callback({});
					});

				proxy.request(method, apiUrl, data, options)
					.then(function() {},function(error){
						expect(error.status).toEqual(HTTP_STATUS_CODE.SERVER_ERROR);
						done();
					});
			});

			it('should set credentials to request', function(done) {
				spyOn(superAgent, 'end')
					.and
					.callFake(function(callback) {
						return callback(null, response);
					});

				spyOn(proxy, '_setCredentials')
					.and
					.returnValue(proxy);

				proxy.request(method, apiUrl, data, options)
					.then(function(result) {
						expect(proxy._setCredentials).toHaveBeenCalled();
						done();
					})
					.catch(function(e){console.log(e); done();});
			});
		});
	});
});
