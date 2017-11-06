import toMock from 'to-mock';
import EventBus, { IMA_EVENT } from 'event/EventBusImpl';
import Window from 'window/Window';

describe('ima.event.EventBusImpl', () => {
	let listeners = {
		listener1: () => {},
		listener2: () => {}
	};

	let eventSource = {
		dispatchEvent: e => {}
	};
	let notEventSource = {};
	let eventTarget = {};
	let event = 'event';
	//let IMA_EVENT = '$IMA.CustomEvent';
	let data = {
		data: 'data'
	};

	let MockedWindow = toMock(Window);
	let windowInterface = null;
	let eventBus = null;

	beforeEach(() => {
		windowInterface = new MockedWindow();
		eventBus = new EventBus(windowInterface);
	});

	describe('listen method', () => {
		it('should bind listener for specific event', () => {
			spyOn(windowInterface, 'bindEventListener');

			eventBus.listen(eventTarget, event, listeners.listener1);
			eventBus.listen(eventTarget, event, listeners.listener2);

			expect(windowInterface.bindEventListener.calls.count()).toEqual(2);
			expect(
				windowInterface.bindEventListener.calls.argsFor(0)[0]
			).toEqual(eventTarget);
			expect(
				windowInterface.bindEventListener.calls.argsFor(0)[1]
			).toEqual(IMA_EVENT);
			expect(
				windowInterface.bindEventListener.calls.argsFor(1)[0]
			).toEqual(eventTarget);
			expect(
				windowInterface.bindEventListener.calls.argsFor(1)[1]
			).toEqual(IMA_EVENT);
		});
	});

	describe('listenAll method', () => {
		it('should bind listener for any event', () => {
			spyOn(windowInterface, 'bindEventListener');

			eventBus.listenAll(eventTarget, listeners.listener1);
			eventBus.listenAll(eventTarget, listeners.listener2);

			expect(windowInterface.bindEventListener.calls.count()).toEqual(2);
			expect(windowInterface.bindEventListener.calls.argsFor(0)).toEqual([
				eventTarget,
				IMA_EVENT,
				listeners.listener1
			]);
			expect(windowInterface.bindEventListener.calls.argsFor(1)).toEqual([
				eventTarget,
				IMA_EVENT,
				listeners.listener2
			]);
		});
	});

	describe('fire method', () => {
		it('should fire event for listeners', () => {
			spyOn(eventSource, 'dispatchEvent');
			spyOn(
				windowInterface,
				'createCustomEvent'
			).and.callFake((IMA_EVENT, options) => {
				return options;
			});

			let event = 'event1';
			let data = { data: '' };

			eventBus.fire(eventSource, event, data);

			expect(eventSource.dispatchEvent.calls.count()).toEqual(1);

			expect(
				eventSource.dispatchEvent.calls.argsFor(0)[0].detail.eventName
			).toEqual(event);
			expect(
				eventSource.dispatchEvent.calls.argsFor(0)[0].detail.data
			).toEqual(data);
			expect(
				eventSource.dispatchEvent.calls.argsFor(0)[0].bubbles
			).toEqual(true);
			expect(
				eventSource.dispatchEvent.calls.argsFor(0)[0].cancelable
			).toEqual(true);
		});

		it('should throw error for incorrect eventSource', () => {
			expect(() => {
				eventBus.fire(notEventSource, event, data);
			}).toThrow();
		});
	});

	describe('unlisten method', () => {
		it('should unbind bound listeners', () => {
			spyOn(windowInterface, 'unbindEventListener');

			eventBus.listen(eventTarget, event, listeners.listener1);
			eventBus.unlisten(eventTarget, event, listeners.listener1);

			expect(windowInterface.unbindEventListener.calls.count()).toEqual(
				1
			);
			expect(
				windowInterface.unbindEventListener.calls.argsFor(0)[0]
			).toEqual(eventTarget);
			expect(
				windowInterface.unbindEventListener.calls.argsFor(0)[1]
			).toEqual(IMA_EVENT);
		});
	});

	describe('unlistenAll method', () => {
		it('should unbind bound listeners', () => {
			spyOn(windowInterface, 'unbindEventListener');

			eventBus.listenAll(eventTarget, listeners.listener1);
			eventBus.unlistenAll(eventTarget, listeners.listener1);

			expect(windowInterface.unbindEventListener.calls.count()).toEqual(
				1
			);
			expect(
				windowInterface.unbindEventListener.calls.argsFor(0)
			).toEqual([eventTarget, IMA_EVENT, listeners.listener1]);
		});
	});
});
