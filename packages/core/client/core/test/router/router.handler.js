describe('Core.Router.Handler', function() {

	var router = null;
	var pageRender = null;
	var respond = null;
	var request = null;

	beforeEach(function() {
		ns.oc.bind('BaseController', {});

		pageRender = ns.oc.create('Core.PageRender.Client');
		request = ns.oc.create('Core.Router.Request');
		respond = ns.oc.create('Core.Router.Respond');
		router = ns.oc.create('Core.Router.Handler', pageRender, request, respond);
		router.init({mode: 'history'});

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

	describe('should get route by name', function() {
		it('return instance of Core.Router.Data', function() {
			expect(router.getRouteByName('home')).not.toBeNull();
		});

		it('return null for non exist route', function() {
			expect(router.getRouteByName('xxx')).toBeNull();
		});
	});

	it('should return current path', function() {
		expect(router.getPath()).toEqual('/context.html');
	});

	it('should return current url', function() {
		expect(router.getUrl()).toEqual('http://localhost:3002/context.html');
	});

	it('should redirect to other page', function() {
		spyOn(router, '_navigate')
			.and
			.stub();

		router.redirect('home');

		expect(router._navigate).toHaveBeenCalled();
	});

	describe('Link method', function() {
		it('should be return link for valid route with params', function() {
			expect(router.link('home', {})).toEqual(jasmine.any(String));
		});

		it('should be throw Error for not valid route with params', function() {
			expect(function() {router.link('xxx', {});}).toThrow();
		});
	});

	describe('Route method', function() {

		it('should be render page for valid path', function() {
			spyOn(pageRender, 'render')
				.and
				.stub();

			router.route('/');

			expect(pageRender.render).toHaveBeenCalled();
		});

		it('should be render not found page for not valid path', function() {
			spyOn(router, 'handleNotFound')
				.and
				.stub();

			router.route('/xxx/aaa');

			expect(router.handleNotFound).toHaveBeenCalled();
		});

	});

});