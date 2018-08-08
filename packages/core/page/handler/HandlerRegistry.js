import SerialBatch from 'execution/SerialBatch';

export default class HandlerRegistry {
  /**
   * Creates an instance of HandlerRegistry and creates {@code SerialBatch}
   * instance for pre-handlers and post-handlers.
   *
   * @param {...PageManagerHandler} handlers
   * @memberof HandlerRegistry
   */
  constructor(...handlers) {
    this._preManageHandlers = new SerialBatch(
      handlers.map(handler => handler.handlePreManagedState.bind(handler))
    );

    this._postManageHandlers = new SerialBatch(
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
  invokePreManageHandlers(nextManagedPage, managedPage, action) {
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
  invokePostManageHandlers(previousManagedPage, managedPage, action) {
    return this._postManageHandlers.execute(
      previousManagedPage,
      managedPage,
      action
    );
  }
}
