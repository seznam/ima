describe('Ima.Router.ServerRouter', function() {

	var router = null;
	var pageRenderer = null;
	var routeFactory = null;
	var dispatcher = null;
	var request = null;
	var response = null;
	var domain = 'http://locahlost:3002';
	var ROUTER_CONSTANTS = oc.get('$ROUTER_CONSTANTS');

	beforeEach(function() {
		pageRenderer = oc.create('Ima.Page.Manager.PageManager');
		routeFactory = oc.create('$RouteFactory');
		dispatcher = oc.create('Ima.Event.Dispatcher');
		request = oc.create('Ima.Router.Request');
		response = oc.create('Ima.Router.Response');
		router = oc.create('Ima.Router.ServerRouter', [pageRenderer, routeFactory, dispatcher, ROUTER_CONSTANTS, request, response]);
		router.init({mode: router.MODE_SERVER, domain: domain});
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
		var options = {httpStatus: 303};

		spyOn(response, 'redirect')
			.and
			.stub();

		router.redirect(url, options);

		expect(response.redirect).toHaveBeenCalledWith(url, 303);
	});

});
