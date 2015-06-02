import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Page');

/**
 * Page manager for controller.
 *
 * @class Manager
 * @implements Core.Interface.PageManager
 * @namespace Core.Page
 * @module Core
 * @submodule Core.Page
 */
class Manager extends ns.Core.Interface.PageManager {

	/**
	 * @method constructor
	 * @constructor
	 * @param {Core.Page.Factory} pageFactory
	 * @param {Core.Interface.PageRender} pageRender
	 * @param {Core.Interface.PageStateManager} stateManager
	 * @param {Core.Interface.Window} window
	 * @param {Core.Interface.EventBus} eventBus
	 */
	constructor(pageFactory, pageRender, stateManager, window, eventBus) {
		super();

		/**
		 * @property _pageFactory
		 * @private
		 * @type {Core.Page.Factory}
		 * @default pageFactory
		 */
		this._pageFactory = pageFactory;

		/**
		 * @property _pageRender
		 * @private
		 * @type {Core.Abstract.PageRender}
		 * @default pageRender
		 */
		this._pageRender = pageRender;

		/**
		 * @property _stateManager
		 * @private
		 * @type {Core.Interface.PageStateManager}
		 * @default stateManager
		 */
		this._stateManager = stateManager;

		/**
		 * @property _window
		 * @private
		 * @type {Core.Interface.Window}
		 * @default window
		 */
		this._window = window;

		/**
		 * @property _eventBus
		 * @private
		 * @type {Core.Interface.EventBus}
		 * @default eventBus
		 */
		this._eventBus = eventBus;

		/**
		 * @property _activeController
		 * @private
		 * @type {Core.Abstract.Controller}
		 * @default null
		 */
		this._activeController = null;
	}

	/**
	 * Manager controller with params.
	 *
	 * @method run
	 * @param {string} controller
	 * @param {string} view
	 * @param {Object<string, string>=} [params={}] The route parameters.
	 * @return {Promise}
	 */
	manage(controller, view, params = {}) {
		var controllerInstance = this._pageFactory.createController(controller);
		var decoratedController = this._pageFactory.decorateController(controllerInstance);
		var viewInstance = this._pageFactory.createView(view);

		this._destroyActiveController();
		this._initController(controllerInstance, params);

		return this._pageRender.mount(decoratedController, viewInstance);
	}

	/**
	 * Initialization manager.
	 *
	 * @method init
	 */
	init() {
		this._activeController = null;
		this._stateManager.onChange = (newState) => this._onChangeStateHandler(newState);
		this._eventBus.listenAll(this._window.getWindow(), (e) => this._onCustomEventHandler(e));
	}

	/**
	 * Initializes the provided controller using the provided parameters.
	 *
	 * @method _initController
	 * @private
	 * @param {Core.Abstract.Controller} controller The controller to initialize.
	 * @param {Object<string, *>=} params Parameters to use to initialize
	 *        the controller.
	 */
	_initController(controller, params) {
		controller.setRouteParams(params);
		controller.setStateManager(this._stateManager);
		controller.init();
		this._activeController = controller;
	}

	/**
	 * Destroy active controller.
	 *
	 * @method _destroyActiveController
	 * @private
	 */
	_destroyActiveController() {
		if (this._activeController) {
			this._activeController.destroy();
			this._activeController.setStateManager(null);
			this._pageRender.unmount();
			this._activeController = null;
		}
	}

	/**
	 * On change handler for state.
	 *
	 * @method _onChangeStateHandler
	 * @private
	 */
	_onChangeStateHandler(state) {
		if (this._activeController) {
			this._pageRender.setState(state);
		}
	}

	/**
	 * On custom event handler.
	 *
	 * It calls listener in the active controller. Name of listener is defined by prefix 'on' and event name.
	 * If event name is 'toggle', listener should be 'onToggle'.
	 *
	 * @method _onCustomEventHandler
	 * @private
	 * @param {CustomEvent} event
	 */
	_onCustomEventHandler(event) {
		var eventName = event.detail.eventName;
		var onEventName = 'on' + eventName.charAt(0).toUpperCase() + eventName.slice(1);
		var eventData = event.detail.data;

		if (this._activeController) {

			if (typeof this._activeController[onEventName] === 'function') {
				this._activeController[onEventName](eventData);
			} else {
				console.warn(`The active controller has no listener for the encountered` +
						` event '${eventName}'. Check your event name for typos, or` +
						` create an '${onEventName}' event listener method on the active` +
						` controller or add an event listener that stops the propagation` +
						` of this event to an ancestor component of the component that fired this event.`);
			}
		}
	}


}

ns.Core.Page.Manager = Manager;
