import ns from 'imajs/client/core/namespace';

ns.namespace('Core.Decorator');

/**
 * Decorator for page controllers. The decorator manages references to the meta
 * attributes manager and other utilities to provide them to the decorated page
 * controller.
 *
 * @class Controller
 * @implements Core.Interface.Controller
 * @namespace Core.Decorator
 * @module Core
 * @submodule Core.Decorator
 */
export default class Controller extends ns.Core.Interface.Controller {

	/**
	 * Initializes the controller decorator.
	 *
	 * @method constructor
	 * @constructor
	 * @param {Core.Interface.Controller} controller The actual controller
	 *        being decorated.
	 * @param {Core.Interface.MetaManager} metaManager meta attributes manager.
	 * @param {Core.Interface.Router} router The application router.
	 * @param {Core.Interface.Dictionary} dictionary Localization phrases
	 *        dictionary.
	 * @param {Object<string, *>} settings  Application settings for the
	 *        current application environment.
	 */
	constructor(controller, metaManager, router, dictionary, settings) {
		super();

		/**
		 * The actual controller being decorated.
		 *
		 * @property _controller
		 * @private
		 * @type {Core.Interface.Controller}
		 */
		this._controller = controller;

		/**
		 * Meta attributes manager.
		 *
		 * @property _metaManager
		 * @private
		 * @type {Core.Interface.MetaManager}
		 */
		this._metaManager = metaManager;

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
		this._settings = settings;
	}

	/**
	 * Callback for initializing the controller with the route parameters.
	 *
	 * @inheritDoc
	 * @override
	 * @method init
	 */
	init() {
		this._controller.init();
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method destroy
	 */
	destroy() {
		this._controller.destroy();
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method activate
	 */
	activate() {
		this._controller.activate();
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method deactivate
	 */
	deactivate() {
		this._controller.deactivate();
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method load
	 * @return {Object<string, (Promise|*)>}
	 */
	load() {
		return this._controller.load();
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method update
	 * @param {Object<string, string>=} [params={}]
	 * @return {Object<string, (Promise|*)>}
	 */
	update(params = {}) {
		return this._controller.update(params);
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method setReactiveView
	 * @param {Vendor.React.Component} reactiveView
	 */
	setReactiveView(reactiveView) {
		this._controller.setReactiveView(reactiveView);
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method setState
	 * @param {Object<string, *>} state
	 */
	replaceState(state) {
		this._controller.replaceState(state);
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method patchState
	 * @param {Object<string, *>} statePatch
	 */
	setState(statePatch) {
		this._controller.setState(statePatch);
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getState
	 * @return {Object<string, *>}
	 */
	getState() {
		return this._controller.getState();
	}

	/**
	 * @inheritDoc
	 * @method setMetaParams
	 * @param {Object<string, *>} loadedResources
	 * @param {Core.Interface.MetaManager} metaManager
	 * @param {Core.Interface.Router} router
	 * @param {Core.Interface.Dictionary} dictionary
	 * @param {Object<string, *>} settings
	 */
	setMetaParams(loadedResources, metaManager, router, dictionary, settings) {
		this._controller.setMetaParams(
			loadedResources,
			this._metaManager,
			this._router,
			this._dictionary,
			this._settings
		);
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method setRouteParams
	 * @param {Object<string, string>=} [params={}]
	 */
	setRouteParams(params = {}) {
		this._controller.setRouteParams(params);
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getRouteParams
	 * @return {Object<string, string>}
	 */
	getRouteParams() {
		return this._controller.getRouteParams();
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method setStateManager
	 * @param {Core.Interface.PageStateManager|Null} stateManager
	 */
	setStateManager(stateManager) {
		this._controller.setStateManager(stateManager);
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method getHttpStatus
	 * @return {number}
	 */
	getHttpStatus() {
		return this._controller.getHttpStatus();
	}

	/**
	 * Returns the meta attributes manager to configured by this controller.
	 *
	 * @method getMetaManager
	 * @return {Core.Interface.MetaManager} meta attributes manager to
	 *         configured by this controller.
	 */
	getMetaManager() {
		return this._metaManager;
	}
}

ns.Core.Decorator.Controller = Controller;
