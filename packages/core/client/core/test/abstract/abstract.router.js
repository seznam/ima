describe('Core.Abstract.Router', function() {

	var router = null;
	var pageRender = null;
	var Promise = ns.oc.get('$Promise');

	beforeEach(function() {
		ns.oc.bind('BaseController', {});

		pageRender = ns.oc.create('Core.Interface.PageRender');
		router = ns.oc.create('Core.Abstract.Router', pageRender);

		router.add('home', '/', 'BaseController');
		router.add('contact', '/contact', 'BaseController');
	});

	it('should be 2 routes in Array', function() {
		expect(router._routes.length).toEqual(2);
	});

	it('should remove path from router', function() {
		router.remove('/');

		expect(router._routes.length).toEqual(1);
	});

	it('should clear router', function() {
		router.clear();

		expect(router._routes.length).toEqual(0);
		expect(router._domain).toEqual(null);
		expect(router._mode).toEqual(null);
	});

	describe('should get route by name', function() {
		it('return instance of Core.Router.Route', function() {
			expect(router._getRouteByName('home')).not.toBeNull();
		});

		it('return null for non exist route', function() {
			expect(router._getRouteByName('xxx')).toBeNull();
		});
	});

	describe('Link method', function() {
		it('should be return link for valid route with params', function() {
			var route = ns.oc.create('$Route', 'link', '/link', 'BaseController');

			spyOn(router, '_getRouteByName')
				.and
				.returnValue(route);

			spyOn(route, 'createPathForParams')
				.and
				.returnValue('');

			expect(router.link('link', {})).toEqual(jasmine.any(String));
			expect(router._getRouteByName).toHaveBeenCalled();
			expect(route.createPathForParams).toHaveBeenCalled();
		});

		it('should be throw Error for not valid route with params', function() {
			spyOn(router, '_getRouteByName')
				.and
				.returnValue(null);

			expect(function() {router.link('xxx', {});}).toThrow();
		});
	});

	describe('Route method', function() {

		it('should be handle valid route path', function() {
			var route = ns.oc.create('$Route', 'link', '/link', 'BaseController');

			spyOn(router, '_getRouteByPath')
				.and
				.returnValue(route);

			spyOn(router, '_handle')
				.and
				.stub();

			spyOn(route, 'getParamsForPath')
				.and
				.callThrough();

			router.route('/link');

			expect(route.getParamsForPath).toHaveBeenCalled();
			expect(router._handle).toHaveBeenCalledWith(route, {});
		});

		it('should be handle "not-found" route', function() {
			spyOn(router, '_getRouteByPath')
				.and
				.returnValue(null);

			spyOn(router, 'handleNotFound')
				.and
				.stub();

			router.route('/link');

			expect(router.handleNotFound).toHaveBeenCalledWith({path: '/link'});
		});

	});

});