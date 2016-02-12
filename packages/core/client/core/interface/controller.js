import ns from 'imajs/client/core/namespace';

ns.namespace('Core.Interface');

/**
 * Interface defining the common API of page controllers. A page controller is
 * used to manage the overall state and view of a single application page, and
 * updates the page state according to the events submitted to it by components
 * on the page.
 *
 * @interface Controller
 * @namespace Core.Interface
 * @module Core
 * @submodule Core.Interface
 */
export default class Controller {

	/**
	 * Callback for initializing the controller with the route parameters.
	 *
	 * @method init
	 */
	init() {}

	/**
	 * Finalization callback, called when the controller is being discarded by
	 * the application. This usually happens when the user navigates to a
	 * different URL.
	 *
	 * The controller should unregister all resource registered in the
	 * {@codelink init()} method. The controller must also release any
	 * resources that might not be released automatically when the controller
	 * instance is destroyed by the garbage collector.
	 *
	 * @method destroy
	 */
	destroy() {}

	/**
	 * Callback for activating the controller in the UI. This is the last
	 * method invoked during controller initialization, called after all the
	 * promises returned from the {@codelink load()} method has been resolved,
	 * the controller's reactive view has been set and the controller has
	 * configured the SEO manager.
	 *
	 * The controller may register in this method any React and DOM event
	 * listeners the controller may need to handle the user interaction with
	 * the page.
	 *
	 * @method activate
	 */
	activate() {}

	/**
	 * Callback for deactivating the controller in the UI. This is the first
	 * method invoked during controller deinitialization. This usually happens
	 * when the user navigates to a different URL.
	 *
	 * The controller should unregister all React and DOM event listeners the
	 * controller has registered in the {@codelink active()} method.
	 *
	 * @method deactivate
	 */
	deactivate() {}

	/**
	 * Callback the controller uses to request the resources it needs to render
	 * its view. This method is invoked after the {@codelink init()} method.
	 *
	 * The controller should request all resources it needs in this method, and
	 * represent each resource request as a promise that will resolve once the
	 * resource is ready for use (these can be data fetch over HTTP(S),
	 * database connections, etc).
	 *
	 * The controller must return a map object. The field names of the object
	 * identify the resources being fetched and prepared, the values must be
	 * the Promises that resolve when the resources are ready to be used.
	 *
	 * The returned map object may also contain fields that have non-Promise
	 * value. These can be used to represent static data, or initial value of
	 * controller's state that will change due to user interaction, or resource
	 * that has been immediately available (for example fetched from the DOM
	 * storage).
	 *
	 * The system will wait for all promises to resolve, and then push them to
	 * the controller's state using the field names used in the returned map
	 * object.
	 *
	 * @method load
	 * @return {Object<string, (Promise|*)>} A map object of promises
	 *         resolved when all resources the controller requires are ready.
	 *         The resolved values will be pushed to the controller's state.
	 */
	load() {}

	/**
	 * Callback for updating the controller. This method is invoked
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
	 *         resolved when all resources the controller requires are ready.
	 *         The resolved values will be pushed to the controller's state.
	 */
	update(prevParams = {}) {}

	/**
	 * Patches the state of this controller using the provided object by
	 * copying the provided patch object fields to the controller's state
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
	 * @param {Object<string, *>} statePatch Patch of the controller's state to
	 *        apply.
	 */
	setState(statePatch) {}

	/**
	 * Returns the controller's current state.
	 *
	 * @method getState
	 * @return {Object<string, *>} The current state of this controller.
	 */
	getState() {}

	/**
	 * Add defined extension to controller extensions.
	 *
	 * @chainable
	 * @method addExtension
	 * @param {Core.Interface.Extension} extension
	 * @return {Core.Interface.Controller} This controller
	 */
	addExtension(extension) {}

	/**
	 * Return the controller extensions.
	 *
	 * @method getExtensions
	 * @return {Core.Interface.Extension[]}
	 */
	getExtensions() {}

	/**
	 * Callback used to configure the meta attribute manager. The method is
	 * called after the the controller's state has been patched with the loaded
	 * resources, the view has been rendered and (if at the client-side) the
	 * controller has been provided with the rendered view.
	 *
	 * @method setMetaParams
	 * @param {Object<string, *>} loadedResources Map of resource names to
	 *        resources loaded by the {@codelink load} method. This is the same
	 *        object as the one passed to the {@codelink setState} method
	 *        when the Promises returned by the {@codelink load} method were
	 *        resolved.
	 * @param {Core.Interface.MetaManager} metaManager Meta attributes manager
	 *        to configure.
	 * @param {Core.Interface.Router} router The current application router.
	 * @param {Core.Interface.Dictionary} dictionary The current localization
	 *        dictionary.
	 * @param {Object<string, *>} settings The application settings for the
	 *        current application environment.
	 */
	setMetaParams(loadedResources, metaManager, router, dictionary, settings) {}

	/**
	 * Set route parameters for controller.
	 *
	 * @method setRouteParams
	 * @param {Object<string, string>} [params={}] The current route
	 *        parameters.
	 */
	setRouteParams(params = {}) {}

	/**
	 * Set route parameters for controller.
	 *
	 * @method getRouteParams
	 * @return {Object<string, string>} The current route parameters.
	 */
	getRouteParams() {}

	/**
	 * Sets the page state manager.
	 *
	 * @method setPageStateManager
	 * @param {Core.Interface.PageStateManager|Null} pageStateManager The current
	 *        state manager to use.
	 */
	setPageStateManager(pageStateManager) {}

	/**
	 * Returns the HTTPS status code to send to the client.
	 *
	 * @method getHttpStatus
	 * @return {number} The HTTP status code to send to the client.
	 */
	getHttpStatus() {}
}

ns.Core.Interface.Controller = Controller;
