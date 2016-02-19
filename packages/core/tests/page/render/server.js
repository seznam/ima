describe('Core.Page.Render.Server', function() {

	var param1 = 'param1';
	var param2 = 'param2';
	var params = {
		param1: param1,
		param2: Promise.resolve(param2)
	};

	var controller = new ns.Core.Interface.Controller();
	controller.getMetaManager = function() {};
	var view = function() {};
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

		it('should reject promise with error', function(done) {
			spyOn(pageRender, 'mount')
				.and
				.stub();

			pageRender
				.update(controller, params)
				.catch(function(error) {
					expect(error instanceof ns.Core.IMAError).toEqual(true);
					done();
				});
		});

	});

	describe('mount method', function() {

		var loadedPageState = {
			param1: 'param1',
			param2: Promise.resolve('param2')
		};

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
				.mount(controller, view, loadedPageState)
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
				.mount(controller, view, loadedPageState)
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

		describe('render new page', function() {

			var responseParams = { status: 200, content: '' };
			var pageRenderResponse = null;

			beforeEach(function() {
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
				spyOn(response, 'status')
					.and
					.returnValue(response);
				spyOn(response, 'send')
					.and
					.returnValue(response);
				spyOn(response, 'getResponseParams')
					.and
					.returnValue(responseParams);

				pageRenderResponse = pageRender._renderPage(controller, view, fetchedResource);
			});

			it('should set controller state', function() {
				expect(controller.setState).toHaveBeenCalledWith(fetchedResource);
			});

			it('should set meta params', function() {
				expect(controller.setMetaParams).toHaveBeenCalledWith(fetchedResource);
			});

			it('should send response for request', function() {
				expect(response.status).toHaveBeenCalled();
				expect(response.send).toHaveBeenCalled();
				expect(controller.getHttpStatus).toHaveBeenCalled();
				expect(pageRender._renderPageContentToString).toHaveBeenCalledWith(controller, view);
			});

			it('should return response params', function() {
				expect(pageRenderResponse).toEqual(responseParams);
			});
		});
	});

	describe('_renderPageContentToString method', function() {

		var utils = { $Utils: 'utils' };
		var state = { state: 'state' };
		var propsView = { view: view };
		var props = Object.assign({}, state, utils, propsView);
		var wrapedPageViewElement = { wrapElementView: 'wrapedPageViewElement' };
		var pageMarkup = '<body></body>';
		var documentView = function() {};
		var documentViewElement = function() {};
		var documentViewFactory = function() {
			return documentViewElement;
		};
		var appMarkup = '<html>' + pageMarkup + '</html>';
		var revivalSettings = { revivalSettings: 'revivalSettings' };
		var metaManager = { metaManager: 'metaManager' };
		var pageContent = null;

		beforeEach(function() {
			spyOn(pageRender, '_generateViewProps')
				.and
				.returnValue(props);
			spyOn(controller, 'getState')
				.and
				.returnValue(state);
			spyOn(factory, 'wrapView')
				.and
				.returnValue(wrapedPageViewElement);
			spyOn(ReactDOMServer, 'renderToString')
				.and
				.returnValue(pageMarkup);
			spyOn(ns, 'get')
				.and
				.returnValue(documentView);
			spyOn(factory, 'reactCreateFactory')
				.and
				.returnValue(documentViewFactory);
			spyOn(ReactDOMServer, 'renderToStaticMarkup')
				.and
				.returnValue(appMarkup);
			spyOn(pageRender, '_getRevivalSettings')
				.and
				.returnValue(revivalSettings);
			spyOn(controller, 'getMetaManager')
				.and
				.returnValue(metaManager);
			spyOn(factory, 'getUtils')
				.and
				.returnValue(utils);

			pageContent = pageRender._renderPageContentToString(controller, view);
		});

		it('should generate view props from controller state', function() {
			expect(pageRender._generateViewProps).toHaveBeenCalledWith(view, state);
		});

		it('should wrap page view', function() {
			expect(factory.wrapView).toHaveBeenCalledWith(props);
		});

		it('should render page view to string', function() {
			expect(ReactDOMServer.renderToString).toHaveBeenCalledWith(wrapedPageViewElement);
		});

		it('should find document view from namespace', function() {
			expect(ns.get).toHaveBeenCalledWith(settings.$Page.$Render.documentView);
		});

		it('should create factory for creating React element from document view', function() {
			expect(factory.reactCreateFactory).toHaveBeenCalledWith(documentView);
		});

		it('should render static markup from document view', function() {
			expect(factory.getUtils).toHaveBeenCalled();
			expect(controller.getMetaManager).toHaveBeenCalled();
			expect(pageRender._getRevivalSettings).toHaveBeenCalled();
			expect(ReactDOMServer.renderToStaticMarkup).toHaveBeenCalledWith(documentViewElement);
		});

		it('should return page content', function() {
			expect(pageContent).toEqual('<!doctype html>\n' + appMarkup);
		});
	});

});
