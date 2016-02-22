describe('Ima.Router.ServerRouter', function() {

	var router = null;
	var pageRender = null;
	var routerFactory = null;
	var dispatcher = null;
	var request = null;
	var response = null;
	var domain = 'http://locahlost:3002';
	var ROUTER_CONSTANTS = oc.get('$ROUTER_CONSTANTS');

	beforeEach(function() {
		pageRender = oc.create('Ima.Interface.PageManager');
		routerFactory = oc.create('$RouterFactory');
		dispatcher = oc.create('Ima.Interface.Dispatcher');
		request = oc.create('Ima.Router.Request');
		response = oc.create('Ima.Router.Response');
		router = oc.create('Ima.Router.ServerRouter', [pageRender, routerFactory, dispatcher, ROUTER_CONSTANTS, request, response]);
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
