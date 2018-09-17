import PageHandler from './PageHandler';
import SerialBatch from '../../execution/SerialBatch';

export default class PageHandlerRegistry extends PageHandler {
  /**
   * Creates an instance of HandlerRegistry and creates {@code SerialBatch}
   * instance for pre-handlers and post-handlers.
   *
   * @param {...PageManagerHandler} handlers
   * @memberof HandlerRegistry
   */
  constructor(...handlers) {
    super();

    this._preManageHandlers = new PageHandlerRegistry.ExecutionMethod(
      handlers.map(handler => handler.handlePreManagedState.bind(handler))
    );

    this._postManageHandlers = new PageHandlerRegistry.ExecutionMethod(
      handlers.map(handler => handler.handlePostManagedState.bind(handler))
    );
  }

  /**
   * Executes the pre-manage handlers with given arguments
   *
   * @param {?ManagedPage} managedPage
   * @param {?ManagedPage} nextManagedPage
   * @param {{ type: string, event: Event, url: string }} action
   * @return {Promise<any>}
   */
  handlePreManagedState(managedPage, nextManagedPage, action) {
    return this._preManageHandlers.execute(
      managedPage,
      nextManagedPage,
      action
    );
  }

  /**
   * Executes the post-manage handlers with given arguments
   *
   * @param {?ManagedPage} managedPage
   * @param {?ManagedPage} previousManagedPage
   * @param {{ type: string, event: Event, url: string }} action
   * @return {Promise<any>}
   */
  handlePostManagedState(managedPage, previousManagedPage, action) {
    return this._postManageHandlers.execute(
      managedPage,
      previousManagedPage,
      action
    );
  }
}

PageHandlerRegistry.ExecutionMethod = SerialBatch;
