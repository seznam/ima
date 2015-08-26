import ns from 'imajs/client/core/namespace';

ns.namespace('Core.Page.Manager');

/**
 * Page manager for controller on the client side.
 *
 * @class Client
 * @implements Core.Abstract.PageManager
 * @namespace Core.Page.Manager
 * @module Core
 * @submodule Core.Page
 */
export default class Client extends ns.Core.Abstract.PageManager {

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
		super(pageFactory, pageRender, stateManager);

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
	}

	/**
	 * Manager controller with params.
	 *
	 * @inheritDoc
	 * @override
	 * @method manage
	 * @param {(string|function)} controller
	 * @param {(string|function)} view
	 * @param {{onlyUpdate: (boolean|function), autoScroll: boolean}} options
	 * @param {Object<string, string>=} [params={}] The route parameters.
	 * @return {Promise<Object<string, ?(number|string)>>}
	 */
	manage(controller, view, options, params = {}) {
		return (
			super
				.manage(controller, view, options, params)
				.then((response) => {
					this._activateController();

					return response;
				})
		)
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
		super.init();
		this._eventBus.listenAll(this._window.getWindow(), (e) => this._onCustomEventHandler(e));
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
		var controllerInstance = this._managedPage.controllerInstance;

		if (controllerInstance) {

			if (typeof controllerInstance[onEventName] === 'function') {
				controllerInstance[onEventName](eventData);
			} else {

				if ($Debug) {
					console.warn(`The active controller has no listener for the encountered` +
							` event '${eventName}'. Check your event name for typos, or` +
							` create an '${onEventName}' event listener method on the active` +
							` controller or add an event listener that stops the propagation` +
							` of this event to an ancestor component of the component that fired this event.`);
				}

			}
		}
	}
}

ns.Core.Page.Manager.Client = Client;
