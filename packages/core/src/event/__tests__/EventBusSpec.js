import toMock from 'to-mock';
import EventBus, { IMA_EVENT } from '../EventBusImpl';
import Window from 'src/window/Window';

describe('ima.core.event.EventBusImpl', () => {
  let listeners = {
    listener1: () => {},
    listener2: () => {},
  };

  let eventSource = {
    dispatchEvent: () => {},
  };
  let notEventSource = {};
  let eventTarget = {};
  let event = 'event';
  //let IMA_EVENT = '$IMA.CustomEvent';
  let data = {
    data: 'data',
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
      jest
        .spyOn(windowInterface, 'bindEventListener')
        .mockImplementation(() => {});

      eventBus.listen(eventTarget, event, listeners.listener1);
      eventBus.listen(eventTarget, event, listeners.listener2);

      expect(windowInterface.bindEventListener.mock.calls).toHaveLength(2);
      expect(windowInterface.bindEventListener.mock.calls[0][0]).toStrictEqual(
        eventTarget
      );
      expect(windowInterface.bindEventListener.mock.calls[0][1]).toBe(
        IMA_EVENT
      );
      expect(windowInterface.bindEventListener.mock.calls[1][0]).toStrictEqual(
        eventTarget
      );
      expect(windowInterface.bindEventListener.mock.calls[1][1]).toBe(
        IMA_EVENT
      );
    });
  });

  describe('listenAll method', () => {
    it('should bind listener for any event', () => {
      jest
        .spyOn(windowInterface, 'bindEventListener')
        .mockImplementation(() => {});

      eventBus.listenAll(eventTarget, listeners.listener1);
      eventBus.listenAll(eventTarget, listeners.listener2);

      expect(windowInterface.bindEventListener.mock.calls).toHaveLength(2);
      expect(windowInterface.bindEventListener.mock.calls[0][0]).toStrictEqual(
        eventTarget
      );
      expect(windowInterface.bindEventListener.mock.calls[0][1]).toBe(
        IMA_EVENT
      );
      expect(windowInterface.bindEventListener.mock.calls[1][0]).toStrictEqual(
        eventTarget
      );
      expect(windowInterface.bindEventListener.mock.calls[1][1]).toBe(
        IMA_EVENT
      );
    });
  });

  describe('fire method', () => {
    it('should fire event for listeners', () => {
      jest.spyOn(eventSource, 'dispatchEvent').mockImplementation(() => {});
      jest
        .spyOn(windowInterface, 'createCustomEvent')
        .mockImplementation((IMA_EVENT, options) => {
          return options;
        });

      let event = 'event1';
      let data = { data: '' };

      eventBus.fire(eventSource, event, data);

      expect(eventSource.dispatchEvent.mock.calls).toHaveLength(1);

      expect(eventSource.dispatchEvent.mock.calls[0][0].detail.eventName).toBe(
        event
      );
      expect(
        eventSource.dispatchEvent.mock.calls[0][0].detail.data
      ).toStrictEqual(data);
      expect(eventSource.dispatchEvent.mock.calls[0][0].bubbles).toBeTruthy();
      expect(
        eventSource.dispatchEvent.mock.calls[0][0].cancelable
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
      jest
        .spyOn(windowInterface, 'unbindEventListener')
        .mockImplementation(() => {});

      eventBus.listen(eventTarget, event, listeners.listener1);
      eventBus.unlisten(eventTarget, event, listeners.listener1);

      expect(windowInterface.unbindEventListener.mock.calls).toHaveLength(1);
      expect(
        windowInterface.unbindEventListener.mock.calls[0][0]
      ).toStrictEqual(eventTarget);
      expect(windowInterface.unbindEventListener.mock.calls[0][1]).toBe(
        IMA_EVENT
      );
    });
  });

  describe('unlistenAll method', () => {
    it('should unbind bound listeners', () => {
      jest
        .spyOn(windowInterface, 'unbindEventListener')
        .mockImplementation(() => {});

      eventBus.listenAll(eventTarget, listeners.listener1);
      eventBus.unlistenAll(eventTarget, listeners.listener1);

      expect(windowInterface.unbindEventListener.mock.calls).toHaveLength(1);
      expect(
        windowInterface.unbindEventListener.mock.calls[0][0]
      ).toStrictEqual(eventTarget);
      expect(windowInterface.unbindEventListener.mock.calls[0][1]).toBe(
        IMA_EVENT
      );
    });
  });
});
