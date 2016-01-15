import ns from 'imajs/client/core/namespace';
import AbstractPageManager from 'imajs/client/core/abstract/pageManager';

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
export default class Client extends AbstractPageManager {

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
	 * @inheritDoc
	 * @override
	 * @method manage
	 * @param {(string|function)} controller
	 * @param {(string|function)} view
	 * @param {{onlyUpdate: (boolean|function), autoScroll: boolean}} options
	 * @param {Object<string, string>=} [params={}]
	 * @return {Promise<Object<string, ?(number|string)>>}
	 */
	manage(controller, view, options, params = {}) {
		return (
			super
				.manage(controller, view, options, params)
				.then((response) => {
					this._activatePageSource();

					return response;
				})
		);
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method scrollTo
	 * @param {number} [x=0]
	 * @param {number} [y=0]
	 */
	scrollTo(x = 0, y = 0) {
		setTimeout(() => {
			this._window.scrollTo(x, y);
		}, 0);
	}

	/**
	 * @inheritDoc
	 * @override
	 * @method init
	 */
	init() {
		super.init();
		this._eventBus.listenAll(this._window.getWindow(), (e) => {
			this._onCustomEventHandler(e);
		});
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
		var { method, data, eventName } = this._parseCustomEvent(event);
		var controllerInstance = this._managedPage.controllerInstance;

		if (controllerInstance) {
			var handled = this._handleEventWithController(method, data);

			if (!handled) {
				handled = this._handleEventWithExtensions(method, data);
			}

			if ($Debug) {
				if (!handled) {
					console.warn(`The active controller has no listener for ` +
							`the encountered event '${eventName}'. Check ` +
							`your event name for typos, or create an ` +
							`'${method}' event listener method on the ` +
							`active controller or add an event listener ` +
							`that stops the propagation of this event to ` +
							`an ancestor component of the component that ` +
							`fired this event.`);
				}
			}
		}
	}

	/**
	 * Return parsed custom event as object with keys
	 * method, data and eventName.
	 *
	 * @private
	 * @method _parseCustomEvent
	 * @param {CustomEvent} event
	 * @return {Object<string, *>}	The parsed custom event.
	 */
	_parseCustomEvent(event) {
		var eventName = event.detail.eventName;
		var method = 'on' + eventName.charAt(0).toUpperCase() +
				eventName.slice(1);
		var data = event.detail.data;

		return { method, data, eventName };
	}

	/**
	 * Try handle event with controller. If event is handled by
	 * controller then return true else return false.
	 *
	 * @method _handleEventWithController
	 * @param {string} method
	 * @param {Object<string, *>} data
	 * @return {boolean}
	 */
	_handleEventWithController(method, data) {
		var controllerInstance = this._managedPage.controllerInstance;

		if (typeof controllerInstance[method] === 'function') {
			controllerInstance[method](data);

			return true;
		}

		return false;
	}

	/**
	 * Try handle event with extensions. If event is handled by
	 * extension then return true else return false.
	 *
	 * @method _handleEventWithExtensions
	 * @param {string} method
	 * @param {Object<string, *>} data
	 * @return {boolean}
	 */
	_handleEventWithExtensions(method, data) {
		var controllerInstance = this._managedPage.controllerInstance;
		var extensions = controllerInstance.getExtensions();

		for (var extension of extensions) {
			if (typeof extension[method] === 'function') {
				extension[method](data);

				return true;
			}
		}

		return false;
	}
}

ns.Core.Page.Manager.Client = Client;
