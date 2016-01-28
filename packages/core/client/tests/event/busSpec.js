describe('Core.Event.Bus', function () {

	var listeners = {
		listener1: function () {},
		listener2: function () {}
	};

	var eventSource = {
		dispatchEvent: function (e) {}
	};
	var notEventSource = {
	};
	var eventTarget = {};
	var event = 'event';
	var IMA_EVENT = '$IMA.CustomEvent';
	var data = {
		data: 'data'
	};
	
	var windowInterface = null;
	var eventBus = null;
	beforeEach(function () {
		windowInterface = oc.create('Core.Interface.Window');
		eventBus = oc.create('Core.Event.Bus', [ windowInterface ]);
	});

	describe('listen method', function () {
		it('should bind listener for specific event', function () {
			spyOn(windowInterface, 'bindEventListener');

			eventBus.listen(eventTarget, event, listeners.listener1);
			eventBus.listen(eventTarget, event, listeners.listener2);
			
			expect(windowInterface.bindEventListener.calls.count()).toEqual(2);
			expect(windowInterface.bindEventListener.calls.argsFor(0)[0]).toEqual(eventTarget);
			expect(windowInterface.bindEventListener.calls.argsFor(0)[1]).toEqual(IMA_EVENT);
			expect(windowInterface.bindEventListener.calls.argsFor(1)[0]).toEqual(eventTarget);
			expect(windowInterface.bindEventListener.calls.argsFor(1)[1]).toEqual(IMA_EVENT);
		});
	});

	describe('listenAll method', function () {
		it('should bind listener for any event', function () {
			spyOn(windowInterface, 'bindEventListener');

			eventBus.listenAll(eventTarget, listeners.listener1);
			eventBus.listenAll(eventTarget, listeners.listener2);

			expect(windowInterface.bindEventListener.calls.count()).toEqual(2);
			expect(windowInterface.bindEventListener.calls.argsFor(0)).toEqual([eventTarget, IMA_EVENT, listeners.listener1]);
			expect(windowInterface.bindEventListener.calls.argsFor(1)).toEqual([eventTarget, IMA_EVENT, listeners.listener2]);
		});
	});

	
	describe('fire method', function () {

		it('should fire event for listeners', function () {
			spyOn(eventSource, 'dispatchEvent');

			var event = 'event1';

			var data = { data: ''};

			eventBus.fire(eventSource, event, data);

			expect(eventSource.dispatchEvent.calls.count()).toEqual(1);

			expect(eventSource.dispatchEvent.calls.argsFor(0)[0].detail.eventName).toEqual(event);
			expect(eventSource.dispatchEvent.calls.argsFor(0)[0].detail.data).toEqual(data);
			expect(eventSource.dispatchEvent.calls.argsFor(0)[0].bubbles).toEqual(true);
			expect(eventSource.dispatchEvent.calls.argsFor(0)[0].cancelable).toEqual(true);
		});

		it('should throw error for incorrect eventSource', function () {
			expect(function () {
				eventBus.fire(notEventSource, event, data);
			}).toThrow();
		});
	});

	describe('unlisten method', function () {
		it('should unbind bound listeners', function () {
			spyOn(windowInterface, 'unbindEventListener');

			eventBus.listen(eventTarget, event, listeners.listener1);
			eventBus.unlisten(eventTarget, event, listeners.listener1);

			expect(windowInterface.unbindEventListener.calls.count()).toEqual(1);
			expect(windowInterface.unbindEventListener.calls.argsFor(0)[0]).toEqual(eventTarget);
			expect(windowInterface.unbindEventListener.calls.argsFor(0)[1]).toEqual(IMA_EVENT);
		});
	});

	describe('unlistenAll method', function () {
		it('should unbind bound listeners', function () {
			spyOn(windowInterface, 'unbindEventListener');

			eventBus.listenAll(eventTarget, listeners.listener1);
			eventBus.unlistenAll(eventTarget, listeners.listener1);

			expect(windowInterface.unbindEventListener.calls.count()).toEqual(1);
			expect(windowInterface.unbindEventListener.calls.argsFor(0)).toEqual([eventTarget, IMA_EVENT, listeners.listener1]);
		});
	});

});
