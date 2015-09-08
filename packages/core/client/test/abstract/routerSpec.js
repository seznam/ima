describe('Core.Abstract.Router', function() {

	var router = null;
	var pageManager = null;
	var routerFactory = null;
	var dispatcher = null;
	var ROUTER_CONSTANTS = oc.get('$ROUTER_CONSTANTS');
	var config = {
		$Protocol: 'http:',
		$Root: '/root',
		$LanguagePartPath: '',
		$Host: 'www.domain.com'
	};
	var options = {
		onlyUpdate: false,
		autoScroll: true
	};
	var controller = 'BaseController';
	var view = 'BaseView';

	beforeEach(function() {
		oc.bind('BaseController', function() {});
		oc.bind('BaseView', function() {});

		pageManager = oc.create('Core.Interface.PageManager');
		routerFactory = oc.create('$RouterFactory');
		dispatcher = oc.create('Core.Interface.Dispatcher');
		router = oc.create('Core.Abstract.Router', [pageManager, routerFactory, dispatcher, ROUTER_CONSTANTS]);

		router.init(config);

		router.add('home', '/', controller, view, options);
		router.add('contact', '/contact', controller, view, options);
	});

	it('should have 2 routes in Array', function() {
		expect(router._routes.size).toEqual(2);
	});

	it('should remove path from router', function() {
		router.remove('home');

		expect(router._routes.size).toEqual(1);
	});

	it('should return absolute current url', function() {
		spyOn(router, 'getPath')
			.and
			.returnValue('/path');

		expect(router.getUrl()).toEqual('http://www.domain.com/root/path');
	});

	it('should return route for defined path', function() {
		var route = router._getRouteByPath('/');

		expect(route.getName()).toEqual('home');
	});

	describe('add method', function() {

		it('should be throw error if you try add route with exists name', function() {
			expect(function() {
				router.add('home', '/home', controller, view, options);
			}).toThrow();
		});

		it('should create new Core.Router.Route', function() {
			spyOn(routerFactory, 'createRoute')
				.and
				.callThrough();

			router.add('routeName', '/routePath', controller, view, options);

			expect(routerFactory.createRoute).toHaveBeenCalledWith('routeName', '/routePath', controller, view, options);

		});
	});

	describe('getCurrentRouteInfo method', function() {

		var routeName ='link';
		var path = '/link';
		var route = null;
		var params = {};

		beforeEach(function() {
			route = routerFactory.createRoute(routeName, path, controller, view, options);
		});

		afterEach(function() {
			route = null;
		});

		it('should throw error for not exist route', function() {
			spyOn(router, 'getPath')
				.and
				.returnValue(null);

			expect(function() {
				router.getCurrentRouteInfo();
			}).toThrow();
		});

		it('should return current route information', function() {
			spyOn(router, 'getPath')
				.and
				.returnValue(path);
			spyOn(router, '_getRouteByPath')
				.and
				.returnValue(route);
			spyOn(route, 'extractParameters')
				.and
				.returnValue(params);

			expect(router.getCurrentRouteInfo()).toEqual({route: route, params: params, path: '/link'});
		});
	});

	describe('link method', function() {

		var routeName ='link';
		var path = '/link';
		var baseUrl = 'baseUrl';

		beforeEach(function() {
			router.add(routeName, path, controller, view, options);
		});

		afterEach(function() {
			router.remove(routeName);
		});

		it('should return link for valid route with params', function() {
			spyOn(router, '_getBaseUrl')
				.and
				.returnValue(baseUrl);

			expect(router.link(routeName, {})).toEqual(baseUrl + path);
		});

		it('should throw Error for not valid route with params', function() {
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
			route = routerFactory.createRoute(routeName, path, controller, view, options);
		});

		afterEach(function() {
			route = null;
		});

		it('should handle valid route path', function() {
			spyOn(router, '_getRouteByPath')
				.and
				.returnValue(route);

			spyOn(router, '_handle')
				.and
				.stub();

			spyOn(route, 'extractParameters')
				.and
				.callThrough();

			router.route(path, options);

			expect(route.extractParameters).toHaveBeenCalled();
			expect(router._handle).toHaveBeenCalledWith(route, {}, options);
		});

		it('should handle "not-found" route', function() {
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

		var routeName = ROUTER_CONSTANTS.ROUTE_NAMES.ERROR;
		var path = '/error';
		var baseUrl = 'baseUrl';
		var route = null;

		beforeEach(function() {
			route = routerFactory.createRoute(routeName, path, controller, view, options);
		});

		afterEach(function() {
			route = null;
		});

		it('should handle "error" route', function() {
			var params = new Error('test');

			spyOn(router._routes, 'get')
				.and
				.returnValue(route);

			spyOn(router, '_handle')
				.and
				.stub();

			router.handleError(params, options);

			expect(router._handle).toHaveBeenCalledWith(route, params, options);
		});

		it('should reject promise with error for undefined "error" route', function(done) {
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

		var routeName = ROUTER_CONSTANTS.ROUTE_NAMES.NOT_FOUND;
		var path = '/not-found';
		var baseUrl = 'baseUrl';
		var route = null;

		beforeEach(function() {
			route = routerFactory.createRoute(routeName, path, controller, view, options);
		});

		afterEach(function() {
			route = null;
		});

		it('should handle "notFound" route', function() {
			var params = {path: path};

			spyOn(router._routes, 'get')
				.and
				.returnValue(route);

			spyOn(router, '_handle')
				.and
				.stub();

			router.handleNotFound(params, options);

			expect(router._handle).toHaveBeenCalledWith(route, params, options);

		});

		it('should reject promise with error for undefined "error" route', function(done) {
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

		it('should return true for client error, which return status 4**', function() {
			var isClientError = router.isClientError(oc.create('$Error', ['Client error', {status: 404}]));

			expect(isClientError).toEqual(true);
		});

		it('should return false for client error, which return status 5**', function() {
			var isClientError = router.isClientError(oc.create('$Error', ['Server error', {status: 500}]));

			expect(isClientError).toEqual(false);
		});

		it('should return false for any error', function() {
			var isClientError = router.isClientError(new Error('some error'));

			expect(isClientError).toEqual(false);
		});

	});

	describe('isRedirection method', function() {

		it('should return true for redirection, which return status 3**', function() {
			var isRedireciton = router.isRedirection(oc.create('$Error', ['Redirection', {status: 300, url: 'http://www.example.com/redirect'}]));

			expect(isRedireciton).toEqual(true);
		});

		it('should return true for client error, which return status 4**', function() {
			var isRedireciton = router.isRedirection(oc.create('$Error', ['Client error', {status: 400}]));

			expect(isRedireciton).toEqual(false);
		});

		it('should return false for any error', function() {
			var isClientError = router.isClientError(new Error('some error'));

			expect(isClientError).toEqual(false);
		});

	});

	describe('_handle method', function() {

		var routeName ='routeName';
		var routePath = '/routePath';
		var route = null;

		beforeEach(function() {
			route = routerFactory.createRoute(routeName, routePath, controller, view, options);
		});

		afterEach(function() {
			route = null;
		});

		it('should call paga manager', function(done) {
			spyOn(router, 'getPath')
				.and
				.returnValue(routePath);
			spyOn(pageManager, 'manage')
				.and
				.returnValue(Promise.resolve({content: null, status: 200}));
			spyOn(dispatcher, 'fire')
				.and
				.stub();

			router
				._handle(route, {})
				.then(function() {
					expect(pageManager.manage).toHaveBeenCalledWith(controller, view, options, {});
					done();
				})

		});

		it('should fire ns.Core.Router.EVENTS.PRE_HANDLE_ROUTE', function() {
			var response = {content: null, status: 200};
			var params = {};
			var path ='/';
			var data = {route: route, params: params, path: path, options: options};

			spyOn(router, 'getPath')
				.and
				.returnValue(path);
			spyOn(pageManager, 'manage')
				.and
				.returnValue(Promise.resolve(response));
			spyOn(dispatcher, 'fire')
				.and
				.stub();

			router._handle(route, params, options);

			expect(dispatcher.fire).toHaveBeenCalledWith(router.EVENTS.PRE_HANDLE_ROUTE, data, true);
		});

		it('should fire ns.Core.Router.EVENTS.POST_HANDLE_ROUTE', function(done) {
			var response = {content: null, status: 200};
			var params = {};
			var path ='/';

			spyOn(router, 'getPath')
				.and
				.returnValue(path);
			spyOn(pageManager, 'manage')
				.and
				.returnValue(Promise.resolve({content: null, status: 200}));
			spyOn(dispatcher, 'fire')
				.and
				.stub();

			router
				._handle(route, params, options)
				.then(function() {
					var data = {route: route, params: params, path: path, response: response, options: options};

					expect(dispatcher.fire)
						.toHaveBeenCalledWith(router.EVENTS.POST_HANDLE_ROUTE, data, true);

					done();
				});
		});
	});

	describe('_extractRoutePath method', function() {

		var pathWithRoot = '/root/path';
		var pathWithLanguage = '/en/path';
		var pathWithRootAndLanguage = '/root/en/path';
		var path = '/path';

		beforeEach(function() {
			router = oc.create('Core.Abstract.Router', [pageManager, routerFactory, dispatcher, ROUTER_CONSTANTS]);
		});

		it('should clear root from path', function() {
			router.init({$Root: '/root'});

			expect(router._extractRoutePath(pathWithRoot)).toEqual(path);
		});

		it('should clear root and language from path', function() {
			router.init({$Root: '/root', $LanguagePartPath: '/en'});

			expect(router._extractRoutePath(pathWithRootAndLanguage)).toEqual(path);
		});

		it('should clear language from path', function() {
			router.init({$LanguagePartPath: '/en'});

			expect(router._extractRoutePath(pathWithLanguage)).toEqual(path);
		});

		it('should return path for empty root and undefined language in path', function() {
			router.init({});

			expect(router._extractRoutePath(path)).toEqual(path);
		});
	});
});