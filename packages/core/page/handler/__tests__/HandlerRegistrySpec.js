import HandlerRegistry from 'page/handler/HandlerRegistry';
import SerialBatch from 'execution/SerialBatch';

jest.useFakeTimers();

describe('ima.page.handler.HandlerRegistry', () => {
  let registry;
  let pageManagerHandler = {
    handlePreManagedState: jest.fn(() => true),
    handlePostManagedState: jest.fn(() => true)
  };

  beforeEach(() => {
    registry = new HandlerRegistry(pageManagerHandler);
  });

  describe('constructor', () => {
    it('should construct SerialBatch for pre-handlers and post-handlers', () => {
      expect(registry._preManageHandlers).toBeInstanceOf(SerialBatch);
      expect(registry._postManageHandlers).toBeInstanceOf(SerialBatch);
    });
  });

  describe('invokePreManageHandlers() method', () => {
    it('should call pre-manage handlers', () => {
      return registry.invokePreManageHandlers(null, null, null).then(() => {
        expect(pageManagerHandler.handlePreManagedState).toHaveBeenCalled();
      });
    });
  });

  describe('invokePostManageHandlers() method', () => {
    it('should call post-manage handlers', () => {
      return registry.invokePostManageHandlers(null, null, null).then(() => {
        expect(pageManagerHandler.handlePostManagedState).toHaveBeenCalled();
      });
    });
  });
});
