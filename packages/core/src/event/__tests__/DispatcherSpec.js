import Dispatcher from 'event/DispatcherImpl';

describe('ima.event.DispatcherImpl', () => {
  let handlers = {
    handler1: () => {},
    handler2: () => {}
  };

  let event = 'event';
  let data = {
    data: 'data'
  };

  let dispatcher = null;
  beforeEach(() => {
    dispatcher = new Dispatcher();
  });

  describe('listen method', () => {
    it('should add handler for event', () => {
      dispatcher.listen(event, handlers.handler1);
      dispatcher.listen(event, handlers.handler2);
      expect(dispatcher._eventListeners.get(event).size).toEqual(2);
      expect(
        dispatcher._eventListeners.get(event).get(handlers.handler1).size
      ).toEqual(1);
      expect(
        dispatcher._eventListeners.get(event).get(handlers.handler2).size
      ).toEqual(1);
    });

    it('should add handler with their scope for event', () => {
      dispatcher.listen(event, handlers.handler1, handlers);
      dispatcher.listen(event, handlers.handler2, handlers);
      expect(dispatcher._eventListeners.get(event).size).toEqual(2);
      expect(
        dispatcher._eventListeners.get(event).get(handlers.handler1).size
      ).toEqual(1);
      expect(
        dispatcher._eventListeners.get(event).get(handlers.handler2).size
      ).toEqual(1);
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

      expect(dispatcher._eventListeners.get(event).size).toEqual(1);
    });

    it('should remove handler with their scope for event', () => {
      dispatcher.listen(event, handlers.handler1, handlers);
      dispatcher.listen(event, handlers.handler2, handlers);

      dispatcher.unlisten(event, handlers.handler1, handlers);

      expect(dispatcher._eventListeners.get(event).size).toEqual(1);
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
      spyOn(console, 'warn').and.stub();

      dispatcher.unlisten(event, handlers.handler1);

      expect(console.warn).toHaveBeenCalled();
    });

    it('should show warning for undefined handler for event', () => {
      spyOn(console, 'warn').and.stub();

      dispatcher.listen(event, handlers.handler1);
      dispatcher.unlisten(event, handlers.handler2);

      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe('fire method', () => {
    it('should fire event for handlers', () => {
      spyOn(handlers, 'handler1');
      spyOn(handlers, 'handler2');

      dispatcher.listen(event, handlers.handler1);
      dispatcher.listen(event, handlers.handler2);

      dispatcher.fire(event, data);

      expect(handlers.handler1).toHaveBeenCalledWith(data);
      expect(handlers.handler2).toHaveBeenCalledWith(data);
    });

    it('should show warning for none listeners', () => {
      spyOn(console, 'warn').and.stub();

      dispatcher.fire(event, data);

      expect(console.warn).toHaveBeenCalled();
    });

    it('should not show warning for $IMA internal event', () => {
      spyOn(console, 'warn').and.stub();

      dispatcher.fire(event, data, true);

      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  describe('clear method', () => {
    it('should cleared dispatcher', () => {
      dispatcher.listen(event, handlers.handler1, handlers);
      dispatcher.listen(event, handlers.handler2, handlers);

      dispatcher.clear();

      expect(dispatcher._eventListeners.size).toEqual(0);
    });
  });
});
