describe('Core.Router.ServerHandler', function() {

	var router = null;
	var pageRender = null;
	var routerFactory = null;
	var request = null;
	var respond = null;
	var Promise = ns.oc.get('$Promise');
	var domain = 'http://locahlost:3002';

	beforeEach(function() {
		pageRender = ns.oc.create('Core.PageRender.Client');
		routerFactory = ns.oc.make('$RouterFactory');
		request = ns.oc.create('Core.Router.Request');
		respond = ns.oc.create('Core.Router.Respond');
		router = ns.oc.create('Core.Router.ServerHandler', pageRender, routerFactory, Promise, request, respond);
		router.init({mode: router.MODE_SERVER, domain: domain});
	});

	it('should be return actual path', function() {
		spyOn(request, 'getPath')
			.and
			.stub();

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