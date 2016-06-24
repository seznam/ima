describe('ima.router.Route', function() {

	var route = null;
	var name = 'home';
	var controller = function() {};
	var view = function() {};
	var pathExpression = '/home/:userId/something/:somethingId/:?optional';
	var options = {
		onlyUpdate: false,
		autoScroll: true,
		serveSPA: true,
		documentView: null
	};

	beforeEach(function() {
		route = oc.create('ima.router.Route', [name, pathExpression, controller, view, options]);
	});

	describe('should create right path -', function() {

		using([
			{ pathExpression: '/home/:userId/something/:somethingId', params: { userId: 1, somethingId: 2 }, result: '/home/1/something/2' },
			{ pathExpression: '/home/:userId/something/:somethingId/', params: { userId: 1, somethingId: 2 }, result: '/home/1/something/2' },
			{ pathExpression: ':?optional/home/:userId/something/:somethingId/', params: { userId: 1, somethingId: 2 }, result: '/home/1/something/2' },
			{ pathExpression: '/home/:userId/something/:somethingId/:?optional', params: { userId: 'hello', somethingId: 'job' }, result: '/home/hello/something/job' },
			{ pathExpression: '/home/:userId/:?optional/something/:somethingId', params: { userId: 1, somethingId: 2 }, result: '/home/1/something/2' },
			{ pathExpression: '/home/:userId/:?optional/something/:somethingId/', params: { userId: 1, somethingId: 2 }, result: '/home/1/something/2' }
		], function(value) {
			route = oc.create('ima.router.Route', [name, value.pathExpression, controller, view, options]);
			it('for path params for pathExpr ' + value.pathExpression + ' and params ' + JSON.stringify(value.params), function() {
				expect(route.toPath(value.params)).toEqual(value.result);
			});
		});

		it('for empty variables will be return defined path', function() {
			expect(route.toPath()).toEqual('/home/:userId/something/:somethingId');
		});

		using([
			{ pathExpression: ':?optional/home/:userId/something/:somethingId/:?optional2', params: { userId: 1, somethingId: 2, optional: 'en' }, result: '/en/home/1/something/2' },
			{ pathExpression: ':?optional/home/:userId/something/:somethingId/:?optional2', params: { userId: 1, somethingId: 2, optional2: 'today' }, result: '/home/1/something/2/today' },
			{ pathExpression: '/home/:userId/something/:somethingId/:?optional2/', params: { userId: 'hello', somethingId: 'job', optional2: 'today' }, result: '/home/hello/something/job/today' },
			{ pathExpression: ':?optional/home/:userId/something/:somethingId/:?optional2', params: { userId: 1, somethingId: 2, optional: 'en' }, result: '/en/home/1/something/2' },
			{ pathExpression: ':?optional/home/:userId/something/:somethingId/:?optional2', params: { userId: 1, somethingId: 2, optional: 'en', optional2: 'today' }, result: '/en/home/1/something/2/today' }
		], function(value) {
			var route = oc.create('ima.router.Route', [name, value.pathExpression, controller, view, options]);

			it('for optional param will be return defined path for pathExpr ' + value.pathExpression + ' and params ' + JSON.stringify(value.params), function() {
				expect(route.toPath(value.params)).toEqual(value.result);
			});
		});

		using([
			{ pathExpression: ':?optional', params: { }, result: '/' },
			{ pathExpression: ':?optional/', params: { }, result: '/' },
			{ pathExpression: ':?optional/:?optional2', params: { optional: 'en' }, result: '/en' },
			{ pathExpression: ':?optional', params: { optional: 'en' }, result: '/en' },
			{ pathExpression: ':?optional/', params: { optional: 'en' }, result: '/en' },
			{ pathExpression: ':?optional/:?optional2', params: { optional: 'en', optional2: 'cs' }, result: '/en/cs' }
		], function(value) {
			var route = oc.create('ima.router.Route', [name, value.pathExpression, controller, view, options]);

			it('for only optional param will be return defined path for pathExpr ' + value.pathExpression + ' and params ' + JSON.stringify(value.params), function() {
				expect(route.toPath(value.params)).toEqual(value.result);
			});
		});

		it('for path and query variables', function() {

			var value = { userId: 'hello', somethingId: 'job', query1: 'query', query2: 'text for you' };

			expect(route.toPath(value)).toEqual('/home/' + value.userId + '/something/' + value.somethingId + '?query1=query&query2=' + encodeURIComponent(value.query2));
		});

	});

	it('should return route name', function() {
		expect(route.getName()).toEqual(name);
	});

	it('should be return route path', function() {
		expect(route.getPathExpression()).toEqual(pathExpression);
	});

	it('should be return route options', function() {
		expect(route.getOptions()).toEqual(options);
	});

	describe('should get params from path', function() {

		using([
			{ pathExpression: '/:userId', path: '/user12', params: { userId: 'user12' } },
			{ pathExpression: '/home/:userId/something/:somethingId', path: '/home/1/something/2', params:{ userId: '1', somethingId: '2' } },
			{ pathExpression: '/home/:userId/something/:somethingId', path: '/home/1/something', params:{ userId: undefined, somethingId: undefined } },
			{ pathExpression: '/home/:userId/something/:somethingId', path: '/home/param1/something/param2', params:{ userId: 'param1', somethingId: 'param2' } },
			{ pathExpression: '/home/:userId/something/:somethingId', path: '/home/param1/something/param2?query=param3', params:{ userId: 'param1', somethingId: 'param2', query: 'param3' } },
			{ pathExpression: '/:?userId', path: '/user12', params: { userId: 'user12' } },
			{ pathExpression: '/:?userId', path: '/', params: { userId: undefined } },
			{ pathExpression: '/:?userId/something/:somethingId', path: '/something/param1', params: { somethingId: 'param1' } },
			{ pathExpression: '/:?userId/something/:somethingId', path: 'user1/something/param1', params: { userId: 'user1', somethingId: 'param1' } },
			{ pathExpression: '/:userId/something/:?somethingId', path: 'user1/something', params: { userId: 'user1' } },
			{ pathExpression: '/:userId/something/:?somethingId', path: 'user1/something/param1', params: { userId: 'user1', somethingId: 'param1' } },
			{ pathExpression: '/something/:?somethingId/:userId', path: '/something/user1', params: { userId: 'user1' } },
			{ pathExpression: '/something/:?somethingId/:userId', path: '/something/param1/user1', params: { somethingId: 'param1', userId: 'user1' } },
			{ pathExpression: '/something/:?somethingId/:?userId', path: '/something/param1', params: { somethingId: 'param1' } },
			{ pathExpression: '/something/:?somethingId/:?userId', path: '/something/param1/user1', params: { somethingId: 'param1', userId: 'user1' } }
		], function(value) {
			it(value.pathExpression, function() {
				var routeLocal = oc.create('ima.router.Route', ['unknown', value.pathExpression, 'unknown']);

				var routeParams = routeLocal.extractParameters(value.path);
				var keys = Object.keys(value.params);

				for (var i = 0; i < keys.length; i++) {
					expect(routeParams[keys[i]]).toEqual(value.params[keys[i]]);
				}
			});
		});

	});

	describe('should return true for matched route regular', function() {

		using([
			{ path: '/home/1/something/2', result:true },
			{ path: '/home/1/something', result:false },
			{ path: '/home/param1/something/param2', result: true },
			{ path: '/home/param1/something/param2/optional', result: true },
			{ path: 'optional/home/param1/something/param2/optional', result: false },
			{ path: '/home/param1/something/param2?query=param3', result: true }
		], function(value) {

			it(value.path + ' for ' + route.getPathExpression(), function() {
				expect(route.matches(value.path)).toEqual(value.result);
			});
		});

		using([
			{ pathExpression: '/:?param1/:?param2/:?param3', path: '/', result: true },
			{ pathExpression: '/:?param1/:?param2/:?param3', path: '/p1', result: true },
			{ pathExpression: '/:?param1/:?param2/:?param3', path: '/p2', result: true },
			{ pathExpression: '/:?param1/:?param2/:?param3', path: '/p1/p2', result: true },
			{ pathExpression: '/:?param1/:?param2/:?param3', path: '/p1/p2/p3', result: true },
			{ pathExpression: '/:?param1/:?param2/:?param3', path: '/p1/p2/p3/p4', result: false },
			{ pathExpression: '/:?param1/:param2/:?param3', path: '/', result: false },
			{ pathExpression: '/:?param1/:param2/:?param3', path: '/p1', result: true },
			{ pathExpression: '/:param1/:?param2/:param3', path: '/p1/p2', result: true }
		], function(value) {
			var route = oc.create('ima.router.Route', [name, value.pathExpression, controller, view, options]);

			it(value.path + ' for ' + value.pathExpression, function() {
				expect(route.matches(value.path)).toEqual(value.result);
			});
		});

	});


	describe('should return true for matched route and false for unmatched route', function() {

		using([
			{ pathExpression: '/', path: '/', result: true },
			{ pathExpression: '/', path: '/something', result: false },
			{ pathExpression: '/:param1', path: '/', result:false },
			{ pathExpression: '/:param1', path: '/param1', result:true },
			{ pathExpression: '/:param1', path: '/param1/', result:true },
			{ pathExpression: '/something', path: '/something/', result:true },
			{ pathExpression: '/something/:param1', path: '/something/param1/', result:true },
			{ pathExpression: '/something/:param1', path: '/something/param1?query=query', result:true },
			{ pathExpression: '/something/:param1', path: '/something/param1/param2/param3/', result: false },
			{ pathExpression: '/something/:param1/neco/:param2', path: '/something/param1/neco/param2', result: true },
			{ pathExpression: '/:?param1/:?param2/:?param3', path: '/', result: true },
			{ pathExpression: '/:?param1/:?param2/:?param3', path: '/p1', result: true },
			{ pathExpression: '/:?param1/:?param2/:?param3', path: '/p2', result: true },
			{ pathExpression: '/:?param1/:?param2/:?param3', path: '/p1/p2', result: true },
			{ pathExpression: '/:?param1/:?param2/:?param3', path: '/p1/p2/p3', result: true },
			{ pathExpression: '/:?param1/:?param2/:?param3', path: '/p1/p2/p3/p4', result: false },
			{ pathExpression: '/:?param1/:param2/:?param3', path: '/', result: false },
			{ pathExpression: '/:?param1/:param2/:?param3', path: '/p1', result: true },
			{ pathExpression: '/:param1/:?param2/:param3', path: '/p1/p2', result: true },
			{ pathExpression: '/:param1/something/:?param2/:param3', path: '/p1/something/p2', result: true },
			{ pathExpression: '/:param1/something/:?param2/:param3', path: '/p1/something2/p2', result: false }
		], function(value) {
			it('for pathExpression ' + value.pathExpression + ' and path ' + value.path, function() {
				var routeLocal = oc.create('ima.router.Route', ['unknown', value.pathExpression, 'unknown']);

				expect(routeLocal.matches(value.path)).toEqual(value.result);
			});
		});

	});

	describe('query string parser', function() {
		var route = null;

		beforeEach(function() {
			route = oc.create('ima.router.Route', ['foo', '/:first/:second', 'foo', 'bar']);
		});

		it('should allow query to override path parameters', function() {
			expect(route.extractParameters('/abc/def?stuff=value&second=override')).toEqual({
				first: 'abc',
				second: 'override',
				stuff: 'value'
			});
		});

		it('should handle query with parameter value', function() {
			expect(route.matches('/abc/def?foo=bar')).toBeTruthy();
			expect(route.matches('/abc?foo=bar')).toBeFalsy();
			expect(route.extractParameters('/abc/def?foo=bar')).toEqual({
				first: 'abc',
				second: 'def',
				foo: 'bar'
			});
		});

		it('should handle query without parameter value', function() {
			expect(route.matches('/abc/def?foo')).toBeTruthy();
			expect(route.extractParameters('/abc/def?foo')).toEqual({
				first: 'abc',
				second: 'def',
				foo: true
			});

			expect(route.matches('/abc/def?foo&bar')).toBeTruthy();
			expect(route.extractParameters('/abc/def?foo&bar&second')).toEqual({
				first: 'abc',
				second: true,
				foo: true,
				bar: true
			});
		});

		it('should handle all query parameter pair separators', function() {
			expect(route.matches('/abc/def?foo=xy&bar=zz;giz=mo;stuff;geez&huff')).toBeTruthy();
			expect(route.extractParameters('/abc/def?foo=xy&bar=zz;giz=mo;stuff;geez&huff')).toEqual({
				first: 'abc',
				second: 'def',
				foo: 'xy',
				bar: 'zz',
				giz: 'mo',
				stuff: true,
				geez: true,
				huff: true
			});
		});

		it('should handle query with multiple parameters', function() {
			expect(route.matches('/abc/def?stuff=value&second=override')).toBeTruthy();
			expect(route.extractParameters('/abc/def?stuff=value&second=override')).toEqual({
				first: 'abc',
				second: 'override',
				stuff: 'value'
			});
		});
	});

});
