import ns from 'imajs/client/core/namespace.js';
import CoreError from 'imajs/client/core/coreError.js';

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
class Controller extends ns.Core.Interface.Controller {

	/**
	 * Initializes the controller.
	 *
	 * @constructor
	 * @method constructor
	 * @param {Core.Interface.View} view The controller's view.
	 */
	constructor(view) {
		super();

		/**
		 * The current state of the controller.
		 *
		 * @property _state
		 * @protected
		 * @type {Object<string, *>}
		 * @default {}
		 */
		this._state = {};

		/**
		 * Pointer for active react class in DOM.
		 *
		 * @property _reactiveView
		 * @protected
		 * @type {Vendor.React.ReactComponent}
		 * @default null
		 */
		this._reactiveView = null;

		/**
		 * The HTTP response code to send to the client.
		 *
		 * @property _status
		 * @protected
		 * @type {number}
		 * @default 200
		 */
		this._status = 200;

		/**
		 * The controller's view.
		 *
		 * @property view
		 * @protected
		 * @type {Core.Interface.View}
		 */
		this._view = view;

		/**
		 * Not-yet-renderered React view of this controller. This field is
		 * initialized using the controller's {@codelink _view} in the
		 * {@codelink init} method.
		 *
		 * @property _reactView
		 * @private
		 * @type {Vendor.React.ReactElement}
		 * @default null
		 */
		this._reactView = null;

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
	 * @inheritdoc
	 * @override
	 * @method init
	 */
	init() {
		this._view.init(() => this.getState());
		this._reactView = this._view.getReactView();
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
		this._reactiveView = null;
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
	activate() {
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
		throw new CoreError('The Core.Abstract.Controller.load method is abstract ' +
		'and must be overridden');
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
		return this._reactView;
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
		this._reactiveView = reactiveView;
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
		this._state = state;
		if (this._reactiveView) {
			this._reactiveView.setState(this._state);
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
	 * @inheritdoc
	 * @override
	 * @method patchState
	 * @param {Object<string, *>} statePatch Patch of the controller's state to
	 *        apply.
	 */
	patchState(statePatch) {
		this.setState(Object.assign(this._state, statePatch));
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
		return this._state;
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
	 * @param {Core.Interface.Seo} seo SEO attributes manager to configure.
	 * @param {Core.Interface.Router} router The current application router.
	 * @param {Core.Interface.Dictionary} dictionary The current localization
	 *        dictionary.
	 * @param {Object<string, *>} settings The application settings for the
	 *        current application environment.
	 */
	setSeoParams(resolvedPromises, seo, router, dictionary, setting) {
		throw new CoreError('The Core.Abstract.Controller.setSeoParams method is ' +
		'abstract and must be overridden');
	}

	/**
	 * Set route parameters for controller.
	 *
	 * @inheritdoc
	 * @override
	 * @method setRouteParams
	 * @param {Object<string, string>=} [params={}] The current route parameters.
	 */
	setRouteParams(params = {}) {
		this.params = params;
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
		return this._status;
	}
}

ns.Core.Abstract.Controller = Controller;