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
				eventName: 'onEvent',
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
			pageManager._activeController = {
				onEvent: function(data) {}
			};
			spyOn(pageManager._activeController, 'onEvent');

			pageManager._onCustomEventHandler(event);

			expect(pageManager._activeController.onEvent.calls.count()).toEqual(1);

			expect(pageManager._activeController.onEvent).toHaveBeenCalledWith(data);
		});

		it('should throw error because active controller hasn\'t event listener' , function() {
			pageManager._activeController = {
				onDifferentEvent: function(data) {}
			};
			spyOn(pageManager._activeController, 'onDifferentEvent');
			spyOn(console, 'warn');

			pageManager._onCustomEventHandler(event);

			expect(pageManager._activeController.onDifferentEvent.calls.count()).toEqual(0);

			expect(console.warn).toHaveBeenCalled();
		});

		it('should do nothing if active controller is null' , function() {
			pageManager._activeController = null;
			spyOn(console, 'warn');

			pageManager._onCustomEventHandler(event);
			expect(console.warn).not.toHaveBeenCalled();
		});

	});
});