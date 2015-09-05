import ns from 'imajs/client/core/namespace';
import IMAError from 'imajs/client/core/imaError';

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
 * @implements Core.Interface.EventBus
 * @namespace Core.Event
 * @module Core
 * @submodule Core.Event
 */
export default class Bus extends ns.Core.Interface.EventBus {
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

		/**
		 * Map of listeners provided to the public API of this event bus to a
		 * map of event targets to a map of event names to actual listeners
		 * bound to the native API.
		 *
		 * The "listen all" event listeners are not registered in this map.
		 *
		 * @property _listeners
		 * @private
		 * @type {WeakMap<function(Event), WeakMap<EventTarget, Map<string, function(Event)>>>}
		 */
		this._listeners = new WeakMap();

		/**
		 * Map of event targets to listeners executed on all IMA.js event bus
		 * events.
		 *
		 * @property _allEventListeners
		 * @private
		 * @type {WeakMap<EventTarget, WeakSet<function(Event)>>}
		 */
		this._allEventListeners = new WeakMap();
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
		var eventInit = {};
		var params = { detail: { eventName, data } };
		var defaultOptions = { bubbles: true, cancelable: true };
		Object.assign(eventInit, defaultOptions, options, params);

		var e = this._window.createCustomEvent(IMA_EVENT, eventInit);

		if (eventSource && typeof eventSource.dispatchEvent !== 'undefined') {
			eventSource.dispatchEvent(e);
		} else {
			throw new IMAError(`Core.Event.Bus.fire: The EventSource ${eventSource} is not defined or ` +
					`can not dispatch event '${eventName}' (data: ${data}).`,
					{ eventSource, eventName, data, eventInit });
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
	 * @method listenAll
	 * @param {EventTarget} eventTarget The event target listining for all events.
	 * @param {function(<CustomEvent>)} listener The event listener to register.
	 * @return {Core.Event.Bus} This custom event bus.
	 */
	listenAll(eventTarget, listener) {
		this._window.bindEventListener(eventTarget, IMA_EVENT, listener);

		if (!this._allEventListeners.has(eventTarget)) {
			this._allEventListeners.set(eventTarget, new WeakSet());
		}
		this._allEventListeners.get(eventTarget).add(listener);

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
		if (!this._listeners.has(listener)) {
			this._listeners.set(listener, new WeakMap());
		}

		var targetToEventName = this._listeners.get(listener);
		if (!targetToEventName.has(eventTarget)) {
			targetToEventName.set(eventTarget, new Map());
		}

		var eventNameToNativeListener = targetToEventName.get(eventTarget);
		var nativeListener = (e) => {
			if (e.detail.eventName === eventName) {
				listener(e);
			}
		};
		eventNameToNativeListener.set(eventName, nativeListener);

		this._window.bindEventListener(eventTarget, IMA_EVENT, nativeListener);

		return this;
	}

	/**
	 * Removes the provided event listener from the set of event listeners
	 * executed when the any event bus event occurs at the specified event
	 * target.
	 *
	 * The method has no effect if the listener is not registered at the
	 * specified event target.
	 *
	 * @inheritDoc
	 * @override
	 * @chainable
	 * @method unlistenAll
	 * @param {EventTarget} eventTarget The event target listening for specific
	 *        event.
	 * @param {function(<CustomEvent>)} listener The event listener to
	 *        unregister.
	 * @return {Core.Event.Bus} This custom event bus.
	 */
	unlistenAll(eventTarget, listener) {
		this._window.unbindEventListener(eventTarget, IMA_EVENT, listener);

		var listenerRegistered =
				this._allEventListeners.has(eventTarget) &&
				this._allEventListeners.get(eventTarget).has(listener);
		if (listenerRegistered) {
			this._allEventListeners.get(eventTarget).delete(listener);
		}

		if ($Debug) {
			if (!listenerRegistered) {
				console.warn('The provided listener is not registered on ' +
						'the specified event target');
			}
		}

		return this;
	}

	/**
	 * Removes the provided event listener from the set of event listeners
	 * executed when the specified event occurs at the specified event target.
	 *
	 * The method has no effect if the listener is not registered for the
	 * specified event at the specified event target.
	 *
	 * @inheritDoc
	 * @override
	 * @chainable
	 * @method unlisten
	 * @param {EventTarget} eventTarget The event target listening for specific
	 *        event.
	 * @param {string} eventName The name of the event listened for.
	 * @param {function(<CustomEvent>)} listener The event listener to
	 *        unregister.
	 * @return {Core.Event.Bus} This custom event bus.
	 */
	unlisten(eventTarget, eventName, listener) {
		if (!this._listeners.has(listener)) {
			if ($Debug) {
				console.warn('The provided listener is not bound to listen ' +
						'for the specified event on the specified event ' +
						'target');
			}

			return this;
		}

		var targets = this._listeners.get(listener);
		if (!targets.has(eventTarget)) {
			if ($Debug) {
				console.warn('The provided listener is not bound to listen ' +
					'for the specified event on the specified event ' +
					'target');
			}

			return this;
		}

		var eventNameToNativeListener = targets.get(eventTarget);
		if (!eventNameToNativeListener.has(eventName)) {
			if ($Debug) {
				console.warn('The provided listener is not bound to listen ' +
					'for the specified event on the specified event ' +
					'target');
			}

			return this;
		}

		var nativeListener = eventNameToNativeListener.get(eventName);
		this._window.unbindEventListener(
			eventTarget,
			IMA_EVENT,
			nativeListener
		);

		eventNameToNativeListener.delete(eventName);
		if (eventNameToNativeListener.size) {
			return this;
		}

		targets.delete(eventTarget);

		return this;
	}
}

ns.Core.Event.Bus = Bus;
