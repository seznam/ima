import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Event');

/**
 * Helper for custom events. It offers public methods for firing custom events
 * and catching events inside view components. It includes private method for 
 * calling functions of the active controller.
 *
 * @class EventBus
 * @namespace Core.Interface
 * @module Core
 * @submodule Core.Interface
 */
class EventBus {
	/**
	 * Fires a new custom event of the specified name, carrying the provided data.
	 *
	 * The method will synchronously execute all event listeners registered for
	 * the specified event, passing the provided data to them in arguments.
	 *
	 * Note that this method does not prevent the event listeners to modify the
	 * data in any way. The order in which the event listeners will be executed
	 * is unspecified and should not be relied upon.
	 *
	 * @method fire
	 * @chainable
	 * @param {string} element The event dispatching element.
	 * @param {string} eventName The name of the event to fire.
	 * @param {*} data The data to pass to the event listeners.
	 * @param {Object=} [options={}] Is an EventInit dictionary. 
	 *		(See: https://developer.mozilla.org/en-US/docs/Web/API/Event/Event)
	 * @return {Core.Event.Custom} This custom event helper.
	 * @throws {Error} Thrown if there is no document defined.
	 */
	fire(element, eventName, data, options = {}) {}

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
	 * @chainable
	 * @method listen
	 * @param {document|window|element|eventTarget} eventTarget The event target listining for all events.
	 * @param {function(*)} listener The event listener to register.
	 
	 */
	listenAll(eventTarget, listener) {}

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
	 * @chainable
	 * @method listen
	 * @param {eventTarget} eventTarget The event target listining for specific event.
	 * @param {string} eventName The name of the event to listen for.
	 * @param {function(*)} listener The event listener to register.
	 
	 */
	listen(eventTarget, eventName, listener) {}
}

ns.Core.Interface.EventBus = EventBus;