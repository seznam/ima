describe('Core.Abstract.Router', function() {

	var router = null;
	var pageRender = null;
	var routerFactory = null;
	var ROUTE_NAMES = oc.get('$ROUTE_NAMES');

	beforeEach(function() {
		oc.bind('BaseController', function() {});
		oc.bind('BaseView', function() {});

		pageRender = oc.create('Core.Interface.PageRender');
		routerFactory = oc.create('$RouterFactory');
		router = oc.create('Core.Abstract.Router', [pageRender, routerFactory, ROUTE_NAMES]);

		router.add('home', '/', 'BaseController', 'BaseView');
		router.add('contact', '/contact', 'BaseController', 'BaseView');
	});

	it('should be 2 routes in Array', function() {
		expect(router._routes.size).toEqual(2);
	});

	it('should remove path from router', function() {
		router.remove('home');

		expect(router._routes.size).toEqual(1);
	});

	describe('link method', function() {

		var routeName ='link';
		var path = '/link';
		var baseUrl = 'baseUrl';

		beforeEach(function() {
			router.add(routeName, path, 'BaseController', 'BaseView');
		});

		afterEach(function() {
			router.remove(routeName);
		});

		it('should be return link for valid route with params', function() {
			spyOn(router, '_getBaseUrl')
				.and
				.returnValue(baseUrl);

			expect(router.link(routeName, {})).toEqual(baseUrl + path);
		});

		it('should be throw Error for not valid route with params', function() {
			spyOn(router._routes, 'has')
				.and
				.returnValue(false);

			expect(function() {router.link('xxx', {});}).toThrow();
		});
	});

	describe('route method', function() {

		var routeName ='link';
		var path = '/link';
		var baseUrl = 'baseUrl';
		var route = null;

		beforeEach(function() {
			route = routerFactory.createRoute(routeName, path, 'BaseController', 'BaseView');
		});

		afterEach(function() {
			route = null;
		});

		it('should be handle valid route path', function() {
			spyOn(router, '_getRouteByPath')
				.and
				.returnValue(route);

			spyOn(router, '_handle')
				.and
				.stub();

			spyOn(route, 'extractParameters')
				.and
				.callThrough();

			router.route(path);

			expect(route.extractParameters).toHaveBeenCalled();
			expect(router._handle).toHaveBeenCalledWith(route, {});
		});

		it('should be handle "not-found" route', function() {
			spyOn(router, '_getRouteByPath')
				.and
				.returnValue(null);

			spyOn(router, 'handleNotFound')
				.and
				.stub();

			router.route(path);

			expect(router.handleNotFound).toHaveBeenCalledWith({path: path});
		});

	});

	describe('handleError method', function() {

		var routeName = ROUTE_NAMES.ERROR;
		var path = '/error';
		var baseUrl = 'baseUrl';
		var route = null;

		beforeEach(function() {
			route = routerFactory.createRoute(routeName, path, 'BaseController', 'BaseView');
		});

		afterEach(function() {
			route = null;
		});

		it('should be handle "error" route', function() {
			var params = new Error('test');

			spyOn(router._routes, 'get')
				.and
				.returnValue(route);

			spyOn(router, '_handle')
				.and
				.stub();

			router.handleError(params);

			expect(router._handle).toHaveBeenCalledWith(route, params);
		});

		it('should be reject promise with error for undefined "error" route', function(done) {
			var params = new Error('test');

			spyOn(router._routes, 'get')
				.and
				.returnValue(null);


			router
				.handleError(params)
				.catch(function(reason) {
					expect(reason instanceof ns.Core.IMAError).toBe(true);
					done();
				});
		});
	});

	describe('handleNotFound method', function() {

		var routeName = ROUTE_NAMES.NOT_FOUND;
		var path = '/not-found';
		var baseUrl = 'baseUrl';
		var route = null;

		beforeEach(function() {
			route = routerFactory.createRoute(routeName, path, 'BaseController', 'BaseView');
		});

		afterEach(function() {
			route = null;
		});

		it('should be handle "notFound" route', function() {
			var params = {path: path};

			spyOn(router._routes, 'get')
				.and
				.returnValue(route);

			spyOn(router, '_handle')
				.and
				.stub();

			router.handleNotFound(params);

			expect(router._handle).toHaveBeenCalledWith(route, params);

		});

		it('should be reject promise with error for undefined "error" route', function(done) {
			var params = {path: path};

			spyOn(router._routes, 'get')
				.and
				.returnValue(null);

			router
				.handleNotFound(params)
				.catch(function(reason) {
					expect(reason instanceof ns.Core.IMAError).toBe(true);
					done();
				});
		});
	});

	describe('isClientError method', function() {

		it('should be return true for client error, which return status 4**', function() {
			var isClientError = router.isClientError(oc.create('$Error', ['Client error', {status: 404}]));

			expect(isClientError).toEqual(true);
		});

		it('should be return false for client error, which return status 5**', function() {
			var isClientError = router.isClientError(oc.create('$Error', ['Server error', {status: 500}]));

			expect(isClientError).toEqual(false);
		});

		it('should be return false for any error', function() {
			var isClientError = router.isClientError(new Error('some error'));

			expect(isClientError).toEqual(false);
		});

	});

	describe('isRedirection method', function() {

		it('should be return true for redirection, which return status 3**', function() {
			var isRedireciton = router.isRedirection(oc.create('$Error', ['Redirection', {status: 300, url: 'http://www.example.com/redirect'}]));

			expect(isRedireciton).toEqual(true);
		});

		it('should be return true for client error, which return status 4**', function() {
			var isRedireciton = router.isRedirection(oc.create('$Error', ['Client error', {status: 400}]));

			expect(isRedireciton).toEqual(false);
		});

		it('should be return false for any error', function() {
			var isClientError = router.isClientError(new Error('some error'));

			expect(isClientError).toEqual(false);
		});

	});

	describe('_extractRoutePath method', function() {

		var pathWithRoot = '/root/path';
		var pathWithLanguage = '/en/path';
		var pathWithRootAndLanguage = '/root/en/path';
		var path = '/path';

		beforeEach(function() {
			router = oc.create('Core.Abstract.Router', [pageRender, routerFactory, Promise]);
		});

		it('should be clear root from path', function() {
			router.init({$Root: '/root'});

			expect(router._extractRoutePath(pathWithRoot)).toEqual(path);
		});

		it('should be clear root and language from path', function() {
			router.init({$Root: '/root', $LanguagePartPath: '/en'});

			expect(router._extractRoutePath(pathWithRootAndLanguage)).toEqual(path);
		});

		it('should be clear language from path', function() {
			router.init({$LanguagePartPath: '/en'});

			expect(router._extractRoutePath(pathWithLanguage)).toEqual(path);
		});

		it('should be return path for empty root and undefined language in path', function() {
			router.init({});

			expect(router._extractRoutePath(path)).toEqual(path);
		});
	});
});