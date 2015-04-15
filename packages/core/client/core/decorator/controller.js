import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Decorator');

/**
 * Decorator for page controllers. The decorator manages references to the SEO
 * attributes manager and other utilities to provide them to the decorated page
 * controller.
 *
 * @class Controller
 * @implements Core.Interface.Controller
 * @namespace Core.Decorator
 * @module Core
 * @submodule Core.Decorator
 */
class Controller extends ns.Core.Interface.Controller {

	/**
	 * Initializes the controller decorator.
	 *
	 * @method constructor
	 * @constructor
	 * @param {Core.Interface.Controller} controller The actuall controller being
	 *        decorated.
	 * @param {Core.Interface.Seo} seo SEO attributes manager.
	 * @param {Core.Interface.Router} router The application router.
	 * @param {Core.Interface.Dictionary} dictionary Localization phrases
	 *        dictionary.
	 * @param {Object<string, *>} setting  Application settings for the current
	 *        application environment.
	 */
	constructor(controller, seo, router, dictionary, setting) {
		super();

		/**
		 * The actuall controller being decorated.
		 *
		 * @property _controller
		 * @private
		 * @type {Core.Interface.Controller}
		 */
		this._controller = controller;

		/**
		 * SEO attributes manager.
		 *
		 * @property _seo
		 * @private
		 * @type {Core.Interface.Seo}
		 */
		this._seo = seo;

		/**
		 * The application router.
		 *
		 * @property _router
		 * @private
		 * @type {Core.Interface.Router}
		 */
		this._router = router;

		/**
		 * Localization phrases dictionary.
		 *
		 * @property _dictionary
		 * @private
		 * @type {Core.Interface.Dictionary}
		 */
		this._dictionary = dictionary;

		/**
		 * Application settings for the current application environment.
		 *
		 * @property _setting
		 * @private
		 * @type {Object<string, *>}
		 */
		this._setting = setting;
	}

	/**
	 * Callback for initializing the controller with the route parameters.
	 *
	 * @inheritdoc
	 * @override
	 * @method init
	 * @param {Object<string, string>=} [params={}] The current route parameters.
	 */
	init(params = {}) {
		this._controller.init(params);
	}

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
	 * @inheritdoc
	 * @override
	 * @method deinit
	 */
	deinit() {
		this._controller.deinit();
	}

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
	 * @inheritdoc
	 * @override
	 * @method activate
	 */
	activate() { // jshint ignore:line
		this._controller.activate();
	}

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
	 * @inheritdoc
	 * @abstract
	 * @override
	 * @method load
	 * @return {Object<string, (Vendor.Rsvp.Promise|*)>} A map object of promises
	 *         resolved when all resources the controller requires are ready. The
	 *         resolved values will be pushed to the controller's state.
	 */
	load() {
		return this._controller.load();
	}

	/**
	 * Returns the controller's view.
	 *
	 * @inheritdoc
	 * @override
	 * @method getReactView
	 * @return {Vendor.React.ReactElement} The controller's view.
	 */
	getReactView() {
		return this._controller.getReactView();
	}

	/**
	 * Sets the rendered (reactive) view, allowing the controller to push changes
	 * in state to the current view shown to the user instance.
	 *
	 * Note that this method is invoked only at the client-side.
	 *
	 * @inheritdoc
	 * @override
	 * @method setReactiveView
	 * @param {Vendor.React.ReactComponent} The rendered controller's view.
	 */
	setReactiveView(reactiveView) {
		this._controller.setReactiveView(reactiveView);
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
	 * @inheritdoc
	 * @override
	 * @method setState
	 * @param {Object<string, *>} state The new controller state, replacing the
	 *        old state.
	 */
	setState(state) {
		this._controller.setState(state);
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
	 * @inheritdoc
	 * @override
	 * @method patchState
	 * @param {Object<string, *>} statePatch Patch of the controller's state to
	 *        apply.
	 */
	patchState(state) {
		this._controller.patchState(state);
	}

	/**
	 * Returns the controller's current state.
	 *
	 * @inheritdoc
	 * @override
	 * @method getState
	 * @return {Object<string, *>} The current state of this controller.
	 */
	getState() {
		return this._controller.getState();
	}

	/**
	 * Callback used to configure the SEO attribute manager. The method is called
	 * after the the controller's state has been patched with the loaded
	 * resources, the view has been rendered and (if at the client-side) the
	 * controller has been provided with the rendered view.
	 *
	 * @inheritdoc
	 * @override
	 * @abstract
	 * @method setSeoParams
	 * @param {Object<string, *>} loadedResources Map of resource names to
	 *        resources loaded by the {@codelink load} method. This is the same
	 *        object as the one passed to the {@codelink patchState} method when
	 *        the Promises returned by the {@codelink load} method were resolved.
	 */
	setSeoParams(loadedResources) {
		this._controller.setSeoParams(loadedResources, this._seo, this._router,
			this._dictionary, this._setting);
	}

	/**
	 * Returns the SEO attributes manager to configured by this controller.
	 *
	 * @method getSeoManager
	 * @return {Core.Interface.Seo} SEO attributes manager to configured by this
	 *         controller.
	 */
	getSeoManager() {
		return this._seo;
	}

	/**
	 * Returns the HTTPS status code to send to the client.
	 *
	 * @inheritdoc
	 * @override
	 * @method getHttpStatus
	 * @return {number} The HTTP status code to send to the client.
	 */
	getHttpStatus() {
		return this._controller.getHttpStatus();
	}
}

ns.Core.Decorator.Controller = Controller;