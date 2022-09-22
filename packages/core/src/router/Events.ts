/**
 * Events constants, which is firing to app.
 *
 * @enum {string}
 */
const Events = Object.freeze({
  /**
   * Router fire event `$IMA.$Router.beforeHandleRoute` before page
   * manager handle the route. Event's data contain
   * `{ params: Object<string, string>`, route: ima.core.router.AbstractRoute,
   * path: string, options: Object<string, *>}}. The `path` is current
   * path, the `params` are params extracted from path, the
   * `route` is handle route for path and the `options` is route
   * additional options.
   *
   * @const
   * @type {string}
   */
  BEFORE_HANDLE_ROUTE: '$IMA.$Router.beforeHandleRoute',

  /**
   * Router fire event `$IMA.$Router.afterHandleRoute` after page
   * manager handle the route. Event's data contain
   * `{response: Object<string, *>, params: Object<string, string>`,
   * route: ima.core.router.AbstractRoute, path: string, options: Object<string, *>}}.
   * The `response` is page render result. The `path` is current
   * path, the `params` are params extracted from path, the
   * `route` is handle route for path and the `options` is route
   * additional options.
   *
   * @const
   * @type {string}
   */
  AFTER_HANDLE_ROUTE: '$IMA.$Router.afterHandleRoute',
});

export default Events;
