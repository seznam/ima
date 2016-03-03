import ns from 'ima/namespace';

ns.namespace('ima.extension');

/**
 * Extensions provide means of extending the page controllers with additional
 * managed state and logic.
 *
 * An extension has access to the current route parameters, specify the
 * resources to load when the page is loading or being updated, may intercept
 * event bus events and modify the state of the page just like an ordinary
 * controller, except that the modifications are restricted to the state fields
 * which the extension explicitly specifies using its
 * {@linkcode getAllowedStateKeys()} method.
 *
 * All extensions to be used on a page must be added to the current controller
 * before the controller is initialized. After that, the extensions will go
 * through the same lifecycle as the controller.
 *
 * @interface Extension
 * @namespace ima.extension
 * @module ima
 * @submodule ima.extension
 */
export default class Extension {

	/**
	 * Callback for initializing the controller extension after the route
	 * parameters have been set on this extension.
	 *
	 * @method init
	 */
	init() {}

	/**
	 * Finalization callback, called when the controller is being discarded by
	 * the application. This usually happens when the user navigates to a
	 * different URL.
	 *
	 * This method is the lifecycle counterpart of the {@linkcode init()}
	 * method.
	 *
	 * The extension should release all resources obtained in the
	 * {@codelink init()} method. The extension must release any resources
	 * that might not be released automatically when the extensions's instance
	 * is destroyed by the garbage collector.
	 *
	 * @method destroy
	 */
	destroy() {}

	/**
	 * Callback for activating the extension in the UI. This is the last
	 * method invoked during controller (and extensions) initialization, called
	 * after all the promises returned from the {@codelink load()} method have
	 * been resolved and the controller has configured the meta manager.
	 *
	 * The extension may register any React and DOM event listeners in this
	 * method. The extension may start receiving event bus event after this
	 * method completes.
	 *
	 * @method activate
	 */
	activate() {}

	/**
	 * Callback for deactivating the extension in the UI. This is the first
	 * method invoked during extension deinitialization. This usually happens
	 * when the user navigates to a different URL.
	 *
	 * This method is the lifecycle counterpart of the {@linkcode activate()}
	 * method.
	 *
	 * The extension should deregister listeners registered and release all
	 * resources obtained in the {@codelink activate()} method.
	 *
	 * @method deactivate
	 */
	deactivate() {}

	/**
	 * Callback the extension uses to request the resources it needs to render
	 * its related parts of the view. This method is invoked after the
	 * {@codelink init()} method.
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
	 * @method load
	 * @return {Object<string, (Promise|*)>} A map object of promises
	 *         resolved when all resources the extension requires are ready.
	 *         The resolved values will be pushed to the controller's state.
	 */
	load() {}

	/**
	 * Callback for updating the extension after a route update. This method
	 * is invoked if the current route has the {@code onlyUpdate} flag set to
	 * {@code true} and the current controller and view match those used by the
	 * previously active route, or, the {@code onlyUpdate} option of the
	 * current route is a callback and returned {@code true}.
	 *
	 * The method must return an object with the same semantics as the result
	 * of the {@codelink load()} method. The controller's state will then be
	 * patched by the returned object.
	 *
	 * The other extension lifecycle callbacks ({@codelink init()},
	 * {@codelink load()}, {@codelink activate()}, {@codelink deactivate()},
	 * {@codelink deinit()}) are not call in case this method is used.
	 *
	 * @method update
	 * @param {Object<string, string>=} [prevParams={}] Previous route
	 *        parameters.
	 * @return {Object<string, (Promise|*)>} A map object of promises
	 *         resolved when all resources the extension requires are ready.
	 *         The resolved values will be pushed to the controller's state.
	 */
	update(prevParams = {}) {}

	/**
	 * Patches the state of the controller using this extension by using the
	 * provided object by copying the provided patch object fields to the
	 * controller's state object.
	 *
	 * Note that the state is not patched recursively but by replacing the
	 * values of the top-level fields of the state object.
	 *
	 * Note that the extension may modify only the fields of the state that it
	 * has specified by its {@linkcode getAllowedStateKeys} method.
	 *
	 * @method setState
	 * @param {Object<string, *>} statePatch Patch of the controller's state to
	 *        apply.
	 */
	setState(statePatch) {}

	/**
	 * Returns the current state of the controller using this extension.
	 *
	 * @method getState
	 * @return {Object<string, *>} The current state of the controller.
	 */
	getState() {}

	/**
	 * Sets the state manager used to manage the controller's state..
	 *
	 * @method setPageStateManager
	 * @param {?ima.page.state.PageStateManager} pageStateManager The current
	 *        state manager to use.
	 */
	setPageStateManager(pageStateManager) {}

	/**
	 * Sets the current route parameters. This method is invoked before the
	 * {@code init()} method.
	 *
	 * @method setRouteParams
	 * @param {Object<string, string>} [params={}] The current route
	 *        parameters.
	 */
	setRouteParams(params = {}) {}

	/**
	 * Returns the current route parameters.
	 *
	 * @method getRouteParams
	 * @return {Object<string, string>} The current route parameters.
	 */
	getRouteParams() {}

	/**
	 * Returns the names of the state fields that may be manipulated by this
	 * extension. Manipulations of other fields of the state will be ignored.
	 *
	 * @method getAllowedStateKeys
	 * @return {string[]} The names of the state fields that may be manipulated
	 *         by this extension.
	 */
	getAllowedStateKeys() {}
}

ns.ima.extension.Extension = Extension;
