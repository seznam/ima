/**
 * Extensions provide means of extending the page controllers with additional
 * managed state and logic.
 *
 * An extension has access to the current route parameters, specify the
 * resources to load when the page is loading or being updated, may intercept
 * event bus events and modify the state of the page just like an ordinary
 * controller, except that the modifications are restricted to the state fields
 * which the extension explicitly specifies using its
 * {@link Extension#getAllowedStateKeys} method.
 *
 * All extensions to be used on a page must be added to the current controller
 * before the controller is initialized. After that, the extensions will go
 * through the same lifecycle as the controller.
 *
 * @interface
 */
export default class Extension {
  /**
   * Callback for initializing the controller extension after the route
   * parameters have been set on this extension.
   */
  init() {}

  /**
   * Finalization callback, called when the controller is being discarded by
   * the application. This usually happens when the user navigates to a
   * different URL.
   *
   * This method is the lifecycle counterpart of the {@link Extension#init}
   * method.
   *
   * The extension should release all resources obtained in the
   * {@link Extension#init} method. The extension must release any resources
   * that might not be released automatically when the extensions's instance
   * is destroyed by the garbage collector.
   */
  destroy() {}

  /**
   * Callback for activating the extension in the UI. This is the last
   * method invoked during controller (and extensions) initialization, called
   * after all the promises returned from the {@link Extension#load} method have
   * been resolved and the controller has configured the meta manager.
   *
   * The extension may register any React and DOM event listeners in this
   * method. The extension may start receiving event bus event after this
   * method completes.
   */
  activate() {}

  /**
   * Callback for deactivating the extension in the UI. This is the first
   * method invoked during extension deinitialization. This usually happens
   * when the user navigates to a different URL.
   *
   * This method is the lifecycle counterpart of the {@link Extension#activate}
   * method.
   *
   * The extension should deregister listeners registered and release all
   * resources obtained in the {@link Extension#activate} method.
   */
  deactivate() {}

  /**
   * Callback the extension uses to request the resources it needs to render
   * its related parts of the view. This method is invoked after the
   * {@link Extension#init} method.
   *
   * The extension should request all resources it needs in this method, and
   * represent each resource request as a promise that will resolve once the
   * resource is ready for use (these can be data fetched over HTTP(S),
   * database connections, etc).
   *
   * The method must return a plain flat object. The field names of the
   * object identify the resources being fetched and prepared, each value
   * must be either the resource (e.g. view configuration or a value
   * retrieved synchronously) or a Promise that will resolve to the resource.
   *
   * The IMA will use the object to set the state of the controller.
   *
   * Any returned promise that gets rejected will redirect the application to
   * the error page. The error page that will be used depends on the status
   * code of the error.
   *
   * @return {Object<string, (Promise|*)>} A map object of promises
   *         resolved when all resources the extension requires are ready.
   *         The resolved values will be pushed to the controller's state.
   */
  load() {}

  /**
   * Callback for updating the extension after a route update. This method
   * is invoked if the current route has the `onlyUpdate` flag set to `true` and
   * the current controller and view match those used by the previously active
   * route, or, the `onlyUpdate` option of the current route is a callback and
   * returned `true`.
   *
   * The method must return an object with the same semantics as the result
   * of the {@link Extension#load} method. The controller's state will then be
   * patched by the returned object.
   *
   * The other extension lifecycle callbacks ({@link Extension#init},
   * {@link Extension#load}, {@link Extension#activate},
   * {@link Extension#deactivate}, {@link Extension#deinit}) are not call in
   * case this method is used.
   *
   * @param {Object<string, string>=} [prevParams={}] Previous route
   *        parameters.
   * @return {Object<string, (Promise|*)>} A map object of promises
   *         resolved when all resources the extension requires are ready.
   *         The resolved values will be pushed to the controller's state.
   */
  update() {}

  /**
   * Patches the state of the controller using this extension by using the
   * provided object by copying the provided patch object fields to the
   * controller's state object.
   *
   * Note that the state is not patched recursively but by replacing the
   * values of the top-level fields of the state object.
   *
   * Note that the extension may modify only the fields of the state that it
   * has specified by its {@link Extension#getAllowedStateKeys} method.
   *
   * @param {Object<string, *>} statePatch Patch of the controller's state to
   *        apply.
   */
  setState() {}

  /**
   * Returns the current state of the controller using this extension.
   *
   * @return {Object<string, *>} The current state of the controller.
   */
  getState() {}

  /**
   * Patches the partial state of the extension. The extension is able
   * during its load and update phase receive state from active controller
   * using this extension and from previously loaded/updated extensions.
   *
   * @param {Object<string, *>} partialStatePatch Patch of the controller's state to
   *        apply.
   */
  setPartialState() {}

  /**
   * Returns the current partial state of the extension.
   *
   * @return {Object<string, *>} The current partial state of the extension.
   */
  getPartialState() {}

  /**
   * Clears the current partial state of the extension and sets it value to empty object.
   */
  clearPartialState() {}

  /**
   * Sets the state manager used to manage the controller's state..
   *
   * @param {?PageStateManager} pageStateManager The current state manager to
   *        use.
   */
  setPageStateManager() {}

  /**
   * Enables using PageStateManager for getting state.
   */
  switchToStateManager() {}

  /**
   * Disables using PageStateManager for getting state.
   */
  switchToPartialState() {}

  /**
   * Sets the current route parameters. This method is invoked before the
   * {@link Extension#init} method.
   *
   * @param {Object<string, string>} [params={}] The current route
   *        parameters.
   */
  setRouteParams() {}

  /**
   * Returns the current route parameters.
   *
   * @return {Object<string, string>} The current route parameters.
   */
  getRouteParams() {}

  /**
   * Returns the names of the state fields that may be manipulated by this
   * extension. Manipulations of other fields of the state will be ignored.
   *
   * @return {string[]} The names of the state fields that may be manipulated
   *         by this extension.
   */
  getAllowedStateKeys() {}
}
