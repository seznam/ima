describe('Core.Router.Server', function() {

	var router = null;
	var pageRender = null;
	var routerFactory = null;
	var request = null;
	var respond = null;
	var Promise = oc.get('$Promise');
	var domain = 'http://locahlost:3002';

	beforeEach(function() {
		pageRender = oc.make('$PageRender');
		routerFactory = oc.make('$RouterFactory');
		request = oc.create('Core.Router.Request');
		respond = oc.create('Core.Router.Respond');
		router = oc.create('Core.Router.ServerHandler', pageRender, routerFactory, Promise, request, respond);
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

		spyOn(respond, 'redirect')
			.and
			.stub();

		router.redirect(url);

		expect(respond.redirect).toHaveBeenCalledWith(url);
	});

});