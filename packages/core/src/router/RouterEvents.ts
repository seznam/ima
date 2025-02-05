/**
 * Events constants, which is firing to app.
 */
export enum RouterEvents {
  /**
   * Router fire event `$IMA.$Router.beforeHandleRoute` before page
   * manager handle the route. Event's data contain
   * `{ params: Object<string, string>, route: ima.core.router.AbstractRoute, path: string, options: Object<string, any>}`.
   * The `path` is current path, the `params` are params extracted from path, the
   * `route` is handle route for path and the `options` is route
   * additional options.
   */
  BEFORE_HANDLE_ROUTE = '$IMA.$Router.beforeHandleRoute',

  /**
   * Router fire event `$IMA.$Router.afterHandleRoute` after page
   * manager handle the route. Event's data contain
   * `{response: Object<string, any>, params: Object<string, string>`,
   * `route: ima.core.router.AbstractRoute, path: string, options: Object<string, *>}`.
   * The `response` is page render result. The `path` is current
   * path, the `params` are params extracted from path, the
   * `route` is handle route for path and the `options` is route
   * additional options.
   */
  AFTER_HANDLE_ROUTE = '$IMA.$Router.afterHandleRoute',

  /**
   * Fired right before loading view and controller when either
   * view or controller is async (or both).
   */
  BEFORE_LOADING_ASYNC_ROUTE = '$IMA.$Router.beforeLoadingAsyncRoute',

  /**
   * Event fired when router finishes loading of async view
   * and controller. If both are sync this is never fired.
   */
  AFTER_LOADING_ASYNC_ROUTE = '$IMA.$Router.afterLoadingAsyncRoute',
}
