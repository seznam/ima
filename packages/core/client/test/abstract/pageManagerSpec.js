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

		it('should be only update last managed controller and view', function(done) {
			pageManager._lastManagedPage.decoratedController =
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

		it('should be mount new controller and view', function(done) {
			spyOn(pageManager, '_hasOnlyUpdate')
				.and
				.returnValue(false);
			spyOn(pageManager, '_preManage')
				.and
				.stub();
			spyOn(pageManager, '_postManage')
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

		it('should be set route params to controller instance', function() {
			spyOn(controllerInstance, 'setRouteParams')
				.and
				.stub();

			pageManager._initController(controllerInstance, params);

			expect(controllerInstance.setRouteParams).toHaveBeenCalledWith(params);
		});

		it('should be set stateManager to controller instance', function() {
			spyOn(controllerInstance, 'setStateManager')
				.and
				.stub();

			pageManager._initController(controllerInstance, params);

			expect(controllerInstance.setStateManager).toHaveBeenCalledWith(stateManager);
		});

		it('should be call init function on controller instance', function() {
			spyOn(controllerInstance, 'init')
				.and
				.stub();

			pageManager._initController(controllerInstance, params);

			expect(controllerInstance.init).toHaveBeenCalled();
		});
	});

	describe('_destroyController method', function() {
		var controllerInstance = null;

		beforeEach(function() {
			controllerInstance = pageFactory.createController(controller);
		});

		it('should be call destroy on controller instance', function() {
			spyOn(controllerInstance, 'destroy')
				.and
				.stub();

			pageManager._destroyController(controllerInstance);

			expect(controllerInstance.destroy).toHaveBeenCalled();
		});

		it('should be unset stateManager to controller', function() {
			spyOn(controllerInstance, 'setStateManager')
				.and
				.stub();

			pageManager._destroyController(controllerInstance);

			expect(controllerInstance.setStateManager).toHaveBeenCalledWith(null);
		});

		it('should be unmout view from DOM', function() {
			spyOn(pageRender, 'unmount')
				.and
				.stub();

			pageManager._destroyController(controllerInstance);

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
			pageManager._lastManagedPage.controller = controller;
			pageManager._lastManagedPage.view = view;

			spyOn(newOptions, 'onlyUpdate')
				.and
				.callThrough();

			expect(pageManager._hasOnlyUpdate(controller, view, newOptions)).toEqual(true);
			expect(newOptions.onlyUpdate).toHaveBeenCalledWith(controller, view);

		});

		it('should return true for option onlyUpdate set to true and for same controller and view', function() {
			var newOptions = Object.assign({}, options, {onlyUpdate: true});
			pageManager._lastManagedPage.controller = controller;
			pageManager._lastManagedPage.view = view;

			expect(pageManager._hasOnlyUpdate(controller, view, newOptions)).toEqual(true);
		});

		it('should return false for option onlyUpdate set to true and for different controller and view', function() {
			var newOptions = Object.assign({}, options, {onlyUpdate: true});
			pageManager._lastManagedPage.controller = null;
			pageManager._lastManagedPage.view = view;

			expect(pageManager._hasOnlyUpdate(controller, view, newOptions)).toEqual(false);
		});
	});
});