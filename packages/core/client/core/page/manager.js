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
export default class Manager extends ns.Core.Interface.PageManager {

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
		 * @private
		 * @property _pageFactory
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
		 * @private
		 * @property _stateManager
		 * @type {Core.Interface.PageStateManager}
		 * @default stateManager
		 */
		this._stateManager = stateManager;

		/**
		 * @private
		 * @property _window
		 * @type {Core.Interface.Window}
		 * @default window
		 */
		this._window = window;

		/**
		 * @private
		 * @property _eventBus
		 * @type {Core.Interface.EventBus}
		 * @default eventBus
		 */
		this._eventBus = eventBus;

		/**
		 * @private
		 * @property _lastManagedPage
		 * @type {Object<string, *>}
		 */
		this._lastManagedPage = {
			controller: null,
			controllerInstance: null,
			decoratedController: null,
			view: null,
			viewInstance: null,
			options: null,
			params: null
		};

	}

	/**
	 * Manager controller with params.
	 *
	 * @inheritDoc
	 * @override
	 * @method manage
	 * @param {string|function} controller
	 * @param {string|function} view
	 * @param {{onlyUpdate: boolean}} options
	 * @param {Object<string, string>=} [params={}] The route parameters.
	 * @return {Promise}
	 */
	manage(controller, view, options, params = {}) {
		this._preManage(options);

		if (this._hasOnlyUpdate(controller, view, options)) {
			return this._updateController(this._lastManagedPage.decoratedController, params);
		}

		var controllerInstance = this._pageFactory.createController(controller);
		var decoratedController = this._pageFactory.decorateController(controllerInstance);
		var viewInstance = this._pageFactory.createView(view);

		this._destroyController(this._lastManagedPage.controllerInstance);
		this._initController(controllerInstance, params);
		this._lastManagedPage = {
			controller,
			controllerInstance,
			decoratedController,
			view,
			viewInstance,
			options,
			params
		};

		return (
			this._pageRender
				.mount(decoratedController, viewInstance)
				.then((response) => {
					this._postManage(options);

					return response;
				})
		);
	}

	/**
	 * Scroll page to defined vertical and horizontal values.
	 *
	 * Scrolling is async.
	 *
	 * @inheritDoc
	 * @override
	 * @method scrollTo
	 * @param {number} [x=0] x is the pixel along the horizontal axis of the document
	 * @param {number} [y=0] y is the pixel along the vertical axis of the document
	 */
	scrollTo(x = 0, y = 0) {
		setTimeout(() => {
			this._window.scrollTo(x, y);
		}, 0);
	}

	/**
	 * Initialization manager.
	 *
	 * @inheritDoc
	 * @override
	 * @method init
	 */
	init() {
		this._lastManagedPage = {
			controller: null,
			controllerInstance: null,
			decoratedController: null,
			view: null,
			viewInstance: null,
			options: null,
			params: null
		};

		this._stateManager.onChange = (newState) => this._onChangeStateHandler(newState);
		this._eventBus.listenAll(this._window.getWindow(), (e) => this._onCustomEventHandler(e));
	}

	/**
	 * Initializes the provided controller using the provided parameters.
	 *
	 * @private
	 * @method _initController
	 * @param {Core.Abstract.Controller} controller The controller to initialize.
	 * @param {Object<string, *>=} params Parameters to use to initialize
	 *        the controller.
	 */
	_initController(controller, params) {
		controller.setRouteParams(params);
		controller.setStateManager(this._stateManager);
		controller.init();
	}

	/**
	 * Update current page controller.
	 *
	 * @method _updateController
	 * @param {Core.Decorator.Controller} controller The controller to update.
	 * @param {Object<string, *>=} params Parameters to use to update
	 *        the controller.
	 * @return {Promise}
	 */
	_updateController(controller, params) {
		var lastRouteParams = controller.getRouteParams();

		controller.setRouteParams(params);

		return (
			this._pageRender
				.update(controller, lastRouteParams)
				.then((response) => {
					this._postManage(options);

					return response;
				})
		);
	}

	/**
	 * Destroy current page controller.
	 *
	 * @private
	 * @method _destroyController
	 */
	_destroyController() {
		var controllerInstance = this._lastManagedPage.controllerInstance;

		if (controllerInstance) {
			controllerInstance.destroy();
			controllerInstance.setStateManager(null);
			this._pageRender.unmount();
			this._lastManagedPage.controllerInstance = null;
		}
	}

	/**
	 * On change handler for state.
	 *
	 * @private
	 * @method _onChangeStateHandler
	 */
	_onChangeStateHandler(state) {
		if (this._lastManagedPage.controllerInstance) {
			this._pageRender.setState(state);
		}
	}

	/**
	 * On custom event handler.
	 *
	 * It calls listener in the active controller. Name of listener is defined by prefix 'on' and event name.
	 * If event name is 'toggle', listener should be 'onToggle'.
	 *
	 * @private
	 * @method _onCustomEventHandler
	 * @param {CustomEvent} event
	 */
	_onCustomEventHandler(event) {
		var eventName = event.detail.eventName;
		var onEventName = 'on' + eventName.charAt(0).toUpperCase() + eventName.slice(1);
		var eventData = event.detail.data;
		var controllerInstance = this._lastManagedPage.controllerInstance;

		if (controllerInstance) {

			if (typeof controllerInstance[onEventName] === 'function') {
				controllerInstance[onEventName](eventData);
			} else {
				console.warn(`The active controller has no listener for the encountered` +
						` event '${eventName}'. Check your event name for typos, or` +
						` create an '${onEventName}' event listener method on the active` +
						` controller or add an event listener that stops the propagation` +
						` of this event to an ancestor component of the component that fired this event.`);
			}
		}
	}

	/**
	 * Return true if manager has to update last managed controller and view.
	 *
	 * @private
	 * @method _hasOnlyUpdate
	 * @param {string|function} controller
	 * @param {string|function} view
	 * @param {{onlyUpdate: boolean}} options
	 * @return {boolean}
	 */
	_hasOnlyUpdate(controller, view, options) {
		return options.onlyUpdate &&
				this._lastManagedPage.controller === controller &&
				this._lastManagedPage.view === view;
	}

	/**
	 * Make defined instruction as scroll for current page options before than
	 * change page.
	 *
	 * @private
	 * @method _preManage
	 * @param {{onlyUpdate: boolean, autoScroll: boolean}} options
	 */
	_preManage(options) {
		if (options.autoScroll) {
			this.scrollTo();
		}
	}

	/**
	 * Make defined instruction for current page options after that
	 * changed page.
	 *
	 * @private
	 * @method _postManage
	 * @param {{onlyUpdate: boolean, autoScroll: boolean}} options
	 */
	_postManage(options) {}

}

ns.Core.Page.Manager = Manager;
