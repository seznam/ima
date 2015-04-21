describe('Core.Router.Client', function() {

	var router = null;
	var pageRender = null;
	var routerFactory = null;
	var win = null;
	var Promise = oc.get('$Promise');
	var domain = 'locahlost:3002';
	var protocol = 'http:';

	beforeEach(function() {
		pageRender = oc.make('$PageRender');
		routerFactory = oc.make('$RouterFactory');
		win = oc.get('$Window');
		router = oc.create('Core.Router.Client', pageRender, routerFactory, Promise, win);
		router.init({$Domain: domain, $Protocol: protocol});
	});

	it('should be return actual path', function() {
		spyOn(win, 'getPath')
			.and
			.returnValue('');

		router.getPath();

		expect(win.getPath).toHaveBeenCalled();
	});

	it('should be add listener to popState event and click event', function() {
		spyOn(win, 'bindEventListener')
			.and
			.stub();

		router.listen();

		expect(win.bindEventListener.calls.count()).toEqual(2);
	});

	describe('redirect method', function() {
		it('should be set address bar', function() {
			var path = '/somePath';
			var url = protocol + '//' + domain + path;

			spyOn(router, '_setAddressBar')
				.and
				.stub();

			spyOn(router, 'route')
				.and
				.stub();

			router.redirect(url);

			expect(router._setAddressBar).toHaveBeenCalledWith(url);
			expect(router.route).toHaveBeenCalledWith(path);
		});

		it('return null for non exist route', function() {
			var url = 'http://example.com/somePath';

			spyOn(win, 'redirect')
				.and
				.stub();

			router.redirect('http://example.com/somePath');

			expect(win.redirect).toHaveBeenCalledWith(url);
		});
	});

	describe('houte method', function() {

		it('should be call handleError for throwing error in super.router', function(done) {
			spyOn(router, 'handleError')
				.and
				.returnValue(Promise.resolve());

			router
				.route('/something')
				.then(function() {
					expect(router.handleError).toHaveBeenCalled();
					done();
				});
		});

	});

	describe('handleError method', function() {

		it('should be call $IMA.fatalErrorHandler function', function(done) {
			spyOn(window.$IMA, 'fatalErrorHandler')
				.and
				.stub();

			router
				.handleError(new Error())
				.then(function(fatalError) {
					expect(window.$IMA.fatalErrorHandler).toHaveBeenCalled();
					done();
				});
		});

	});

	describe('handleNotFound method', function() {

		it('should be call router.handleError function for throwing error', function(done) {
			spyOn(router, 'handleError')
				.and
				.returnValue(Promise.resolve('ok'));

			router
				.handleNotFound({path: '/path'})
				.then(function() {
					expect(router.handleError).toHaveBeenCalled();
					done();

				});
		});

	});

});