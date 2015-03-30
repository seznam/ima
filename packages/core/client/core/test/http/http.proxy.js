describe('Core.Http.Proxy', function() {

	var proxy = null;
	var apiUrl = 'http://localhost:3001/api/';
	var response = {
		body: {
			data: 'some data'
		}
	};
	var superAgent = null;

	var data = {};
	var options = {ttl: 3600000, timeout: 2000, repeatRequest: 1};

	beforeEach(function() {
		var promise = ns.oc.get('$Promise');
		superAgent = {
			funcError: null,
			get: function() { return this; },
			post: function(){ return this; },
			put: function(){ return this; },
			set: function() { return this; },
			accept: function() { return this; },
			query: function() { return this; },
			send: function() { return this; },
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


		proxy = ns.oc.create('Core.Http.Proxy', superAgent, promise);

		jasmine.clock().install();
	});

	afterEach(function() {
		jasmine.clock().uninstall();
	});

	using([
		'get',
		'post',
		'put'
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
						expect(error.status).toEqual(proxy.HTTP_TIMEOUT);
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
						expect(error.status).toEqual(proxy.HTTP_TIMEOUT);
						done();
					});
			});

			it('should reject promise for CORS', function(done) {
				spyOn(superAgent, 'end')
					.and
					.callFake(function(callback) {
						return callback({crossDomain: true});
					});

				proxy.request(method, apiUrl, data, options)
					.then(function() {}, function(error){
						expect(error.status).toEqual(proxy.HTTP_FORBIDDEN);
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
						expect(error.status).toEqual(proxy.HTTP_SERVER_ERROR);
						done();
					});
			});
		});
	});
});