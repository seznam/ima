import PageHandler from 'page/handler/PageHandler';
import PageHandlerRegistry from 'page/handler/PageHandlerRegistry';
import SerialBatch from 'execution/SerialBatch';
import { toMockedInstance } from 'to-mock';

describe('ima.page.handler.PageHandlerRegistry', () => {
  let registry;
  let pageManagerHandler = toMockedInstance(PageHandler);

  beforeEach(() => {
    spyOn(pageManagerHandler, 'handlePreManagedState');
    spyOn(pageManagerHandler, 'handlePostManagedState');
    registry = new PageHandlerRegistry(pageManagerHandler);
    registry.init();
  });

  afterEach(() => {
    registry.destroy();
  });

  describe('constructor', () => {
    it('should construct SerialBatch for pre-handlers and post-handlers', () => {
      expect(registry._preManageHandlers).toBeInstanceOf(SerialBatch);
      expect(registry._postManageHandlers).toBeInstanceOf(SerialBatch);
    });
  });

  describe('handlePreManagedState() method', () => {
    it('should call subsequent pre-manage handlers', () => {
      return registry.handlePreManagedState(null, null, null).then(() => {
        expect(pageManagerHandler.handlePreManagedState).toHaveBeenCalled();
      });
    });
  });

  describe('handlePostManagedState() method', () => {
    it('should call subsequent post-manage handlers', () => {
      return registry.handlePostManagedState(null, null, null).then(() => {
        expect(pageManagerHandler.handlePostManagedState).toHaveBeenCalled();
      });
    });
  });
});
