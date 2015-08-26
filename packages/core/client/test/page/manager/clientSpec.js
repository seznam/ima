describe('Core.Page.Manager.Client', function() {
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
			oc.create('Core.Page.Manager.Client',
				[
					pageFactory,
					pageRender,
					stateManager,
					windowInterface,
					eventBusInterface
				]
			);

		pageManager._clearManagedPage();
	});

	it('should be listen for all custom events', function() {
		spyOn(eventBusInterface, 'listenAll')
			.and
			.stub();

		pageManager.init();

		expect(eventBusInterface.listenAll).toHaveBeenCalled();
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
			pageManager._managedPage.controllerInstance = {
				onEvent: function(data) {}
			};
			spyOn(pageManager._managedPage.controllerInstance, 'onEvent');

			pageManager._onCustomEventHandler(event);

			expect(pageManager._managedPage.controllerInstance.onEvent.calls.count()).toEqual(1);
			expect(pageManager._managedPage.controllerInstance.onEvent).toHaveBeenCalledWith(data);
		});

		it('should throw error because active controller hasn\'t event listener' , function() {
			pageManager._managedPage.controllerInstance = {
				onDifferentEvent: function(data) {}
			};
			spyOn(pageManager._managedPage.controllerInstance, 'onDifferentEvent');
			spyOn(console, 'warn');

			pageManager._onCustomEventHandler(event);

			expect(pageManager._managedPage.controllerInstance.onDifferentEvent.calls.count()).toEqual(0);
			expect(console.warn).toHaveBeenCalled();
		});

		it('should do nothing if active controller is null' , function() {
			pageManager._managedPage.controllerInstance = null;
			spyOn(console, 'warn');

			pageManager._onCustomEventHandler(event);

			expect(console.warn).not.toHaveBeenCalled();
		});

	});

});