import PageHandler from '../PageHandler';
import PageHandlerRegistry from '../PageHandlerRegistry';
import SerialBatch from '../../../execution/SerialBatch';
import { toMockedInstance } from 'to-mock';
import ManagedPage from '../../../page/ManagedPage';
import PageAction from '../../../page/PageAction';

class TestPageHandler extends PageHandler {
  init(): void {
    
  }

  handlePostManagedState(managedPage: ManagedPage, previousManagedPage: ManagedPage, action: PageAction): void {
    
  }

  handlePreManagedState(managedPage: ManagedPage, nextManagedPage: ManagedPage, action: PageAction): void {
    
  }

  destroy(): void {
    
  }
}

describe('ima.core.page.handler.PageHandlerRegistry', () => {
  let registry: PageHandlerRegistry;
  let pageManagerHandler: PageHandler = toMockedInstance(TestPageHandler);

  beforeEach(() => {
    jest
      .spyOn(pageManagerHandler, 'handlePreManagedState')
      .mockImplementation(() => {});
    jest
      .spyOn(pageManagerHandler, 'handlePostManagedState')
      .mockImplementation(() => {});
    registry = new PageHandlerRegistry(pageManagerHandler);
    registry.init();
  });

  afterEach(() => {
    registry.destroy();
  });

  describe('constructor', () => {
    it('should construct SerialBatch for pre-handlers and post-handlers', () => {
      expect(registry['_preManageHandlers']).toBeInstanceOf(SerialBatch);
      expect(registry['_postManageHandlers']).toBeInstanceOf(SerialBatch);
    });
  });

  describe('handlePreManagedState() method', () => {
    it('should call subsequent pre-manage handlers', async () => {
      await registry.handlePreManagedState({} as ManagedPage, {} as ManagedPage, {} as PageAction).then(() => {
        expect(pageManagerHandler.handlePreManagedState).toHaveBeenCalled();
      });
    });
  });

  describe('handlePostManagedState() method', () => {
    it('should call subsequent post-manage handlers', async () => {
      await registry.handlePostManagedState({} as ManagedPage, {} as ManagedPage, {} as PageAction).then(() => {
        expect(pageManagerHandler.handlePostManagedState).toHaveBeenCalled();
      });
    });
  });
});
