describe('Core.Page.Render.Server', function() {

	var param1 = 'param1';
	var param2 = 'param2';
	var params = {
		param1: param1,
		param2: Promise.resolve(param2)
	};

	var controller = new ns.Core.Interface.Controller();
	var view = function (){};
	var expressResponse = {
		status: function() {},
		send: function() {}
	};

	var pageRender = null;
	var $Helper = ns.Vendor.$Helper;
	var factory = oc.get('$PageRenderFactory');
	var ReactDOMServer = oc.get('$ReactDOMServer');
	var settings = oc.get('$Settings');
	var response = oc.get('$Response');
	var cache = oc.get('$Cache');

	beforeEach(function() {
		response.init(expressResponse);
		pageRender = oc.create('Core.Page.Render.Server', [factory, $Helper, ReactDOMServer, settings, response, cache, oc]);
	});

	it('should be wrap each key to promise', function() {
		spyOn(Promise, 'resolve')
			.and
			.callThrough();

		pageRender._wrapEachKeyToPromise(params);

		expect(Promise.resolve).toHaveBeenCalledWith(param1);
		expect(Promise.resolve.calls.count()).toEqual(1);
	 });

	describe('update method', function() {

		it('should call mount method', function() {
			spyOn(pageRender, 'mount')
				.and
				.stub();

			pageRender.update(controller, params);

			expect(pageRender.mount).toHaveBeenCalledWith(controller, params);
		});

	});

	describe('mount method', function() {

		it('should return already sent data to the client', function(done) {
			var responseParams = {
				content: '',
				status: 200
			};

			spyOn(response, 'isResponseSent')
				.and
				.returnValue(true);
			spyOn(response, 'getResponseParams')
				.and
				.returnValue(responseParams);

			pageRender
				.mount(controller, view)
				.then(function(page) {
					expect(page).toEqual(responseParams);
					done();
				});
		});

		it('should call _renderPage method', function(done) {
			spyOn(pageRender, '_renderPage')
				.and
				.stub();

			pageRender
				.mount(controller, view)
				.then(function(page) {
					expect(pageRender._renderPage).toHaveBeenCalled();
					done();
				});
		});

	});

	describe('_renderPage method', function() {
		var fetchedResource = {
			resource: 'json'
		};

		it('should return already sent data to client', function() {
			var responseParams = {
				content: '',
				status: 200
			};

			spyOn(response, 'isResponseSent')
				.and
				.returnValue(true);
			spyOn(response, 'getResponseParams')
				.and
				.returnValue(responseParams);

			expect(pageRender._renderPage(controller, view, fetchedResource)).toEqual(responseParams);
		});

		it('should set controller state, meta params and render page content', function() {
			spyOn(controller, 'setState')
				.and
				.stub();
			spyOn(controller, 'setMetaParams')
				.and
				.stub();
			spyOn(controller, 'getHttpStatus')
				.and
				.stub();
			spyOn(pageRender, '_renderPageContentToString')
				.and
				.stub();

			pageRender._renderPage(controller, view, fetchedResource);

			expect(controller.setState).toHaveBeenCalledWith(fetchedResource);
			expect(controller.setMetaParams).toHaveBeenCalledWith(fetchedResource);
			expect(controller.getHttpStatus).toHaveBeenCalled();
			expect(pageRender._renderPageContentToString).toHaveBeenCalledWith(controller, view);
		});


	});

});
