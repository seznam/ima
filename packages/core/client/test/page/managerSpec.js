describe('Core.Page.Manager', function() {
	var pageFactory = {
		createController: function(Controller) {return new Controller();},
		decorateController: function(controller) {return controller;},
		createView: function(view) { return view;}
	};
	var pageRender = oc.create('Core.Interface.PageRender');
	var stateManager = oc.create('Core.Interface.PageStateManager');
	var windowInterface = oc.create('Core.Interface.Window');
	var eventBusInterface = oc.create('Core.Interface.EventBus');
	var pageManager = null;

	var controller = ns.Core.Interface.Controller;
	var view = function (){};
	var options = {
		onlyUpdate: false,
		autoScroll: true
	};

	beforeEach(function() {
		pageManager =
			oc.create('Core.Page.Manager',
				[
					pageFactory,
					pageRender,
					stateManager,
					windowInterface,
					eventBusInterface
				]
			);
	});

	it('should be listen for all custom events', function() {
		spyOn(eventBusInterface, 'listenAll')
			.and
			.stub();

		pageManager.init();

		expect(eventBusInterface.listenAll).toHaveBeenCalled();
	});

	it('should be observe state manager', function() {
		pageManager.init();

		expect(stateManager.onChange).not.toEqual(null);
	});

	it('scrollTo method should be call window.scrollTo async', function() {
		spyOn(windowInterface, 'scrollTo')
			.and
			.stub();

		jasmine.clock().install();
		pageManager.scrollTo(0, 0);
		jasmine.clock().tick(1);
		jasmine.clock().uninstall();

		expect(windowInterface.scrollTo).toHaveBeenCalledWith(0, 0);
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

	describe('_onCustomEventHanler method', function() {
		var data = {
			content: ''
		};

		var event = {
			detail: {
				eventName: 'event',
				data: data
			}		
		};

		it('should call method (with event name) from active controller', function() {
			pageManager._lastManagedPage.controllerInstance = {
				onEvent: function(data) {}
			};
			spyOn(pageManager._lastManagedPage.controllerInstance, 'onEvent');

			pageManager._onCustomEventHandler(event);

			expect(pageManager._lastManagedPage.controllerInstance.onEvent.calls.count()).toEqual(1);
			expect(pageManager._lastManagedPage.controllerInstance.onEvent).toHaveBeenCalledWith(data);
		});

		it('should throw error because active controller hasn\'t event listener' , function() {
			pageManager._lastManagedPage.controllerInstance = {
				onDifferentEvent: function(data) {}
			};
			spyOn(pageManager._lastManagedPage.controllerInstance, 'onDifferentEvent');
			spyOn(console, 'warn');

			pageManager._onCustomEventHandler(event);

			expect(pageManager._lastManagedPage.controllerInstance.onDifferentEvent.calls.count()).toEqual(0);
			expect(console.warn).toHaveBeenCalled();
		});

		it('should do nothing if active controller is null' , function() {
			pageManager._lastManagedPage.controllerInstance = null;
			spyOn(console, 'warn');

			pageManager._onCustomEventHandler(event);

			expect(console.warn).not.toHaveBeenCalled();
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
});