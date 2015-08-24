import ns from 'imajs/client/core/namespace';
import IMAError from 'imajs/client/core/imaError';

ns.namespace('Core.Abstract');

/**
 * Basic implementation of the {@codelink Core.Interface.Controller} interface,
 * providing the default implementation of most of the API.
 *
 * @abstract
 * @class Controller
 * @implements Core.Interface.Controller
 * @namespace Core.Abstract
 * @module Core
 * @submodule Core.Abstract
 * @requires Core.Interface.View
 */
export default class Controller extends ns.Core.Interface.Controller {

	/**
	 * Initializes the controller.
	 *
	 * @constructor
	 * @method constructor
	 */
	constructor() {
		super();

		/**
		 * State manager.
		 *
		 * @property _stateManager
		 * @protected
		 * @type {Core.Interface.PageStateManager}
		 * @default null
		 */
		this._stateManager = null;

		/**
		 * The HTTP response code to send to the client.
		 *
		 * @property status
		 * @public
		 * @type {number}
		 * @default 200
		 */
		this.status = 200;

		/**
		 * The route parameters extracted from the current route.
		 *
		 * @property params
		 * @public
		 * @type {Object<string, string>}
		 * @default {}
		 */
		this.params = {};
	}

	/**
	 * Callback for initializing the controller with the route parameters.
	 *
	 * @inheritDoc
	 * @override
	 * @method init
	 */
	init() {}

	/**
	 * Finalization callback, called when the controller is being discarded by
	 * the application. This usually happens when the user navigates to a
	 * different URL.
	 *
	 * The controller should unregister all React and DOM event listeners the
	 * controller has registered in the {@codelink active()} method. The
	 * controller must also release any resources that might not be released
	 * automatically when the controller instance is destroyed by the garbage
	 * collector.
	 *
	 * @inheritDoc
	 * @override
	 * @method destroy
	 */
	destroy() {}

	/**
	 * Callback for activating the controller in the UI. This is the last method
	 * invoked during controller initialization, called after all the promises
	 * returned from the {@codelink load()} method has been resolved, the
	 * controller's reactive view has been set and the controller has configured
	 * the SEO manager.
	 *
	 * The controller may register in this method any React and DOM event
	 * listeners the controller may need to handle the user interaction with the
	 * page.
	 *
	 * @inheritDoc
	 * @override
	 * @method activate
	 */
	activate() {}

	/**
	 * Callback the controller uses to request the resources it needs to render
	 * its view. This method is invoked after the {@codelink init()} method.
	 *
	 * The controller should request all resources it needs in this method, and
	 * represent each resource request as a promise that will resolve once the
	 * resource is ready for use (these can be data fetch over HTTP(S), database
	 * connections, etc).
	 *
	 * The controller must return a map object. The field names of the object
	 * identify the resources being fetched and prepared, the values must be the
	 * Promises that resolve when the resources are ready to be used.
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
	 * @inheritDoc
	 * @abstract
	 * @override
	 * @method load
	 * @return {Object<string, (Vendor.Rsvp.Promise|*)>} A map object of promises
	 *         resolved when all resources the controller requires are ready. The
	 *         resolved values will be pushed to the controller's state.
	 */
	load() {
		throw new IMAError('The Core.Abstract.Controller.load method is ' +
				'abstract and must be overridden');
	}

	/**
	 * Callback for updating the controller. This method is invoked
	 * if {@codelink Core.Router.Route} has options onlyUpdate set to true.
	 * Others callbacks as {@codelink init()}, {@codelink load()}, {@codelink activate()},
	 * {@codelink deinit()} are not call.
	 *
	 * @inheritDoc
	 * @override
	 * @method update
	 * @param {Object<string, string>=} [params={}] Last route params.
	 * @return {Object<string, (Promise|*)>} A map object of promises
	 *         resolved when all resources the controller requires are ready. The
	 *         resolved values will be pushed to the controller's state.
	 */
	update(params = {}) {
		return this.getState() || {};
	}

