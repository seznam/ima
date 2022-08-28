import Dispatcher from '../DispatcherImpl';

describe('ima.core.event.DispatcherImpl', () => {
  let handlers = {
    handler1: () => {},
    handler2: () => {},
  };

  let event = 'event';
  let data = {
    data: 'data',
  };

  let dispatcher = null;
  beforeEach(() => {
    dispatcher = new Dispatcher();
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
      expect(dispatcher._eventListeners.get(event).size).toBe(2);
      expect(
        dispatcher._eventListeners.get(event).get(handlers.handler1).size
      ).toBe(1);
      expect(
        dispatcher._eventListeners.get(event).get(handlers.handler2).size
      ).toBe(1);
    });

    it('should add handler with their scope for event', () => {
      dispatcher.listen(event, handlers.handler1, handlers);
      dispatcher.listen(event, handlers.handler2, handlers);
      expect(dispatcher._eventListeners.get(event).size).toBe(2);
      expect(
        dispatcher._eventListeners.get(event).get(handlers.handler1).size
      ).toBe(1);
      expect(
        dispatcher._eventListeners.get(event).get(handlers.handler2).size
      ).toBe(1);
    });

    it('should throw error if handler isnt function', () => {
      expect(() => {
        dispatcher.listen(event, 'string');
      }).toThrow();
      expect(() => {
        dispatcher.listen(event, 1);
      }).toThrow();
      expect(() => {
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

      expect(dispatcher._eventListeners.get(event).size).toBe(1);
    });

    it('should remove handler with their scope for event', () => {
      dispatcher.listen(event, handlers.handler1, handlers);
      dispatcher.listen(event, handlers.handler2, handlers);

      dispatcher.unlisten(event, handlers.handler1, handlers);

      expect(dispatcher._eventListeners.get(event).size).toBe(1);
    });

    it('should remove handler with their scope for event, if scope is not changing', () => {
      dispatcher.listen(event, handlers.handler1, handlers);
      dispatcher.unlisten(event, handlers.handler1, handlers);

      expect(dispatcher._eventListeners.get(event)).toBeUndefined();
    });

    it('should remove handler with their scope for event, if scope is changing', () => {
      dispatcher.listen(event, handlers.handler1, handlers);

      handlers.handler3 = () => {};

      dispatcher.unlisten(event, handlers.handler1, handlers);

      expect(dispatcher._eventListeners.get(event)).toBeUndefined();
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
      const handler1SpyWrapper = (...args) => {
        return handler1Spy(...args);
      };
      const handler2SpyWrapper = (...args) => {
        return handler2Spy(...args);
      };

      dispatcher.listen(event, handler1SpyWrapper);
      dispatcher.listen(event, handler2SpyWrapper);

      dispatcher.fire(event, data);

      expect(handler1Spy).toHaveBeenCalledWith(data);
      expect(handler2Spy).toHaveBeenCalledWith(data);
    });

    it('should show warning for none listeners', () => {
      jest.spyOn(console, 'warn').mockImplementation();

      dispatcher.fire(event, data);

      expect(console.warn).toHaveBeenCalled();
    });

    it('should not show warning for $IMA internal event', () => {
      jest.spyOn(console, 'warn').mockImplementation();

      dispatcher.fire(event, data, true);

      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  describe('clear method', () => {
    it('should clear dispatcher', () => {
      jest.restoreAllMocks();
      dispatcher.listen(event, handlers.handler1, handlers);
      dispatcher.listen(event, handlers.handler2, handlers);

      dispatcher.clear();

      expect(dispatcher._eventListeners.size).toBe(0);
    });
  });
});
