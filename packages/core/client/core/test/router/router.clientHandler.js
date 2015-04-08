describe('Core.Router.ClientHandler', function() {

	var router = null;
	var pageRender = null;
	var routerFactory = null;
	var win = null;
	var Promise = ns.oc.get('$Promise');
	var domain = 'locahlost:3002';
	var protocol = 'http:';

	beforeEach(function() {
		pageRender = ns.oc.create('Core.PageRender.Client');
		routerFactory = ns.oc.make('$RouterFactory');
		win = ns.oc.get('$Window');
		router = ns.oc.create('Core.Router.ClientHandler', pageRender, routerFactory, Promise, win);
		router.init({domain: domain, protocol: protocol});
	});

	it('should be return actual path', function() {
		spyOn(win, 'getPath')
			.and
			.returnValue('');

		router.getPath();

		expect(win.getPath).toHaveBeenCalled();
	});

	it('should be add listener to popState event and click event', function() {
		spyOn(win, 'addEventListener')
			.and
			.stub();

		router.listen();

		expect(win.addEventListener.calls.count()).toEqual(2);
	});

	describe('redirect method', function() {
		it('should be set address bar', function() {
			var url = protocol + '//' + domain + '/somePath';

			spyOn(router, '_setAddressBar')
				.and
				.stub();

			router.redirect(url);

			expect(router._setAddressBar).toHaveBeenCalledWith(url);
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