	/**
	 * Sets the controller state, replacing the old state. This method also
	 * pushes the state into the controller's reactive (rendered) view (if
	 * present).
	 *
	 * You should use this method only if you need to remove a field from the
	 * controller's current state. To perform updates of the state, please use
	 * the {@codelink patchState} method.
	 *
	 * @inheritDoc
	 * @override
	 * @method setState
	 * @param {Object<string, *>} state The new controller state, replacing the
	 *        old state.
	 */
	setState(state) {
		if (this._stateManager) {
			this._stateManager.setState(state);
		}
	}

	/**
	 * Patches the state of this controller using the provided object by copying
	 * the provided patch object fields to the controller's state object.
	 *
	 * You can use this method to modify the state partially or add new fields to
	 * the state object. Fields can only be removed from the controller's state
	 * through the {@codelink setState} method.
	 *
	 * Note that the state is not patched recursively but by replacing the values
	 * of the top-level fields of the state object.
	 *
	 * Once the promises returned by the {@codelink load} method are resolved,
	 * this method is called with the an object containing the resolved values.
	 * The field names of the passed value-containing object will match the field
	 * names in the object returned from the {@codelink load} method.
	 *
	 * @inheritDoc
	 * @override
	 * @method patchState
	 * @param {Object<string, *>} statePatch Patch of the controller's state to
	 *        apply.
	 */
	patchState(statePatch) {
		if (this._stateManager) {
			this._stateManager.patchState(statePatch);
		}
	}

	/**
	 * Returns the controller's current state.
	 *
	 * @inheritDoc
	 * @override
	 * @method getState
	 * @return {Object<string, *>|Null} The current state of this controller.
	 */
	getState() {
		if (this._stateManager) {
			return this._stateManager.getState();
		} else {
			return null;
		}
	}

	/**
	 * Callback used to configure the SEO attribute manager. The method is called
	 * after the the controller's state has been patched with the loaded
	 * resources, the view has been rendered and (if at the client-side) the
	 * controller has been provided with the rendered view.
	 *
	 * @inheritDoc
	 * @override
	 * @abstract
	 * @method setMetaParams
	 * @param {Object<string, *>} loadedResources Map of resource names to
	 *        resources loaded by the {@codelink load} method. This is the same
	 *        object as the one passed to the {@codelink patchState} method when
	 *        the Promises returned by the {@codelink load} method were resolved.
	 * @param {Core.Interface.Seo} seo SEO attributes manager to configure.
	 * @param {Core.Interface.Router} router The current application router.
	 * @param {Core.Interface.Dictionary} dictionary The current localization
	 *        dictionary.
	 * @param {Object<string, *>} settings The application settings for the
	 *        current application environment.
	 */
	setMetaParams(loadedResources, seo, router, dictionary, settings) {
		throw new IMAError('The Core.Abstract.Controller.setMetaParams method is ' +
				'abstract and must be overridden');
	}

	/**
	 * Set route parameters for controller.
	 *
	 * @inheritDoc
	 * @override
	 * @method setRouteParams
	 * @param {Object<string, string>=} [params={}] The current route parameters.
	 */
	setRouteParams(params = {}) {
		this.params = params;
	}

	/**
	 * Set route parameters from controller.
	 *
	 * @inheritDoc
	 * @override
	 * @method getRouteParams
	 * @return {Object<string, string>} The current route parameters.
	 */
	getRouteParams() {
		return this.params;
	}

	/**
	 * Set state manager.
	 *
	 * @method setStateManager
	 * @param {Core.Interface.PageStateManager|Null} stateManager
	 */
	setStateManager(stateManager) {
		this._stateManager = stateManager;
	}

	/**
	 * Returns the HTTPS status code to send to the client.
	 *
	 * @inheritDoc
	 * @override
	 * @method getHttpStatus
	 * @return {number} The HTTP status code to send to the client.
	 */
	getHttpStatus() {
		return this.status;
	}
}

ns.Core.Abstract.Controller = Controller;
