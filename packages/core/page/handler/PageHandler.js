/**
 *
 */
export default class PageHandler {
  /**
   * Initializes the page handler.
   */
  init() {}

  /**
   * Called before a PageManager starts to transition from previous page to
   * a new one.
   *
   * @param {?ManagedPage} managedPage The currently managed page - soon-to-be
   *        previously managed page.
   * @param {?ManagedPage} nextManagedPage The data of the page that's about to
   *        be managed.
   * @param {{
   *          type: string,
   *          event: Event,
   *          url: string
   *        }} [action] An action object describing what triggered the routing.
   */
  handlePreManagedState() {}

  /**
   * Called after a PageManager finishes transition from previous page to
   * a new one.
   *
   * @param {?ManagedPage} managedPage The currently managed page.
   * @param {?ManagedPage} previousManagedPage The data of the page that was
   *        previously managed.
   * @param {{
   *          type: string,
   *          event: Event,
   *          url: string
   *        }} [action] An action object describing what triggered the routing.
   */
  handlePostManagedState() {}

  /**
   * Finalization callback, called when the page manager is being discarded.
   * This usually happens when the page is hot-reloaded at the client side.
   */
  destroy() {}
}
