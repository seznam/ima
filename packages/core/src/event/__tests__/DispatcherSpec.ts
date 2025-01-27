/* eslint-disable @typescript-eslint/ban-ts-comment */

import { DispatcherImpl } from '../DispatcherImpl';

describe('ima.core.event.DispatcherImpl', () => {
  const handlers = {
    handler1: () => {
      return;
    },
    handler2: () => {
      return;
    },
  };

  const event = 'event';
  const data = {
    data: 'data',
  };

  let dispatcher: DispatcherImpl;
  beforeEach(() => {
    dispatcher = new DispatcherImpl();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('listen method', () => {
    it('should add handler for event', () => {
      dispatcher.listen(event, handlers.handler1);
      dispatcher.listen(event, handlers.handler2);

      expect(dispatcher['_eventListeners'].get(event)!.size).toBe(2);
      expect(
        dispatcher['_eventListeners'].get(event)!.get(handlers.handler1)!.size
      ).toBe(1);
      expect(
        dispatcher['_eventListeners'].get(event)!.get(handlers.handler2)!.size
      ).toBe(1);
    });

    it('should add handler with their scope for event', () => {
      dispatcher.listen(event, handlers.handler1, handlers);
      dispatcher.listen(event, handlers.handler2, handlers);
      expect(dispatcher['_eventListeners'].get(event)!.size).toBe(2);
      expect(
        dispatcher['_eventListeners'].get(event)!.get(handlers.handler1)!.size
      ).toBe(1);
      expect(
        dispatcher['_eventListeners'].get(event)!.get(handlers.handler2)!.size
      ).toBe(1);
    });

    it('should throw error if handler isnt function', () => {
      expect(() => {
        // @ts-ignore
        dispatcher.listen(event, 'string');
      }).toThrow();
      expect(() => {
        // @ts-ignore
        dispatcher.listen(event, 1);
      }).toThrow();
      expect(() => {
        // @ts-ignore
        dispatcher.listen(event, {});
      }).toThrow();
    });
  });

  describe('unlisten method', () => {
    beforeEach(() => {
      dispatcher.clear();
    });

    it('should remove handler for event', () => {
      dispatcher.listen(event, handlers.handler1);
      dispatcher.listen(event, handlers.handler2);

      dispatcher.unlisten(event, handlers.handler1);

      expect(dispatcher['_eventListeners'].get(event)!.size).toBe(1);
    });

    it('should remove handler with their scope for event', () => {
      dispatcher.listen(event, handlers.handler1, handlers);
      dispatcher.listen(event, handlers.handler2, handlers);

      dispatcher.unlisten(event, handlers.handler1, handlers);

      expect(dispatcher['_eventListeners'].get(event)!.size).toBe(1);
    });

    it('should remove handler with their scope for event, if scope is not changing', () => {
      dispatcher.listen(event, handlers.handler1, handlers);
      dispatcher.unlisten(event, handlers.handler1, handlers);

      expect(dispatcher['_eventListeners'].get(event)).toBeUndefined();
    });

    it('should remove handler with their scope for event, if scope is changing', () => {
      dispatcher.listen(event, handlers.handler1, handlers);

      // @ts-ignore
      handlers.handler3 = () => {
        return;
      };

      dispatcher.unlisten(event, handlers.handler1, handlers);

      expect(dispatcher['_eventListeners'].get(event)).toBeUndefined();
    });

    it('should show warning for undefined event', () => {
      jest.spyOn(console, 'warn').mockImplementation();

      dispatcher.unlisten(event, handlers.handler1);

      expect(console.warn).toHaveBeenCalled();
    });

    it('should show warning for undefined handler for event', () => {
      jest.spyOn(console, 'warn').mockImplementation();

      dispatcher.listen(event, handlers.handler1);
      dispatcher.unlisten(event, handlers.handler2);

      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe('fire method', () => {
    it('should fire event for handlers', () => {
      const handler1Spy = jest.spyOn(handlers, 'handler1');
      const handler2Spy = jest.spyOn(handlers, 'handler2');

      //Instance of mocked Jest function !== Function, wrapper is needed =>  https://github.com/facebook/jest/issues/6329
      const handler1SpyWrapper = (...args: unknown[]) => {
        // @ts-ignore
        return handler1Spy(...args);
      };
      const handler2SpyWrapper = (...args: unknown[]) => {
        // @ts-ignore
        return handler2Spy(...args);
      };

      dispatcher.listen(event, handler1SpyWrapper);
      dispatcher.listen(event, handler2SpyWrapper);

      dispatcher.fire(event, data);

      expect(handler1Spy).toHaveBeenCalledWith(data);
      expect(handler2Spy).toHaveBeenCalledWith(data);
    });

    it('should fire event for all handlers', () => {
      const handler1Spy = jest.spyOn(handlers, 'handler1');
      const handler2Spy = jest.spyOn(handlers, 'handler2');

      //Instance of mocked Jest function !== Function, wrapper is needed =>  https://github.com/facebook/jest/issues/6329
      const handler1SpyWrapper = (...args: unknown[]) => {
        // @ts-ignore
        return handler1Spy(...args);
      };
      const handler2SpyWrapper = (...args: unknown[]) => {
        // @ts-ignore
        return handler2Spy(...args);
      };

      dispatcher.listenAll(handler1SpyWrapper);
      dispatcher.listenAll(handler2SpyWrapper);

      dispatcher.fire(event, data);

      expect(handler1Spy).toHaveBeenCalledWith(event, data);
      expect(handler2Spy).toHaveBeenCalledWith(event, data);
    });
  });

  describe('clear method', () => {
    it('should clear dispatcher', () => {
      jest.restoreAllMocks();
      dispatcher.listen(event, handlers.handler1, handlers);
      dispatcher.listen(event, handlers.handler2, handlers);

      dispatcher.clear();

      expect(dispatcher['_eventListeners'].size).toBe(0);
    });
  });

  describe('listenAll method', () => {
    it('should add handler', () => {
      dispatcher.listenAll(handlers.handler1);
      dispatcher.listenAll(handlers.handler2);

      expect(dispatcher['_eventListenersAll'].size).toBe(2);
      expect(
        dispatcher['_eventListenersAll'].get(handlers.handler1)!.size
      ).toBe(1);
      expect(
        dispatcher['_eventListenersAll'].get(handlers.handler2)!.size
      ).toBe(1);
    });

    it('should add handler with their scope', () => {
      dispatcher.listenAll(handlers.handler1, handlers);
      dispatcher.listenAll(handlers.handler2, handlers);
      expect(dispatcher['_eventListenersAll'].size).toBe(2);
      expect(
        dispatcher['_eventListenersAll'].get(handlers.handler1)!.size
      ).toBe(1);
      expect(
        dispatcher['_eventListenersAll'].get(handlers.handler2)!.size
      ).toBe(1);
    });

    it('should throw error if handler isnt function', () => {
      expect(() => {
        // @ts-ignore
        dispatcher.listenAll('string');
      }).toThrow();
      expect(() => {
        // @ts-ignore
        dispatcher.listenAll(1);
      }).toThrow();
      expect(() => {
        // @ts-ignore
        dispatcher.listenAll({});
      }).toThrow();
    });
  });

  describe('unlistenAll method', () => {
    beforeEach(() => {
      dispatcher.clear();
    });

    it('should remove handler for event', () => {
      dispatcher.listenAll(handlers.handler1);
      dispatcher.listenAll(handlers.handler2);

      dispatcher.unlistenAll(handlers.handler1);

      expect(dispatcher['_eventListenersAll'].size).toBe(1);
    });

    it('should remove handler with their scope', () => {
      dispatcher.listenAll(handlers.handler1, handlers);
      dispatcher.listenAll(handlers.handler2, handlers);

      dispatcher.unlistenAll(handlers.handler1, handlers);

      expect(dispatcher['_eventListenersAll'].size).toBe(1);
    });

    it('should remove handler with their scope, if scope is not changing', () => {
      dispatcher.listenAll(handlers.handler1, handlers);
      dispatcher.unlistenAll(handlers.handler1, handlers);

      expect(dispatcher['_eventListenersAll'].size).toBe(0);
    });

    it('should remove handler with their scope, if scope is changing', () => {
      dispatcher.listenAll(handlers.handler1, handlers);

      // @ts-ignore
      handlers.handler3 = () => {
        return;
      };

      dispatcher.unlistenAll(handlers.handler1, handlers);

      expect(dispatcher['_eventListenersAll'].size).toBe(0);
    });

    it('should show warning for undefined listener', () => {
      jest.spyOn(console, 'warn').mockImplementation();

      dispatcher.listen(event, handlers.handler1);
      dispatcher.unlisten(event, handlers.handler2);

      expect(console.warn).toHaveBeenCalled();
    });
  });
});
