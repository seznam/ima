import Dispatcher from 'event/Dispatcher';
import PageManager from 'page/manager/PageManager';
import ClientRouter from 'router/ClientRouter';
import RouteFactory from 'router/RouteFactory';
import Window from 'window/Window';

describe('ima.router.ClientRouter', () => {

	let router = null;
	let pageRenderer = null;
	let routeFactory = null;
	let dispatcher = null;
	let win = null;
	let host = 'locahlost:3002';
	let protocol = 'http:';

	beforeEach(() => {
		pageRenderer = new PageManager();
		routeFactory = new RouteFactory();
		dispatcher = new Dispatcher();
		win = new Window();
		router = new ClientRouter(pageRenderer, routeFactory, dispatcher, win);

		spyOn(win, 'hasHistoryAPI')
			.and
			.returnValue(true);

		router.init({ $Host: host, $Protocol: protocol });
	});

	it('should be return actual path', () => {
		spyOn(win, 'getPath')
			.and
			.returnValue('');

		router.getPath();

		expect(win.getPath).toHaveBeenCalled();
	});

	it('should be return actual url', () => {
		spyOn(win, 'getUrl')
			.and
			.stub();

		router.getUrl();

		expect(win.getUrl).toHaveBeenCalled();
	});

	it('should be add listener to popState event, click event and add first page state to history', () => {
		spyOn(win, 'bindEventListener')
			.and
			.stub();

		spyOn(router, '_saveScrollHistory')
			.and
			.stub();

		router.listen();

		expect(router._saveScrollHistory).toHaveBeenCalled();
		expect(win.bindEventListener.calls.count()).toEqual(2);
	});

	describe('redirect method', () => {

		it('should be save scroll history and set address bar', () => {
			let path = '/somePath';
			let url = protocol + '//' + host + path;
			let options = { httpStatus: 302 };

			spyOn(router, '_setAddressBar')
				.and
				.stub();

			spyOn(router, '_saveScrollHistory')
				.and
				.stub();

			spyOn(router, 'route')
				.and
				.stub();

			router.redirect(url, options);

			expect(router._setAddressBar).toHaveBeenCalledWith(url);
			expect(router._saveScrollHistory).toHaveBeenCalled();
			expect(router.route).toHaveBeenCalledWith(path, options);
		});

		it('return null for non exist route', () => {
			let url = 'http://example.com/somePath';

			spyOn(win, 'redirect')
				.and
				.stub();

			router.redirect(url);

			expect(win.redirect).toHaveBeenCalledWith(url);
		});
	});

	describe('route method', () => {

		it('should be call handleError for throwing error in super.router', (done) => {
			spyOn(router, 'handleError')
				.and
				.returnValue(Promise.resolve());

			router
				.route('/something')
				.then(() => {
					expect(router.handleError).toHaveBeenCalled();
					done();
				});
		});

	});

	describe('handleNotFound method', () => {

		it('should be call router.handleError function for throwing error', (done) => {
			spyOn(router, 'handleError')
				.and
				.returnValue(Promise.resolve('ok'));

			router
				.handleNotFound({ path: '/path' })
				.then(() => {
					expect(router.handleError).toHaveBeenCalled();
					done();

				});
		});

	});

	describe('_isSameDomain method', () => {

		it('should be return true for same domain', () => {
			let path = '/somePath';
			let url = protocol + '//' + host + path;

			expect(router._isSameDomain(url)).toEqual(true);
		});

		it('should be retrun false for strange domain', () => {
			let path = '/somePath';
			let url = protocol + '//' + 'www.strangeDomain.com' + path;

			expect(router._isSameDomain(url)).toEqual(false);
		});
	});

	describe('_isHashLink method', () => {
		using([
			{ targetUrl:'http://localhost/aaa#hash', baseUrl: 'http://localhost/aaa', result: true },
			{ targetUrl:'http://localhost/bbb#hash', baseUrl: 'http://localhost/aaa', result: false },
			{ targetUrl:'http://localhost/aaa', baseUrl: 'http://localhost/aaa', result: false }
		], (value) => {
			it('should be for ' + value.targetUrl + ' and base url ' + value.baseUrl + ' return ' + value.result, () => {
				spyOn(win, 'getUrl')
					.and
					.returnValue(value.baseUrl);

				expect(router._isHashLink(value.targetUrl)).toEqual(value.result);
			});
		});
	});

	it('_saveScrollHistory method should be call window.replaceState', () => {
		spyOn(win, 'replaceState')
			.and
			.stub();

		router._saveScrollHistory();

		expect(win.replaceState).toHaveBeenCalled();
	});

	it('_setAddressBar method should be call window.pushState', () => {
		spyOn(win, 'pushState')
			.and
			.stub();

		router._setAddressBar('url');

		expect(win.pushState).toHaveBeenCalled();
	});

});
