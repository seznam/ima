import Dispatcher from 'event/Dispatcher';
import PageManager from 'page/manager/PageManager';
import Request from 'router/Request';
import Response from 'router/Response';
import RouteFactory from 'router/RouteFactory';
import ServerRouter from 'router/ServerRouter';

describe('ima.router.ServerRouter', () => {

	var router = null;
	var pageRenderer = null;
	var routeFactory = null;
	var dispatcher = null;
	var request = null;
	var response = null;
	var domain = 'http://locahlost:3002';

	beforeEach(() => {
		pageRenderer = new PageManager();
		routeFactory = new RouteFactory();
		dispatcher = new Dispatcher();
		request = new Request();
		response = new Response();
		router = new ServerRouter(pageRenderer, routeFactory, dispatcher, request, response);
		router.init({ mode: router.MODE_SERVER, domain: domain });
	});

	it('should be return actual path', () => {
		spyOn(request, 'getPath')
			.and
			.returnValue('');

		router.getPath();

		expect(request.getPath).toHaveBeenCalled();
	});

	it('should be redirect to url', () => {
		var url = domain + '/redirectUrl';
		var options = { httpStatus: 303 };

		spyOn(response, 'redirect')
			.and
			.stub();

		router.redirect(url, options);

		expect(response.redirect).toHaveBeenCalledWith(url, 303);
	});

});
