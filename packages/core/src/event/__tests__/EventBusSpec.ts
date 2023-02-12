/* eslint-disable @typescript-eslint/ban-ts-comment */

import { toMockedInstance } from 'to-mock';

import { ClientWindow } from '../../window/ClientWindow';
import { EventBusImpl, IMA_EVENT } from '../EventBusImpl';

describe('ima.core.event.EventBusImpl', () => {
  const listeners = {
    listener1: () => {
      return;
    },
    listener2: () => {
      return;
    },
  };

  const eventSource = {
    dispatchEvent: () => {
      return;
    },
  };
  const notEventSource = {};
  const eventTarget = {};
  const event = 'event';
  //let IMA_EVENT = '$IMA.CustomEvent';
  const data = {
    data: 'data',
  };

  let windowInterface: ClientWindow;
  let eventBus: EventBusImpl;

  beforeEach(() => {
    windowInterface = toMockedInstance(ClientWindow);
    eventBus = new EventBusImpl(windowInterface);
  });

  describe('listen method', () => {
    it('should bind listener for specific event', () => {
      jest
        .spyOn(windowInterface, 'bindEventListener')
        .mockImplementation(() => {
          return;
        });

      eventBus.listen(eventTarget as EventTarget, event, listeners.listener1);
      eventBus.listen(eventTarget as EventTarget, event, listeners.listener2);

      expect(windowInterface.bindEventListener).toHaveBeenCalledTimes(2);
      // @ts-ignore
      expect(windowInterface.bindEventListener.mock.calls[0][0]).toStrictEqual(
        eventTarget
      );
      // @ts-ignore
      expect(windowInterface.bindEventListener.mock.calls[0][1]).toBe(
        IMA_EVENT
      );
      // @ts-ignore
      expect(windowInterface.bindEventListener.mock.calls[1][0]).toStrictEqual(
        eventTarget
      );
      // @ts-ignore
      expect(windowInterface.bindEventListener.mock.calls[1][1]).toBe(
        IMA_EVENT
      );
    });
  });

  describe('listenAll method', () => {
    it('should bind listener for any event', () => {
      jest
        .spyOn(windowInterface, 'bindEventListener')
        .mockImplementation(() => {
          return;
        });

      eventBus.listenAll(eventTarget as EventTarget, listeners.listener1);
      eventBus.listenAll(eventTarget as EventTarget, listeners.listener2);

      expect(windowInterface.bindEventListener).toHaveBeenCalledTimes(2);
      // @ts-ignore
      expect(windowInterface.bindEventListener.mock.calls[0][0]).toStrictEqual(
        eventTarget
      );
      // @ts-ignore
      expect(windowInterface.bindEventListener.mock.calls[0][1]).toBe(
        IMA_EVENT
      );
      // @ts-ignore
      expect(windowInterface.bindEventListener.mock.calls[1][0]).toStrictEqual(
        eventTarget
      );
      // @ts-ignore
      expect(windowInterface.bindEventListener.mock.calls[1][1]).toBe(
        IMA_EVENT
      );
    });
  });

  describe('fire method', () => {
    it('should fire event for listeners', () => {
      jest.spyOn(eventSource, 'dispatchEvent').mockImplementation(() => {
        return;
      });
      jest
        .spyOn(windowInterface, 'createCustomEvent')
        .mockImplementation((name: string, options) => {
          return options as unknown as CustomEvent;
        });

      const event = 'event1';
      const data = { data: '' };

      eventBus.fire(eventSource as unknown as EventTarget, event, data);

      expect(eventSource.dispatchEvent).toHaveBeenCalledTimes(1);

      // @ts-ignore
      expect(eventSource.dispatchEvent.mock.calls[0][0].detail.eventName).toBe(
        event
      );
      expect(
        // @ts-ignore
        eventSource.dispatchEvent.mock.calls[0][0].detail.data
      ).toStrictEqual(data);
      // @ts-ignore
      expect(eventSource.dispatchEvent.mock.calls[0][0].bubbles).toBeTruthy();
      expect(
        // @ts-ignore
        eventSource.dispatchEvent.mock.calls[0][0].cancelable
      ).toBeTruthy();
    });

    it('should throw error for incorrect eventSource', () => {
      expect(() => {
        eventBus.fire(notEventSource as EventTarget, event, data);
      }).toThrow();
    });
  });

  describe('unlisten method', () => {
    it('should unbind bound listeners', () => {
      jest
        .spyOn(windowInterface, 'unbindEventListener')
        .mockImplementation(() => {
          return;
        });

      eventBus.listen(eventTarget as EventTarget, event, listeners.listener1);
      eventBus.unlisten(eventTarget as EventTarget, event, listeners.listener1);

      // @ts-ignore
      expect(windowInterface.unbindEventListener.mock.calls).toHaveLength(1);
      expect(
        // @ts-ignore
        windowInterface.unbindEventListener.mock.calls[0][0]
      ).toStrictEqual(eventTarget);
      // @ts-ignore
      expect(windowInterface.unbindEventListener.mock.calls[0][1]).toBe(
        IMA_EVENT
      );
    });
  });

  describe('unlistenAll method', () => {
    it('should unbind bound listeners', () => {
      jest
        .spyOn(windowInterface, 'unbindEventListener')
        .mockImplementation(() => {
          return;
        });

      eventBus.listenAll(eventTarget as EventTarget, listeners.listener1);
      eventBus.unlistenAll(eventTarget as EventTarget, listeners.listener1);

      // @ts-ignore
      expect(windowInterface.unbindEventListener.mock.calls).toHaveLength(1);
      expect(
        // @ts-ignore
        windowInterface.unbindEventListener.mock.calls[0][0]
      ).toStrictEqual(eventTarget);
      // @ts-ignore
      expect(windowInterface.unbindEventListener.mock.calls[0][1]).toBe(
        IMA_EVENT
      );
    });
  });
});
