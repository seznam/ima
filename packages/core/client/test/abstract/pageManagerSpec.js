describe('Core.Abstract.PageManager', function() {
	var pageFactory = {
		createController: function(Controller) {return new Controller();},
		decorateController: function(controller) {return controller;},
		createView: function(view) { return view;}
	};
	var pageRender = oc.create('Core.Interface.PageRender');
	var stateManager = oc.create('Core.Interface.PageStateManager');
	var pageManager = null;

	var controller = ns.Core.Interface.Controller;
	var view = function (){};
	var options = {
		onlyUpdate: false,
		autoScroll: true
	};

	beforeEach(function() {
		pageManager =
			oc.create('Core.Abstract.PageManager',
				[
					pageFactory,
					pageRender,
					stateManager
				]
			);
	});

	it('should be observe state manager', function() {
		pageManager.init();

		expect(stateManager.onChange).not.toEqual(null);
	});

	it('scrollTo method should throw Error', function() {
		expect(function() {
			pageManager.scrollTo(0, 0);
		}).toThrow();
	});

	describe('manage method', function() {

		it('should only update last managed controller and view', function(done) {
			pageManager._managedPage.decoratedController =
				pageFactory.decorateController(pageFactory.createController(controller));

			spyOn(pageManager, '_hasOnlyUpdate')
				.and
				.returnValue(true);
			spyOn(pageManager, '_preManage')
				.and
				.stub();
			spyOn(pageManager, '_postManage')
				.and
				.stub();
			spyOn(pageRender, 'update')
				.and
				.returnValue(Promise.resolve());

			pageManager
				.manage(controller, view, options)
				.then(function() {
					expect(pageManager._preManage).toHaveBeenCalled();
					expect(pageRender.update).toHaveBeenCalled();
					expect(pageManager._postManage).toHaveBeenCalled();
					done();
				})
				.catch(function(e) {
					console.error('Core.Page.Manager:manage', e.message);
					done();
				});
		});

		it('should mount new controller and view', function(done) {
			spyOn(pageManager, '_hasOnlyUpdate')
				.and
				.returnValue(false);
			spyOn(pageManager, '_preManage')
				.and
				.stub();
			spyOn(pageManager, '_postManage')
				.and
				.stub();
			spyOn(pageManager, '_deactivateController')
				.and
				.stub();
			spyOn(pageManager, '_destroyController')
				.and
				.stub();
			spyOn(pageManager, '_initController')
				.and
				.stub();
			spyOn(pageRender, 'mount')
				.and
				.returnValue(Promise.resolve());

			pageManager
				.manage(controller, view, options)
				.then(function() {
					expect(pageManager._preManage).toHaveBeenCalled();
					expect(pageManager._deactivateController).toHaveBeenCalled();
					expect(pageManager._destroyController).toHaveBeenCalled();
					expect(pageManager._initController).toHaveBeenCalled();
					expect(pageRender.mount).toHaveBeenCalled();
					expect(pageManager._postManage).toHaveBeenCalled();
					done();
				})
				.catch(function(e) {
					console.error('Core.Page.Manager:manage', e.message);
					done();
				});
		});
	});

	describe('_initController method', function() {
		var controllerInstance = pageFactory.createController(controller);
		var params = {param: 1};

		beforeEach(function() {
			pageManager._storeManagedPageValue(null, null, null, params, controllerInstance, null, null);
		});

		afterEach(function() {
			pageManager._clearManagedPageValue();
		});

		it('should set route params to controller instance', function() {
			spyOn(controllerInstance, 'setRouteParams')
				.and
				.stub();

			pageManager._initController(params);

			expect(controllerInstance.setRouteParams).toHaveBeenCalledWith(params);
		});

		it('should set stateManager to controller instance', function() {
			spyOn(controllerInstance, 'setStateManager')
				.and
				.stub();

			pageManager._initController(params);

			expect(controllerInstance.setStateManager).toHaveBeenCalledWith(stateManager);
		});

		it('should call init function on controller instance', function() {
			spyOn(controllerInstance, 'init')
				.and
				.stub();

			pageManager._initController(params);

			expect(controllerInstance.init).toHaveBeenCalled();
		});
	});

	describe('_deactivateController method', function() {
		var controllerInstance = null;

		beforeEach(function() {
			controllerInstance = pageFactory.createController(controller);
			pageManager._storeManagedPageValue(null, null, null, null, controllerInstance, null, null);
		});

		afterEach(function() {
			pageManager._clearManagedPageValue();
		});

		it('should call deactivate on activated controller ', function() {
			pageManager._managedPage.state.activated = true;
			spyOn(controllerInstance, 'deactivate')
				.and
				.stub();

			pageManager._deactivateController();

			expect(controllerInstance.deactivate).toHaveBeenCalled();
		});

		it('should not call deactivate on no activated controller', function() {
			spyOn(controllerInstance, 'deactivate')
				.and
				.stub();

			pageManager._deactivateController();

			expect(controllerInstance.deactivate).not.toHaveBeenCalled();
		});
	});


	describe('_destroyController method', function() {
		var controllerInstance = null;

		beforeEach(function() {
			controllerInstance = pageFactory.createController(controller);
			pageManager._storeManagedPageValue(null, null, null, null, controllerInstance, null, null);
		});

		afterEach(function() {
			pageManager._clearManagedPageValue();
		});

		it('should call destroy on controller instance', function() {
			spyOn(controllerInstance, 'destroy')
				.and
				.stub();

			pageManager._destroyController();

			expect(controllerInstance.destroy).toHaveBeenCalled();
		});

		it('should unset stateManager to controller', function() {
			spyOn(controllerInstance, 'setStateManager')
				.and
				.stub();

			pageManager._destroyController();

			expect(controllerInstance.setStateManager).toHaveBeenCalledWith(null);
		});

		it('should unmout view from DOM', function() {
			spyOn(pageRender, 'unmount')
				.and
				.stub();

			pageManager._destroyController();

			expect(pageRender.unmount).toHaveBeenCalled();
		});
	});

	describe('_preManage method', function() {

		it('should call scroll to', function() {
			var newOptions = Object.assign({}, options, {autoScroll: true});
			spyOn(pageManager, 'scrollTo')
				.and
				.stub();

			pageManager._preManage(options);

			expect(pageManager.scrollTo).toHaveBeenCalled();
		});
	});

	describe('_hasOnlyUpdate method', function() {

		it('should return value from onlyUpdate function', function() {
			var newOptions = Object.assign({}, options, {onlyUpdate: function() {return true;}});
			pageManager._managedPage.controller = controller;
			pageManager._managedPage.view = view;

			spyOn(newOptions, 'onlyUpdate')
				.and
				.callThrough();

			expect(pageManager._hasOnlyUpdate(controller, view, newOptions)).toEqual(true);
			expect(newOptions.onlyUpdate).toHaveBeenCalledWith(controller, view);

		});

		it('should return true for option onlyUpdate set to true and for same controller and view', function() {
			var newOptions = Object.assign({}, options, {onlyUpdate: true});
			pageManager._managedPage.controller = controller;
			pageManager._managedPage.view = view;

			expect(pageManager._hasOnlyUpdate(controller, view, newOptions)).toEqual(true);
		});

		it('should return false for option onlyUpdate set to true and for different controller and view', function() {
			var newOptions = Object.assign({}, options, {onlyUpdate: true});
			pageManager._managedPage.controller = null;
			pageManager._managedPage.view = view;

			expect(pageManager._hasOnlyUpdate(controller, view, newOptions)).toEqual(false);
		});
	});
});