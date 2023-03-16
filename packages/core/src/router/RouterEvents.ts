/**
 * Events constants, which is firing to app.
 */
export enum RouterEvents {
  /**
   * Router fire event `$IMA.$Router.beforeHandleRoute` before page
   * manager handle the route. Event's data contain
   * `{ params: Object<string, string>`, route: ima.core.router.AbstractRoute,
   * path: string, options: Object<string, *>}}. The `path` is current
   * path, the `params` are params extracted from path, the
   * `route` is handle route for path and the `options` is route
   * additional options.
   */
  BEFORE_HANDLE_ROUTE = '$IMA.$Router.beforeHandleRoute',

  /**
   * Router fire event `$IMA.$Router.afterHandleRoute` after page
   * manager handle the route. Event's data contain
   * `{response: Object<string, *>, params: Object<string, string>`,
   * route: ima.core.router.AbstractRoute, path: string, options: Object<string, *>}}.
   * The `response` is page render result. The `path` is current
   * path, the `params` are params extracted from path, the
   * `route` is handle route for path and the `options` is route
   * additional options.
   */
  AFTER_HANDLE_ROUTE = '$IMA.$Router.afterHandleRoute',

  /**
   * This event is fired before router awaits loding of async route
   * handlers. You can use this to react to these situations in your
   * application to for example render a loader. This only applies
   * to async route handlers when they are not already preloaded.
   */
  BEFORE_ASYNC_ROUTE = '$IMA.$Router.beforeAsyncRoute',

  /**
   * Event fired when router finishes loading of async route handlers.
   */
  AFTER_ASYNC_ROUTE = '$IMA.$Router.afterAsyncRoute',
}
