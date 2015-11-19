describe('Core.Page.Manager.Client', function() {
	var pageFactory = {
		createController: function(Controller) { return new Controller(); },
		decorateController: function(controller) { return controller; },
		decoratePageStateManager: function(pageStateManger) { return pageStateManger; },
		createView: function(view) { return view; }
	};
	var pageRender = oc.create('Core.Interface.PageRender');
	var pageStateManager = oc.create('Core.Interface.PageStateManager');
	var windowInterface = oc.create('Core.Interface.Window');
	var eventBusInterface = oc.create('Core.Interface.EventBus');
	var pageManager = null;

	var Controller = ns.Core.Interface.Controller;
	var Extension = ns.Core.Interface.Extension;
	var View = function() {};

	var controllerInstance = pageFactory.createController(Controller);
	var decoratedController = pageFactory.decorateController(controllerInstance);
	var viewInstance = pageFactory.createView(View);
	var extensionInstance = new Extension();

	var options = {
		onlyUpdate: false,
		autoScroll: true
	};
	var params = {
		param1: 'param1',
		param2: 2
	};
	var data = {
		content: ''
	};
	var event = {
		detail: {
			eventName: 'method',
			data: data
		}
	};

	beforeEach(function() {
		pageManager =
			oc.create('Core.Page.Manager.Client',
				[
					pageFactory,
					pageRender,
					pageStateManager,
					windowInterface,
					eventBusInterface
				]
			);

		pageManager._clearManagedPageValue();

		pageManager._storeManagedPageValue(Controller, View, options, params, controllerInstance, decoratedController, viewInstance);


		spyOn(controllerInstance, 'getExtensions')
			.and
			.returnValue([extensionInstance]);
	});

	it('should be listen for all custom events', function() {
		spyOn(eventBusInterface, 'listenAll')
			.and
			.stub();

		pageManager.init();

		expect(eventBusInterface.listenAll).toHaveBeenCalled();
	});

	it('should return parsed custom event', function() {
		expect(pageManager._parseCustomEvent(event)).toEqual({ method: 'onMethod', eventName: 'method', data: data });
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

	describe('_onCustomEventHanler method', function() {
		var parsedCustomEvent = {
			method: 'onMethod',
			data: {},
			eventName: 'method'
		};

		beforeEach(function() {
			spyOn(pageManager, '_parseCustomEvent')
				.and
				.returnValue(parsedCustomEvent);

			spyOn(console, 'warn')
				.and
				.stub();
		});

		it('should do nothing if active controller is null', function() {
			pageManager._managedPage.controllerInstance = null;

			pageManager._onCustomEventHandler(event);

			expect(console.warn).not.toHaveBeenCalled();
		});

		it('should handle event only with controller', function() {
			spyOn(pageManager, '_handleEventWithController')
				.and
				.returnValue(true);

			spyOn(pageManager, '_handleEventWithExtensions')
				.and
				.stub();

			pageManager._onCustomEventHandler(event);

			expect(console.warn).not.toHaveBeenCalled();
			expect(pageManager._handleEventWithExtensions).not.toHaveBeenCalledWith(parsedCustomEvent.method, parsedCustomEvent.data);
			expect(pageManager._handleEventWithController).toHaveBeenCalledWith(parsedCustomEvent.method, parsedCustomEvent.data);
		});

		it('should handle event with some extension', function() {
			spyOn(pageManager, '_handleEventWithController')
				.and
				.returnValue(false);

			spyOn(pageManager, '_handleEventWithExtensions')
				.and
				.returnValue(true);

			pageManager._onCustomEventHandler(event);

			expect(console.warn).not.toHaveBeenCalled();
			expect(pageManager._handleEventWithExtensions).toHaveBeenCalledWith(parsedCustomEvent.method, parsedCustomEvent.data);
			expect(pageManager._handleEventWithController).toHaveBeenCalledWith(parsedCustomEvent.method, parsedCustomEvent.data);
		});

		it('should throw error because active controller and their extensions haven\'t defined event listener', function() {
			pageManager._onCustomEventHandler(event);

			expect(console.warn).toHaveBeenCalled();
		});

		it('should do nothing if active controller is null', function() {
			pageManager._managedPage.controllerInstance = null;

			pageManager._onCustomEventHandler(event);

			expect(console.warn).not.toHaveBeenCalled();
		});

	});

	describe('manage method', function() {

		it('should activate page source after loading all resources', function(done) {
			spyOn(pageManager, '_activatePageSource')
				.and
				.stub();
			spyOn(pageManager.__proto__.__proto__, 'manage')
				.and
				.returnValue(Promise.resolve({}));

			pageManager
				.manage(null, null, {}, {})
				.then(function() {
					expect(pageManager._activatePageSource).toHaveBeenCalled();
					done();
				})
				.catch(function(error) {
					console.error('Core.Page.Manager.Client: CATCH ERROR: ', error);
				});
		});
	});

	describe('_handleEventWithController method', function() {

		it('should return false for undefined method on controller', function() {
			expect(pageManager._handleEventWithController('onMethod', {})).toEqual(false);
		});

		it('should call method on controller and return true', function() {
			pageManager._managedPage.controllerInstance = {
				onMethod: function() {}
			};

			spyOn(pageManager._managedPage.controllerInstance, 'onMethod')
				.and
				.stub();

			expect(pageManager._handleEventWithController('onMethod', data)).toEqual(true);
			expect(pageManager._managedPage.controllerInstance.onMethod).toHaveBeenCalledWith(data);
		});
	});

	describe('_handleEventWithExtensions method', function() {

		it('should return false for undefined method on extensions', function() {
			expect(pageManager._handleEventWithExtensions('onMethod', {})).toEqual(false);
		});

		it('should call method on someone extension and return true', function() {
			var dumpExtensionInstance = {
				'onMethod': function() {}
			};
			pageManager._managedPage.controllerInstance = {
				getExtensions: function() {
					return [dumpExtensionInstance];
				}
			};

			spyOn(dumpExtensionInstance, 'onMethod')
				.and
				.stub();

			expect(pageManager._handleEventWithExtensions('onMethod', data)).toEqual(true);
			expect(dumpExtensionInstance.onMethod).toHaveBeenCalledWith(data);
		});
	});

});
