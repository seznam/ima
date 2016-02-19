import ns from 'ima/core/namespace';

ns.namespace('Core.Interface');

/**
 * Interface defining the common API of component extension. A page extension is
 * used to manage the component state and component logic, and updates the component
 * state according to the events submitted to it by components on the page.
 *
 * @interface Extension
 * @namespace Core.Interface
 * @module Core
 * @submodule Core.Interface
 */
export default class Extension {

	/**
	 * Callback for initializing the extension with the route parameters.
	 *
	 * @method init
	 */
	init() {}

	/**
	 * Finalization callback, called when the extension is being discarded by
	 * the application. This usually happens when the user navigates to a
	 * different URL.
	 *
	 * The extension should unregister all resource registered in the
	 * {@codelink init()} method. The extension must also release any
	 * resources that might not be released automatically when the extension
	 * instance is destroyed by the garbage collector.
	 *
	 * @method destroy
	 */
	destroy() {}

	/**
	 * Callback for activating the extension in the UI. This is the last
	 * method invoked during extension initialization, called after all the
	 * promises returned from the {@codelink load()} method has been resolved.
	 *
	 * The extension may register in this method any React and DOM event
	 * listeners the extension may need to handle the user interaction with
	 * the page.
	 *
	 * @method activate
	 */
	activate() {}

	/**
	 * Callback for deactivating the extension in the UI. This is the first
	 * method invoked during extension deinitialization. This usually happens
	 * when the user navigates to a different URL.
	 *
	 * The extension should unregister all React and DOM event listeners the
	 * extension has registered in the {@codelink active()} method.
	 *
	 * @method deactivate
	 */
	deactivate() {}

	/**
	 * Callback the extension uses to request the resources it needs to render
	 * its view. This method is invoked after the {@codelink init()} method.
	 *
	 * The extension should request all resources it needs in this method, and
	 * represent each resource request as a promise that will resolve once the
	 * resource is ready for use (these can be data fetch over HTTP(S),
	 * database connections, etc).
	 *
	 * The extension must return a map object. The field names of the object
	 * identify the resources being fetched and prepared, the values must be
	 * the Promises that resolve when the resources are ready to be used.
	 *
	 * The returned map object may also contain fields that have non-Promise
	 * value. These can be used to represent static data, or initial value of
	 * extension's state that will change due to user interaction, or resource
	 * that has been immediately available (for example fetched from the DOM
	 * storage).
	 *
	 * The system will wait for all promises to resolve, and then push them to
	 * the extension's state using the field names used in the returned map
	 * object.
	 *
	 * @method load
	 * @return {Object<string, (Promise|*)>} A map object of promises
	 *         resolved when all resources the extension requires are ready.
	 *         The resolved values will be pushed to the extension's state.
	 */
	load() {}

	/**
	 * Callback for updating the extension. This method is invoked
	 * if {@codelink Core.Router.Route} has options onlyUpdate set to true.
	 * Others callbacks as {@codelink init()}, {@codelink load()},
	 * {@codelink activate()}, {@codelink deactivate()}, {@codelink deinit()}
	 * are not call.
	 *
	 * @inheritdoc
	 * @override
	 * @method update
	 * @param {Object<string, string>=} [prevParams={}] Previous route params.
	 * @return {Object<string, (Promise|*)>} A map object of promises
	 *         resolved when all resources the extension requires are ready.
	 *         The resolved values will be pushed to the extension's state.
	 */
	update(prevParams = {}) {}

	/**
	 * Patches the state of this extension using the provided object by
	 * copying the provided patch object fields to the extension's state
	 * object.
	 *
	 * You can use this method to modify the state partially or add new fields
	 * to the state object.
	 *
	 * Note that the state is not patched recursively but by replacing the
	 * values of the top-level fields of the state object.
	 *
	 * Once the promises returned by the {@codelink load} method are resolved,
	 * this method is called with the an object containing the resolved values.
	 * The field names of the passed value-containing object will match the
	 * field names in the object returned from the {@codelink load} method.
	 *
	 * @method setState
	 * @param {Object<string, *>} statePatch Patch of the extension's state to
	 *        apply.
	 */
	setState(statePatch) {}

	/**
	 * Returns the extension's current state.
	 *
	 * @method getState
	 * @return {Object<string, *>} The current state of this extension.
	 */
	getState() {}

	/**
	 * Sets the state manager.
	 *
	 * @method setPageStateManager
	 * @param {?Core.Interface.PageStateManager} pageStateManager The current
	 *        state manager to use.
	 */
	setPageStateManager(pageStateManager) {}

	/**
	 * Set route parameters for extension.
	 *
	 * @method setRouteParams
	 * @param {Object<string, string>} [params={}] The current route
	 *        parameters.
	 */
	setRouteParams(params = {}) {}

	/**
	 * Set route parameters for extension.
	 *
	 * @method getRouteParams
	 * @return {Object<string, string>} The current route parameters.
	 */
	getRouteParams() {}

	/**
	 * Returns array of allowed state keys for extension.
	 *
	 * @method getAllowedStateKeys
	 * @return {string[]} The allowed state keys.
	 */
	getAllowedStateKeys() {}
}

ns.Core.Interface.Extension = Extension;
