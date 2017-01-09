describe('ima.http.SuperAgentProxy', function() {

	var proxy = null;
	var apiUrl = 'http://localhost:3001/api/';
	var response = {
		body: {
			data: 'some data'
		}
	};
	var superAgent = null;

	var data = {};
	var options = { ttl: 3600000, timeout: 2000, repeatRequest: 1, headers: [], withCredentials: true };
	var httpUrlTransformer = oc.get('$HttpUrlTransformer');
	var windowHelper = oc.get('$Window');
	var HttpStatusCode = $import('ima/http/StatusCode');

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
			on: function() { return this; },
			withCredentials: function() { return this; },
			timeout: function() {
				var self = this;
				setTimeout(function() {
					self.funcError({ timeout: options.timeout });
				}, options.timeout);
				return this;
			},
			end: function() {
				return this;
			}
		};
		proxy = oc.create('ima.http.SuperAgentProxy', [superAgent, httpUrlTransformer, windowHelper]);

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
					.catch(function(error) {
						console.log(error);
						done();
					});
			});

			it('should return a "body" field in error object, when promise is rejected', function(done) {
				spyOn(superAgent, 'end')
					.and
					.callFake(function(callback) {
						return callback({ timeout: options.timeout });
					});

				proxy.request(method, apiUrl, data, options)
					.then(function() {}, function(error) {
						expect(error.body).toBeDefined();
						done();
					});
			});

			it('should reject promise for Timeout error', function(done) {
				spyOn(superAgent, 'end')
					.and
					.callFake(function(callback) {
						return callback({ timeout: options.timeout });
					});

				proxy.request(method, apiUrl, data, options)
					.then(function() {}, function(error) {
						expect(error.status).toEqual(HttpStatusCode.TIMEOUT);
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
					.then(function() {}, function(error) {
						expect(error.status).toEqual(HttpStatusCode.TIMEOUT);
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
					.then(function() {}, function(error) {
						expect(error.status).toEqual(HttpStatusCode.FORBIDDEN);
						done();
					});
			});

			it('should reject promise for Forbidden', function(done) {
				spyOn(superAgent, 'end')
					.and
					.callFake(function(callback) {
						return callback({ status: 403 });
					});

				proxy.request(method, apiUrl, data, options)
					.then(function() {}, function(error) {
						expect(error.status).toEqual(HttpStatusCode.FORBIDDEN);
						done();
					});
			});

			it('should reject promise for Not found', function(done) {
				spyOn(superAgent, 'end')
					.and
					.callFake(function(callback) {
						return callback({ status: 404 });
					});

				proxy.request(method, apiUrl, data, options)
					.then(function() {}, function(error) {
						expect(error.status).toEqual(HttpStatusCode.NOT_FOUND);
						done();
					});
			});

			it('should reject promise for Internal Server Error', function(done) {
				spyOn(superAgent, 'end')
					.and
					.callFake(function(callback) {
						return callback({ status: 500 });
					});

				proxy.request(method, apiUrl, data, options)
					.then(function() {}, function(error) {
						expect(error.status).toEqual(HttpStatusCode.SERVER_ERROR);
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
					.then(function() {}, function(error) {
						expect(error.status).toEqual(HttpStatusCode.SERVER_ERROR);
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
					.catch(function(error) {
						console.log(error);
						done();
					});
			});

			it('should call private method _setListeners for each request', function(done) {
				spyOn(superAgent, 'end')
					.and
					.callFake(function(callback) {
						return callback(null, response);
					});

				spyOn(proxy, '_setListeners')
					.and
					.returnValue(proxy);

				proxy.request(method, apiUrl, data, options)
					.then(function() {
						expect(proxy._setListeners).toHaveBeenCalled();
						done();
					})
			});

			it('should add listener for "progress" to request', function(done) {
				spyOn(superAgent, 'on')
					.and
					.stub()

				spyOn(superAgent, 'end')
					.and
					.callFake(function(callback) {
						return callback(null, response);
					})

				function dummy() {}
				var reqOptions = Object.assign({}, options, { 'listeners': { 'progress': dummy } })

				proxy.request(method, apiUrl, data, reqOptions)
					.then(function() {
						expect(superAgent.on).toHaveBeenCalledWith('progress', dummy)
						expect(superAgent.on.calls.count()).toEqual(1)
						done()
					})
			});
		});
	});
});
