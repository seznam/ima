describe('ima.page.renderer.ClientPageRenderer', function() {

	var param1 = 'param1';
	var param2 = 'param2';
	var params = {
		param1: param1,
		param2: Promise.resolve(param2)
	};
	var pageState = {
		param1: param1,
		param2: param2
	};

	var controller = new ns.ima.controller.Controller();
	controller.getMetaManager = function() {};
	var view = function() {};

	var pageRenderer = null;
	var $Helper = oc.get('$Helper');
	var rendererFactory = oc.get('$PageRendererFactory');
	var ReactDOM = {
		unmountComponentAtNode: function() {},
		render: function() {}
	};
	var settings = oc.get('$Settings');
	var win = oc.get('$Window');
	var routeOptions = {
		onlyUpdate: false,
		autoScroll: false,
		allowSPA: false,
		documentView: null
	};

	beforeEach(function() {
		pageRenderer = oc.create('ima.page.renderer.ClientPageRenderer', [rendererFactory, $Helper, ReactDOM, settings, win]);
	});

	describe('mount method', function() {
		beforeEach(function() {
			spyOn(pageRenderer, '_separatePromisesAndValues')
				.and
				.returnValue({ values: { param1: params.param1 }, promises: { param2: params.param2 } });

			spyOn(pageRenderer, '_updateMetaAttributes');
			spyOn(pageRenderer, '_renderToDOM');
		});

		it('should set default page state values', function(done) {
			spyOn(controller, 'setState');

			pageRenderer
				.mount(controller, view, params, routeOptions)
				.then(function() {
					expect(controller.setState).toHaveBeenCalledWith(pageState);
					done();
				})
				.catch(function(error) {
					console.error(error);
					done(error);
				});
		});

		it('should patch promises to state', function(done) {
			spyOn(pageRenderer, '_patchPromisesToState');
			pageRenderer._firstTime = false;

			pageRenderer
				.mount(controller, view, params, routeOptions)
				.then(function() {
					expect(pageRenderer._patchPromisesToState).toHaveBeenCalledWith(controller, { param2: params.param2 });
					done();
				})
				.catch(function(error) {
					console.error(error);
					done(error);
				});
		});

		it('should set page meta params', function(done) {
			spyOn(controller, 'setMetaParams');
			spyOn(controller, 'getState')
				.and
				.returnValue(pageState);

			pageRenderer
				.mount(controller, view, params, routeOptions)
				.then(function() {
					expect(controller.setMetaParams).toHaveBeenCalledWith(pageState);
					done();
				})
				.catch(function(error) {
					console.error(error);
					done(error);
				});
		});

		it('should update page meta attributes', function(done) {
			pageRenderer
				.mount(controller, view, params, routeOptions)
				.then(function() {
					expect(pageRenderer._updateMetaAttributes).toHaveBeenCalled();
					done();
				})
				.catch(function(error) {
					console.error(error);
					done(error);
				});
		});

		it('should return resolved promise with object of property content, status and pageState', function(done) {
			spyOn(controller, 'getHttpStatus')
				.and
				.returnValue(200);

			pageRenderer
				.mount(controller, view, params, routeOptions)
				.then(function(response) {
					expect(response).toEqual({
						status: 200,
						content: null,
						pageState: pageState
					});
					done();
				})
				.catch(function(error) {
					console.error(error);
					done(error);
				});
		});

	});

	describe('update method', function() {

		beforeEach(function() {
			spyOn(pageRenderer, '_separatePromisesAndValues')
				.and
				.returnValue({ values: { param1: params.param1 }, promises: { param2: params.param2 } });

			spyOn(pageRenderer, '_updateMetaAttributes');
		});

		it('should set default page state values', function(done) {
			spyOn(controller, 'setState');

			pageRenderer
				.update(controller, params)
				.then(function() {
					expect(controller.setState).toHaveBeenCalledWith({ param1: params.param1 });
					done();
				})
				.catch(function(error) {
					console.error(error);
					done(error);
				});
		});

		it('should patch promises to state', function(done) {
			spyOn(pageRenderer, '_patchPromisesToState');

			pageRenderer
				.update(controller, params)
				.then(function() {
					expect(pageRenderer._patchPromisesToState).toHaveBeenCalledWith(controller, { param2: params.param2 });
					done();
				})
				.catch(function(error) {
					console.error(error);
					done(error);
				});
		});

		it('should set page meta params', function(done) {
			spyOn(controller, 'setMetaParams');
			spyOn(controller, 'getState')
				.and
				.returnValue(params);

			pageRenderer
				.update(controller, params)
				.then(function() {
					expect(controller.setMetaParams).toHaveBeenCalledWith(params);
					done();
				})
				.catch(function(error) {
					console.error(error);
					done(error);
				});
		});

		it('should update page meta attributes', function(done) {
			pageRenderer
				.update(controller, params)
				.then(function() {
					expect(pageRenderer._updateMetaAttributes).toHaveBeenCalled();
					done();
				})
				.catch(function(error) {
					console.error(error);
					done(error);
				});
		});

		it('should return resolved promise with object of property content, status and pageState', function(done) {
			spyOn(controller, 'getHttpStatus')
				.and
				.returnValue(200);

			pageRenderer
				.update(controller, params)
				.then(function(response) {
					expect(response).toEqual({
						status: 200,
						content: null,
						pageState: pageState
					});
					done();
				})
				.catch(function(error) {
					console.error(error);
					done(error);
				});
		});

	});

});
