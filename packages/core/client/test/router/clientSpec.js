describe('Core.Router.Client', function() {
	var router = null;
	var pageRender = null;
	var routerFactory = null;
	var win = null;
	var host = 'locahlost:3002';
	var protocol = 'http:';
	var ROUTE_NAMES = oc.get('$ROUTE_NAMES');

	beforeEach(function() {
		pageRender = oc.create('$PageRender');
		routerFactory = oc.create('$RouterFactory');
		win = oc.get('$Window');
		router = oc.create('Core.Router.Client', [pageRender, routerFactory, ROUTE_NAMES, win]);

		spyOn(win, 'hasHistoryAPI')
			.and
			.returnValue(true);

		router.init({$Host: host, $Protocol: protocol});
	});

	it('should be return actual path', function() {
		spyOn(win, 'getPath')
			.and
			.returnValue('');

		router.getPath();

		expect(win.getPath).toHaveBeenCalled();
	});

	it('should be add listener to popState event, click event and add first page state to history', function() {
		spyOn(win, 'bindEventListener')
			.and
			.stub();

		spyOn(router, '_setAddressBar')
			.and
			.stub();

		router.listen();

		expect(router._setAddressBar).toHaveBeenCalled();
		expect(win.bindEventListener.calls.count()).toEqual(2);
	});

	describe('redirect method', function() {

		it('should be save scroll history and set address bar', function() {
			var path = '/somePath';
			var url = protocol + '//' + host + path;

			spyOn(router, '_setAddressBar')
				.and
				.stub();

			spyOn(router, '_saveScrollHistory')
				.and
				.stub();

			spyOn(router, 'route')
				.and
				.stub();

			router.redirect(url);

			expect(router._setAddressBar).toHaveBeenCalledWith(url);
			expect(router._saveScrollHistory).toHaveBeenCalled();
			expect(router.route).toHaveBeenCalledWith(path);
		});

		it('return null for non exist route', function() {
			var url = 'http://example.com/somePath';

			spyOn(win, 'redirect')
				.and
				.stub();

			router.redirect(url);

			expect(win.redirect).toHaveBeenCalledWith(url);
		});
	});

	describe('route method', function() {

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

	describe('_isSameDomain method', function() {

		it('should be return true for same domain', function() {
			var path = '/somePath';
			var url = protocol + '//' + host + path;

			expect(router._isSameDomain(url)).toEqual(true);
		});

		it('should be retrun false for strange domain', function() {
			var path = '/somePath';
			var url = protocol + '//' + 'www.strangeDomain.com' + path;

			expect(router._isSameDomain(url)).toEqual(false);
		});
	});

	describe('_isHashLink method', function() {
		using([
			{targetUrl:'http://localhost/aaa#hash', baseUrl: 'http://localhost/aaa', result: true},
			{targetUrl:'http://localhost/bbb#hash', baseUrl: 'http://localhost/aaa', result: false},
			{targetUrl:'http://localhost/aaa', baseUrl: 'http://localhost/aaa', result: false}
		], function(value) {
			it('should be for ' + value.targetUrl + ' and base url ' + value.baseUrl + ' return ' + value.result, function() {
				spyOn(win, 'getUrl')
					.and
					.returnValue(value.baseUrl);

				expect(router._isHashLink(value.targetUrl)).toEqual(value.result);
			});
		});
	});

	it('_saveScrollHistory method should be call window.replaceState', function() {
		spyOn(win, 'replaceState')
			.and
			.stub();

		router._saveScrollHistory();

		expect(win.replaceState).toHaveBeenCalled();
	});

	it('_setAddressBar method should be call window.pushState', function() {
		spyOn(win, 'pushState')
			.and
			.stub();

		router._setAddressBar('url');

		expect(win.pushState).toHaveBeenCalled();
	});

});