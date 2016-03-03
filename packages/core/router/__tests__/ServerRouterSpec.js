describe('ima.router.ServerRouter', function() {

	var router = null;
	var pageRenderer = null;
	var routeFactory = null;
	var dispatcher = null;
	var request = null;
	var response = null;
	var domain = 'http://locahlost:3002';
	var ROUTER_CONSTANTS = oc.get('$ROUTER_CONSTANTS');

	beforeEach(function() {
		pageRenderer = oc.create('ima.page.manager.PageManager');
		routeFactory = oc.create('$RouteFactory');
		dispatcher = oc.create('ima.event.Dispatcher');
		request = oc.create('ima.router.Request');
		response = oc.create('ima.router.Response');
		router = oc.create('ima.router.ServerRouter', [pageRenderer, routeFactory, dispatcher, ROUTER_CONSTANTS, request, response]);
		router.init({ mode: router.MODE_SERVER, domain: domain });
	});

	it('should be return actual path', function() {
		spyOn(request, 'getPath')
			.and
			.returnValue('');

		router.getPath();

		expect(request.getPath).toHaveBeenCalled();
	});

	it('should be redirect to url', function() {
		var url = domain + '/redirectUrl';
		var options = { httpStatus: 303 };

		spyOn(response, 'redirect')
			.and
			.stub();

		router.redirect(url, options);

		expect(response.redirect).toHaveBeenCalledWith(url, 303);
	});

});
