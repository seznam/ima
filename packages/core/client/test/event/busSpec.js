describe('Core.Event.Bus', function() {

	var listeners = {
		listener1: function() {},
		listener2: function() {}
	};

	var eventSource = {
		dispatchEvent: function(e) {}
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
	beforeEach(function() {
		windowInterface = oc.create('Core.Interface.Window');
		eventBus = oc.create('Core.Event.Bus', [ windowInterface ]);
	});

	describe('listen method', function() {
		it('should bind listener for specific event', function() {
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

	describe('listenAll method', function() {
		it('should bind listener for any event', function() {
			spyOn(windowInterface, 'bindEventListener');

			eventBus.listenAll(eventTarget, listeners.listener1);
			eventBus.listenAll(eventTarget, listeners.listener2);

			expect(windowInterface.bindEventListener.calls.count()).toEqual(2);
			expect(windowInterface.bindEventListener.calls.argsFor(0)).toEqual([eventTarget, IMA_EVENT, listeners.listener1]);
			expect(windowInterface.bindEventListener.calls.argsFor(1)).toEqual([eventTarget, IMA_EVENT, listeners.listener2]);
		});
	});

	
	describe('fire method on client', function() {
		beforeEach(function() {
			spyOn(windowInterface, "isClient").and.callFake(function() {
		      return true;
		    });
		});
		it('should fire event for listeners on client', function() {
			spyOn(eventSource, 'dispatchEvent');

			var event1 = 'event1';
			var event2 = 'event2';
			var event3 = 'event3';

			var data1 = { data1: ''};
			var data2 = { data2: ''};
			var data3 = { data3: ''};

			eventBus.fire(eventSource, event1, data1);
			eventBus.fire(eventSource, event2, data2, {bubbles: false, cancelable: false})
					.fire(eventSource, event3, data3, {bubbles: true, cancelable: false});

			expect(eventSource.dispatchEvent.calls.count()).toEqual(3);

			expect(eventSource.dispatchEvent.calls.argsFor(0)[0].detail.eventName).toEqual(event1);
			expect(eventSource.dispatchEvent.calls.argsFor(0)[0].detail.data).toEqual(data1);
			expect(eventSource.dispatchEvent.calls.argsFor(0)[0].bubbles).toEqual(true);
			expect(eventSource.dispatchEvent.calls.argsFor(0)[0].cancelable).toEqual(true);

			expect(eventSource.dispatchEvent.calls.argsFor(1)[0].detail.eventName).toEqual(event2);
			expect(eventSource.dispatchEvent.calls.argsFor(1)[0].detail.data).toEqual(data2);
			expect(eventSource.dispatchEvent.calls.argsFor(1)[0].bubbles).toEqual(false);
			expect(eventSource.dispatchEvent.calls.argsFor(1)[0].cancelable).toEqual(false);

			expect(eventSource.dispatchEvent.calls.argsFor(2)[0].detail.eventName).toEqual(event3);
			expect(eventSource.dispatchEvent.calls.argsFor(2)[0].detail.data).toEqual(data3);
			expect(eventSource.dispatchEvent.calls.argsFor(2)[0].bubbles).toEqual(true);
			expect(eventSource.dispatchEvent.calls.argsFor(2)[0].cancelable).toEqual(false);
		});

		it('should throw error for incorrect eventSource', function() {
			expect(function() {
				eventBus.fire(notEventSource, event, data);
			}).toThrow();
		});
	});
	
	describe('fire method on server', function() {
		beforeEach(function() {
			spyOn(windowInterface, "isClient").and.callFake(function() {
		      return false;
		    });
		});
		it('should not fire event for listeners', function() {
			spyOn(eventSource, 'dispatchEvent');

			eventBus.fire(eventSource, event, data);
			eventBus.fire(eventSource, event, data, {bubbles: false, cancelable: false})
					.fire(eventSource, event, data, {bubbles: true, cancelable: false});

			expect(eventSource.dispatchEvent.calls.count()).toEqual(0);
		});
		it('should throw error for incorrect eventSource', function() {
			expect(function() {
				eventBus.fire(notEventSource, event, data);
			}).not.toThrow();
		});
	});

});