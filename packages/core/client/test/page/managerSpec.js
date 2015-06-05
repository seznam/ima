describe('Core.Page.Manager', function() {

	var pageFactory = oc.create('Core.Page.Factory', [oc]);
	var pageRender = oc.create('Core.Interface.PageRender');
	var stateManager = oc.create('Core.Interface.PageStateManager');
	var windowInterface = oc.create('Core.Interface.Window');
	var eventBusInterface = oc.create('Core.Interface.EventBus');
	var pageManager = null;

	describe('method _onCustomEventHanler', function() {
		var data = {
			content: ''
		};

		var event = {
			detail: {
				eventName: 'event',
				data: data
			}		
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
		it('should call method (with event name) from active controller', function() {
			pageManager._lastManagePage.controllerInstance = {
				onEvent: function(data) {}
			};
			spyOn(pageManager._lastManagePage.controllerInstance, 'onEvent');

			pageManager._onCustomEventHandler(event);

			expect(pageManager._lastManagePage.controllerInstance.onEvent.calls.count()).toEqual(1);
			expect(pageManager._lastManagePage.controllerInstance.onEvent).toHaveBeenCalledWith(data);
		});

		it('should throw error because active controller hasn\'t event listener' , function() {
			pageManager._lastManagePage.controllerInstance = {
				onDifferentEvent: function(data) {}
			};
			spyOn(pageManager._lastManagePage.controllerInstance, 'onDifferentEvent');
			spyOn(console, 'warn');

			pageManager._onCustomEventHandler(event);

			expect(pageManager._lastManagePage.controllerInstance.onDifferentEvent.calls.count()).toEqual(0);
			expect(console.warn).toHaveBeenCalled();
		});

		it('should do nothing if active controller is null' , function() {
			pageManager._lastManagePage.controllerInstance = null;
			spyOn(console, 'warn');

			pageManager._onCustomEventHandler(event);

			expect(console.warn).not.toHaveBeenCalled();
		});

	});
});