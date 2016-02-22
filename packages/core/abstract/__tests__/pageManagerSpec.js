describe('Ima.Abstract.PageManager', function() {
	var pageFactory = {
		createController: function(Controller) {return new Controller();},
		decorateController: function(controller) {return controller;},
		decoratePageStateManager: function(pageStateManger) {return pageStateManger},
		createView: function(view) { return view;}
	};
	var pageRender = oc.create('Ima.Interface.PageRender');
	var pageStateManager = oc.create('Ima.Interface.PageStateManager');
	var pageManager = null;

	var Controller = ns.Ima.Controller.Controller;
	var Extension = ns.Ima.Interface.Extension;
	var View = function () {};
	var options = {
		onlyUpdate: false,
		autoScroll: true
	};
	var params = {
		param1: 'param1',
		param2: 2
	};

	var controllerInstance = pageFactory.createController(Controller);
	var decoratedController = pageFactory.decorateController(controllerInstance);
	var viewInstance = pageFactory.createView(View);
	var extensionInstance = new Extension();

	var controllerState = {
		controller: 'controller',
		share: 'controller'
	};
	var extensionsState = {
		extension: 'extension',
		share: 'extension'
	};
	var extensionState = {};
	var pageState = Object.assign({}, extensionsState, controllerState);

	beforeEach(function() {
		pageManager =
			oc.create('Ima.Abstract.PageManager',
				[
					pageFactory,
					pageRender,
					pageStateManager
				]
			);

		spyOn(controllerInstance, 'getExtensions')
			.and
			.returnValue([extensionInstance]);

		pageManager._storeManagedPageValue(Controller, View, options, params, controllerInstance, decoratedController, viewInstance);
	});

	afterEach(function() {
		pageManager._clearManagedPageValue();
	});

	it('should be observe state manager', function() {
		pageManager.init();

		expect(pageStateManager.onChange).not.toEqual(null);
	});

	it('scrollTo method should throw Error', function() {
		expect(function() {
			pageManager.scrollTo(0, 0);
		}).toThrow();
	});

	describe('manage method', function() {

		it('should only update last managed controller and view', function(done) {
			spyOn(pageManager, '_hasOnlyUpdate')
				.and
				.returnValue(true);
			spyOn(pageManager, '_preManage')
				.and
				.stub();
			spyOn(pageManager, '_updatePageSource')
				.and
				.returnValue(Promise.resolve());

			pageManager
				.manage(Controller, View, options, params)
				.then(function() {
					expect(pageManager._preManage).toHaveBeenCalled();
					expect(pageManager._managedPage.params).toEqual(params);
					expect(pageManager._updatePageSource).toHaveBeenCalled();
					done();
				})
				.catch(function(e) {
					console.error('Ima.Page.Manager:manage', e.message);
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
			spyOn(pageManager, '_deactivatePageSource')
				.and
				.stub();
			spyOn(pageManager, '_destroyPageSource')
				.and
				.stub();
			spyOn(pageManager, '_initPageSource')
				.and
				.stub();
			spyOn(pageManager, '_loadPageSource')
				.and
				.returnValue(Promise.resolve());

			pageManager
				.manage(Controller, View, options, params)
				.then(function() {
					expect(pageManager._preManage).toHaveBeenCalled();
					expect(pageManager._deactivatePageSource).toHaveBeenCalled();
					expect(pageManager._destroyPageSource).toHaveBeenCalled();
					expect(pageManager._initPageSource).toHaveBeenCalled();
					expect(pageManager._loadPageSource).toHaveBeenCalled();
					done();
				})
				.catch(function(e) {
					console.error('Ima.Page.Manager:manage', e.message);
					done();
				});
		});
	});

	describe('destroy method', function() {

		it('should clear managed page value', function() {
			spyOn(pageManager, '_clearManagedPageValue')
				.and
				.stub();

			pageManager.destroy();

			expect(pageManager._clearManagedPageValue).toHaveBeenCalled();
		});

		it('should remove listener for onChange event from page state manager', function() {
			pageManager.destroy();

			expect(pageStateManager.onChange).toBeNull();
		});

		it('should deactivate page source', function() {
			spyOn(pageManager, '_deactivatePageSource')
				.and
				.stub();

			pageManager.destroy();

			expect(pageManager._deactivatePageSource).toHaveBeenCalled();
		});

		it('should destroy page source', function() {
			spyOn(pageManager, '_destroyPageSource')
				.and
				.stub();

			pageManager.destroy();

			expect(pageManager._destroyPageSource).toHaveBeenCalled();
		});

	});

	describe('_setRestrictedPageStateManager', function() {

		var allowedStateKeys = ['user'];
		var allAllowedStateKeys = Object.keys(extensionState).concat(allowedStateKeys);

		beforeEach(function() {
			spyOn(extensionInstance, 'getAllowedStateKeys')
				.and
				.returnValue(allowedStateKeys);

			spyOn(pageFactory, 'decoratePageStateManager')
				.and
				.returnValue(pageStateManager);

			spyOn(extensionInstance, 'setPageStateManager')
				.and
				.stub();
		});

		it('should create restricted page state manager for extension', function() {
			pageManager._setRestrictedPageStateManager(extensionInstance, extensionState);

			expect(pageFactory.decoratePageStateManager).toHaveBeenCalledWith(pageStateManager, allAllowedStateKeys);
		});

		it('should set restricted page state manager to extension', function() {
			pageManager._setRestrictedPageStateManager(extensionInstance, extensionState);

			expect(extensionInstance.setPageStateManager).toHaveBeenCalledWith(pageStateManager);
		});

	});

	describe('_initPageSource method', function() {

		it('should initialization page source', function() {
			spyOn(pageManager, '_initController')
				.and
				.stub();
			spyOn(pageManager, '_initExtensions')
				.and
				.stub();

			pageManager._initPageSource();

			expect(pageManager._initController).toHaveBeenCalledWith();
			expect(pageManager._initExtensions).toHaveBeenCalledWith();
		});
	});

	describe('_initController method', function() {

		it('should set route params to controller instance', function() {
			spyOn(controllerInstance, 'setRouteParams')
				.and
				.stub();

			pageManager._initController();

			expect(controllerInstance.setRouteParams).toHaveBeenCalledWith(params);
		});

		it('should call init function on controller instance', function() {
			spyOn(controllerInstance, 'init')
				.and
				.stub();

			pageManager._initController();

			expect(controllerInstance.init).toHaveBeenCalled();
		});
	});

	describe('_initExtensions method', function() {

		it('should set route params to extension instance', function() {
			spyOn(extensionInstance, 'setRouteParams')
				.and
				.stub();

			pageManager._initExtensions();

			expect(extensionInstance.setRouteParams).toHaveBeenCalledWith(params);
		});

		it('should call init function on controller instance', function() {
			spyOn(extensionInstance, 'init')
				.and
				.stub();

			pageManager._initExtensions();

			expect(extensionInstance.init).toHaveBeenCalled();
		});
	});

	describe('_loadPageSource method', function() {

		beforeEach(function() {
			spyOn(pageManager, '_getLoadedControllerState')
				.and
				.returnValue(controllerState);

			spyOn(pageManager, '_getLoadedExtensionsState')
				.and
				.returnValue(extensionsState);
			spyOn(pageRender, 'mount')
				.and
				.returnValue(Promise.resolve());
		});

		it('should be merge state from controller and extensions to loaded page state', function(done) {
			pageManager
				._loadPageSource()
				.then(function() {
					expect(pageRender.mount).toHaveBeenCalledWith(decoratedController, View, pageState);
					done();
				})
				.catch(function(error) {
					console.error('Ima.Page.Manager:_loadPageSource', e.message);
					done();
				});
		});

		it('should make post manage action', function(done) {
			spyOn(pageManager, '_postManage')
				.and
				.stub();

			pageManager
				._loadPageSource()
				.then(function() {
					expect(pageManager._postManage).toHaveBeenCalledWith(options);
					done();
				})
				.catch(function(error) {
					console.error('Ima.Page.Manager:_loadPageSource', e.message);
					done();
				});
		});
	});

	describe('_getLoadedControllerState method', function() {

		it('should calls controller load method', function() {
			spyOn(controllerInstance, 'load')
				.and
				.stub();

			pageManager._getLoadedControllerState();

			expect(controllerInstance.load).toHaveBeenCalled();
		});

		it('should set pageStateManager to controller instance', function() {
			spyOn(controllerInstance, 'setPageStateManager')
				.and
				.stub();

			pageManager._getLoadedControllerState();

			expect(controllerInstance.setPageStateManager).toHaveBeenCalledWith(pageStateManager);
		});
	});

	describe('_getLoadedExtensionsState method', function() {

		beforeEach(function() {
			spyOn(extensionInstance, 'load')
				.and
				.returnValue(extensionState);
		});

		it('should call extensions load method', function() {
			pageManager._getLoadedExtensionsState();

			expect(extensionInstance.load).toHaveBeenCalled();
		});

		it('should set restricted pageStateManager to extension instance', function() {
			spyOn(pageManager, '_setRestrictedPageStateManager')
				.and
				.stub();

			pageManager._getLoadedExtensionsState();

			expect(pageManager._setRestrictedPageStateManager).toHaveBeenCalledWith(extensionInstance, extensionState);
		});
	});

	describe('_activatePageSource method', function() {

		beforeEach(function() {
			spyOn(pageManager, '_activateController')
				.and
				.stub();

			spyOn(pageManager, '_activateExtensions')
				.and
				.stub();
		});

		it('should activate controller and extensions', function() {
			pageManager._activatePageSource();

			expect(pageManager._activateController).toHaveBeenCalled();
			expect(pageManager._activateExtensions).toHaveBeenCalled();
			expect(pageManager._managedPage.state.activated).toEqual(true);
		});

		it('should not call method activate more times', function() {
			pageManager._managedPage.state.activated = true;

			expect(pageManager._activateController).not.toHaveBeenCalled();
			expect(pageManager._activateExtensions).not.toHaveBeenCalled();
		});
	});

	describe('_activateController method', function() {

		it('should call activate method on controller', function() {
			spyOn(controllerInstance, 'activate')
				.and
				.stub();

			pageManager._activateController();

			expect(controllerInstance.activate).toHaveBeenCalled();
		});
	});

	describe('_activateExtensions method', function() {

		it('should call activate method on extensions', function() {
			spyOn(extensionInstance, 'activate')
				.and
				.stub();

			pageManager._activateExtensions();

			expect(extensionInstance.activate).toHaveBeenCalled();
		});
	});

	describe('_updatePageSource method', function() {

		beforeEach(function() {
			spyOn(pageManager, '_getUpdatedControllerState')
				.and
				.returnValue(controllerState);

			spyOn(pageManager, '_getUpdatedExtensionsState')
				.and
				.returnValue(extensionsState);
			spyOn(pageRender, 'update')
				.and
				.returnValue(Promise.resolve());
		});

		it('should be merge state from controller and extensions to updated page state', function(done) {
			pageManager
				._updatePageSource()
				.then(function() {
					expect(pageRender.update).toHaveBeenCalledWith(decoratedController, pageState);
					done();
				})
				.catch(function(error) {
					console.error('Ima.Page.Manager:_updatePageSource', e.message);
					done();
				});
		});

		it('should make post manage action', function(done) {
			spyOn(pageManager, '_postManage')
				.and
				.stub();

			pageManager
				._updatePageSource()
				.then(function() {
					expect(pageManager._postManage).toHaveBeenCalledWith(options);
					done();
				})
				.catch(function(error) {
					console.error('Ima.Page.Manager:_updatePageSource', e.message);
					done();
				});
		});
	});

	describe('_getUpdatedControllerState method', function() {

		it('should calls controller update method', function() {
			spyOn(controllerInstance, 'update')
				.and
				.stub();
			spyOn(controllerInstance, 'getRouteParams')
				.and
				.returnValue(params);

			pageManager._getUpdatedControllerState();

			expect(controllerInstance.update).toHaveBeenCalledWith(params);
		});
	});

	describe('_getUpdatedExtensionsState method', function() {

		beforeEach(function() {
			spyOn(extensionInstance, 'update')
				.and
				.returnValue(extensionState);
		});

		it('should call extensions update method', function() {
			spyOn(extensionInstance, 'getRouteParams')
				.and
				.returnValue(params);

			pageManager._getUpdatedExtensionsState();

			expect(extensionInstance.update).toHaveBeenCalledWith(params);
		});

		it('should set restricted pageStateManager to extension instance', function() {
			spyOn(pageManager, '_setRestrictedPageStateManager')
				.and
				.stub();

			pageManager._getUpdatedExtensionsState();

			expect(pageManager._setRestrictedPageStateManager).toHaveBeenCalledWith(extensionInstance, extensionState);
		});
	});

	describe('_deactivatePageSource method', function() {

		beforeEach(function() {
			spyOn(pageManager, '_deactivateController')
				.and
				.stub();

			spyOn(pageManager, '_deactivateExtensions')
				.and
				.stub();
		});

		it('should activate controller and extensions', function() {
			pageManager._managedPage.state.activated = true;

			pageManager._deactivatePageSource();

			expect(pageManager._deactivateController).toHaveBeenCalled();
			expect(pageManager._deactivateExtensions).toHaveBeenCalled();
		});

		it('should not call method activate more times', function() {
			pageManager._managedPage.state.activated = false;

			expect(pageManager._deactivateController).not.toHaveBeenCalled();
			expect(pageManager._deactivateExtensions).not.toHaveBeenCalled();
		});
	});

	describe('_deactivateController method', function() {

		it('should call deactivate method on controller', function() {
			spyOn(controllerInstance, 'deactivate')
				.and
				.stub();

			pageManager._deactivateController();

			expect(controllerInstance.deactivate).toHaveBeenCalled();
		});
	});

	describe('_deactivateExtensions method', function() {

		it('should call deactivate method on extensions', function() {
			spyOn(extensionInstance, 'deactivate')
				.and
				.stub();

			pageManager._deactivateExtensions();

			expect(extensionInstance.deactivate).toHaveBeenCalled();
		});
	});

	describe('_destroyPageSource method', function() {

		it('should destroy page resource', function() {
			spyOn(pageManager, '_destroyController')
				.and
				.stub();
			spyOn(pageManager, '_destroyExtensions')
				.and
				.stub();
			spyOn(pageStateManager, 'clear')
				.and
				.stub();
			spyOn(pageRender, 'unmount')
				.and
				.stub();
			spyOn(pageManager, '_clearManagedPageValue')
				.and
				.stub();

			pageManager._destroyPageSource();

			expect(pageManager._destroyController).toHaveBeenCalledWith();
			expect(pageManager._destroyExtensions).toHaveBeenCalledWith();
			expect(pageStateManager.clear).toHaveBeenCalledWith();
			expect(pageRender.unmount).toHaveBeenCalledWith();
			expect(pageManager._clearManagedPageValue).toHaveBeenCalledWith();
		});
	});

	describe('_destroyController method', function() {

		it('should call destroy on controller instance', function() {
			spyOn(controllerInstance, 'destroy')
				.and
				.stub();

			pageManager._destroyController();

			expect(controllerInstance.destroy).toHaveBeenCalled();
		});

		it('should unset pageStateManager to controller', function() {
			spyOn(controllerInstance, 'setPageStateManager')
				.and
				.stub();

			pageManager._destroyController();

			expect(controllerInstance.setPageStateManager).toHaveBeenCalledWith(null);
		});
	});

	describe('_destroyExtensions method', function() {

		it('should call destroy on extension instance', function() {
			spyOn(extensionInstance, 'destroy')
				.and
				.stub();

			pageManager._destroyExtensions();

			expect(extensionInstance.destroy).toHaveBeenCalled();
		});

		it('should unset pageStateManager to extension', function() {
			spyOn(extensionInstance, 'setPageStateManager')
				.and
				.stub();

			pageManager._destroyExtensions();

			expect(extensionInstance.setPageStateManager).toHaveBeenCalledWith(null);
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
			var newOptions = Object.assign({}, options, { onlyUpdate: function() {return true;} });

			spyOn(newOptions, 'onlyUpdate')
				.and
				.callThrough();

			expect(pageManager._hasOnlyUpdate(Controller, View, newOptions)).toEqual(true);
			expect(newOptions.onlyUpdate).toHaveBeenCalledWith(Controller, View);
		});

		it('should return true for option onlyUpdate set to true and for same controller and view', function() {
			var newOptions = Object.assign({}, options, { onlyUpdate: true });

			expect(pageManager._hasOnlyUpdate(Controller, View, newOptions)).toEqual(true);
		});

		it('should return false for option onlyUpdate set to true and for different controller and view', function() {
			var newOptions = Object.assign({}, options, { onlyUpdate: true });
			pageManager._managedPage.controller = null;

			expect(pageManager._hasOnlyUpdate(Controller, View, newOptions)).toEqual(false);
		});
	});

	describe('_onChangeStateHandler method', function() {

		it('should call setState', function() {
			var state = { state: 'state' };

			spyOn(pageRender, 'setState')
				.and
				.stub();

			pageManager._onChangeStateHandler(state);

			expect(pageRender.setState).toHaveBeenCalledWith(state);
		});
	});
});
