import ns from 'imajs/client/core/namespace.js';
import IMAError from 'imajs/client/core/imaError.js';

ns.namespace('Core.Event');

/**
 * Global name of IMA.js custom event.
 *
 * @property IMA_EVENT
 * @const
 * @type {string}
 */
const IMA_EVENT = '$IMA.CustomEvent';

/**
 * Helper for custom events.
 *
 * It offers public methods for firing custom events
 * and two methods for catching events (e.g. inside view components).
 *
 * @class Bus
 * @implements ns.Core.Interface.EventBus
 * @namespace Core.Event
 * @module Core
 * @submodule Core.Event
 */
class Bus extends ns.Core.Interface.EventBus {
	/**
	 * Initializes the custom event helper.
	 *
	 * @constructor
	 * @method constructor
	 */
	constructor(window) {
		super();

		/**
		 * @property _window
		 * @private
		 * @type {Core.Interface.Window}
		 * @default window
		 */
		this._window = window;
	}

	/**
	 * Fires a new custom event of the specified name, carrying the provided data.
	 *
	 * Note that this method does not prevent the event listeners to modify the
	 * data in any way. The order in which the event listeners will be executed
	 * is unspecified and should not be relied upon.
	 *
	 * Note that default options of eventInit are { bubbles: true, cancelable: true },
	 * that are different like default values in native CustomEvents ({ bubbles: false, cancelable: false }).
	 *
	 * @inheritDoc
	 * @override
	 * @chainable
	 * @method fire
	 * @param {EventTarget} eventSource The event source dispatching event (e.g. element/document/window).
	 * @param {string} eventName The name of the event to fire.
	 * @param {*} data The data to pass to the event listeners.
	 * @param {Object=} [options={}] Using options could be define or override an EventInit dictionary options too.
	 *								 Options of eventInit are { bubbles: true, cancelable: true } by default.
	 *								 For more info see: https://developer.mozilla.org/en-US/docs/Web/API/Event/Event
	 * @return {Core.Event.Bus} This custom event bus.
	 * @throws {Error} Thrown if there is no event source defined.
	 */
	fire(eventSource, eventName, data, options = {}) {
		if (this._window.isClient()) {
			var eventInit = {};
			var params = {detail: {eventName, data}};
			var defaultOptions = {bubbles: true, cancelable: true};
			Object.assign(eventInit, defaultOptions, options, params);

			var e = new CustomEvent(IMA_EVENT, eventInit);

			if (eventSource && typeof eventSource.dispatchEvent !== 'undefined') {
				eventSource.dispatchEvent(e);
			} else {
				throw new IMAError(`Core.Event.Bus.fire: The EventSource ${eventSource} is not defined or ` +
						`can not dispatch event '${eventName}' (data: ${data}).`,
						{eventSource, eventName, data, eventInit});
			}
		}

		return this;
	}

	/**
	 * Registers the provided event listener to be executed when the any
	 * custom event is fired.
	 *
	 * When the specified event is fired, the event listener will be executed
	 * with the event passed as the first argument.
	 *
	 * The order in which the event listeners will be executed is unspecified and
	 * should not be relied upon.
	 *
	 * @inheritDoc
	 * @override
	 * @chainable
	 * @method listen
	 * @param {EventTarget} eventTarget The event target listining for all events.
	 * @param {function(<CustomEvent>)} listener The event listener to register.
	 * @return {Core.Event.Bus} This custom event bus.
	 */
	listenAll(eventTarget, listener) {
		this._window.bindEventListener(eventTarget, IMA_EVENT, listener);

		return this;
	}

	/**
	 * Registers the provided event listener to be executed when the specific
	 * custom event is fired.
	 *
	 * When the specified event is fired, the event listener will be executed
	 * with the event passed as the first argument.
	 *
	 * The order in which the event listeners will be executed is unspecified and
	 * should not be relied upon.
	 *
	 * @inheritDoc
	 * @override
	 * @chainable
	 * @method listen
	 * @param {EventTarget} eventTarget The event target listining for specific event.
	 * @param {string} eventName The name of the event to listen for.
	 * @param {function(<CustomEvent>)} listener The event listener to register.
	 * @return {Core.Event.Bus} This custom event bus.
	 */
	listen(eventTarget, eventName, listener) {
		this._window.bindEventListener(eventTarget, IMA_EVENT, (e) => {
			if (e.detail.eventName === eventName) {
				listener(e);
			}
		});

		return this;
	}
}

ns.Core.Event.Bus = Bus;
