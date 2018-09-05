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
   * @param {ManagedPage} nextManagedPage
   * @param {ManagedPage} managedPage
   * @param {{ type: string, payload: Object|Event}} action
   * @return {Promise<any>}
   */
  handlePreManagedState(nextManagedPage, managedPage, action) {
    return this._preManageHandlers.execute(
      nextManagedPage,
      managedPage,
      action
    );
  }

  /**
   * Executes the post-manage handlers with given arguments
   *
   * @param {ManagedPage} previousManagedPage
   * @param {ManagedPage} managedPage
   * @param {{ type: string, payload: Object|Event}} action
   * @return {Promise<any>}
   */
  handlePostManagedState(previousManagedPage, managedPage, action) {
    return this._postManageHandlers.execute(
      previousManagedPage,
      managedPage,
      action
    );
  }
}

PageHandlerRegistry.ExecutionMethod = SerialBatch;
