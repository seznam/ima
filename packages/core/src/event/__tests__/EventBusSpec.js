import toMock from 'to-mock';
import EventBus, { IMA_EVENT } from '../EventBusImpl';
import Window from 'src/window/Window';

describe('ima.core.event.EventBusImpl', () => {
  let listeners = {
    listener1: () => {},
    listener2: () => {}
  };

  let eventSource = {
    dispatchEvent: () => {}
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

      expect(windowInterface.bindEventListener.calls.count()).toBe(2);
      expect(
        windowInterface.bindEventListener.calls.argsFor(0)[0]
      ).toStrictEqual(eventTarget);
      expect(windowInterface.bindEventListener.calls.argsFor(0)[1]).toBe(
        IMA_EVENT
      );
      expect(
        windowInterface.bindEventListener.calls.argsFor(1)[0]
      ).toStrictEqual(eventTarget);
      expect(windowInterface.bindEventListener.calls.argsFor(1)[1]).toBe(
        IMA_EVENT
      );
    });
  });

  describe('listenAll method', () => {
    it('should bind listener for any event', () => {
      spyOn(windowInterface, 'bindEventListener');

      eventBus.listenAll(eventTarget, listeners.listener1);
      eventBus.listenAll(eventTarget, listeners.listener2);

      expect(windowInterface.bindEventListener.calls.count()).toBe(2);
      expect(
        windowInterface.bindEventListener.calls.argsFor(0)[0]
      ).toStrictEqual(eventTarget);
      expect(windowInterface.bindEventListener.calls.argsFor(0)[1]).toBe(
        IMA_EVENT
      );
      expect(
        windowInterface.bindEventListener.calls.argsFor(1)[0]
      ).toStrictEqual(eventTarget);
      expect(windowInterface.bindEventListener.calls.argsFor(1)[1]).toBe(
        IMA_EVENT
      );
    });
  });

  describe('fire method', () => {
    it('should fire event for listeners', () => {
      spyOn(eventSource, 'dispatchEvent');
      spyOn(windowInterface, 'createCustomEvent').and.callFake(
        (IMA_EVENT, options) => {
          return options;
        }
      );

      let event = 'event1';
      let data = { data: '' };

      eventBus.fire(eventSource, event, data);

      expect(eventSource.dispatchEvent.calls.count()).toBe(1);

      expect(
        eventSource.dispatchEvent.calls.argsFor(0)[0].detail.eventName
      ).toBe(event);
      expect(
        eventSource.dispatchEvent.calls.argsFor(0)[0].detail.data
      ).toStrictEqual(data);
      expect(
        eventSource.dispatchEvent.calls.argsFor(0)[0].bubbles
      ).toBeTruthy();
      expect(
        eventSource.dispatchEvent.calls.argsFor(0)[0].cancelable
      ).toBeTruthy();
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

      expect(windowInterface.unbindEventListener.calls.count()).toBe(1);
      expect(
        windowInterface.unbindEventListener.calls.argsFor(0)[0]
      ).toStrictEqual(eventTarget);
      expect(windowInterface.unbindEventListener.calls.argsFor(0)[1]).toBe(
        IMA_EVENT
      );
    });
  });

  describe('unlistenAll method', () => {
    it('should unbind bound listeners', () => {
      spyOn(windowInterface, 'unbindEventListener');

      eventBus.listenAll(eventTarget, listeners.listener1);
      eventBus.unlistenAll(eventTarget, listeners.listener1);

      expect(windowInterface.unbindEventListener.calls.count()).toBe(1);
      expect(
        windowInterface.unbindEventListener.calls.argsFor(0)[0]
      ).toStrictEqual(eventTarget);
      expect(windowInterface.unbindEventListener.calls.argsFor(0)[1]).toBe(
        IMA_EVENT
      );
    });
  });
});
