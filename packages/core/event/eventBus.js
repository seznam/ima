import ns from 'ima/namespace';

ns.namespace('Ima.Event');

/**
 * Utility for sending and intercepting wrapped custom DOM events on the DOM or
 * propagating them to the current controller.
 *
 * As with native events, the event fired by this event bus always propagate up
 * the DOM tree until they reach the window.
 *
 * Note that the events fired by this event bus are wrapped in custom DOM
 * events which always bear an obscure name set by the implementation of this
 * interface, preventing custom event name collisions, and allowing observation
 * and capture of all fired events. The actual event name is always consistent
 * by the implementation.
 *
 * @interface EventBus
 * @namespace Ima.Event
 * @module Ima
 * @submodule Ima.Event
 */
export default class EventBus {

	/**
	 * Fires a new custom event of the specified name, carrying the provided
	 * data.
	 *
	 * Note that this method does not prevent the event listeners to modify the
	 * data in any way. The order in which the event listeners will be executed
	 * is unspecified and should not be relied upon.
	 *
	 * Note that the default options are
	 * {@code { bubbles: true, cancelable: true }}, which is different from the
	 * default values used in the native custom events
	 * ({@code { bubbles: false, cancelable: false }}).
	 *
	 * @method fire
	 * @param {EventTarget} eventTarget The event target at which the event
	 *        will be  dispatched (e.g. element/document/window).
	 * @param {string} eventName The name of the event to fire.
	 * @param {*} data The data to pass to the event listeners.
	 * @param {{bubbles: boolean=, cancelable: boolean=}=} [options={}] The
	 *        override of the default options passed to the constructor of the
	 *        custom event fired by this event bus.
	 *        The default options passed to the custom event constructor are
	 *        {@code { bubbles: true, cancelable: true }}.
	 * @return {Ima.Event.EventBus} This custom event bus.
	 * @throws {Error} Thrown if the provided event target cannot be used to
	 *         fire the event.
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/Event/Event
	 */
	fire(eventTarget, eventName, data, options = {}) {}

	/**
	 * Registers the provided event listener to be executed when any custom
	 * event is fired using the same implementation of the event bus and passes
	 * through the specified event target.
	 *
	 * When the specified event is fired, the event listener will be executed
	 * with the event passed as the first argument.
	 *
	 * The order in which the event listeners will be executed is unspecified
	 * and should not be relied upon.
	 *
	 * @method listen
	 * @param {EventTarget} eventTarget The event target at which the listener
	 *        should listen for all event bus events.
	 * @param {function(<CustomEvent>)} listener The event listener to
	 *        register.
	 * @return {Ima.Event.EventBus} This event bus.
	 */
	listenAll(eventTarget, listener) {}

	/**
	 * Registers the provided event listener to be executed when the specific
	 * custom event is fired by the same implementation of the event bus and
	 * passes through the specified event target.
	 *
	 * When the specified event is fired, the event listener will be executed
	 * with the event passed as the first argument.
	 *
	 * The order in which the event listeners will be executed is unspecified
	 * and should not be relied upon.
	 *
	 * @method listen
	 * @param {EventTarget} eventTarget The event target at which the listener
	 *        should listen for the specified event.
	 * @param {string} eventName The name of the event to listen for.
	 * @param {function(<CustomEvent>)} listener The event listener to
	 *        register.
	 * @return {Ima.Event.EventBus} This event bus.
	 */
	listen(eventTarget, eventName, listener) {}

	/**
	 * Removes the provided event listener from the set of event listeners
	 * executed when the any custom event fired by the same implementation
	 * passes through the specified event target.
	 *
	 * The method has no effect if the listener is not registered at the
	 * specified event target.
	 *
	 * @chainable
	 * @method unlistenAll
	 * @param {EventTarget} eventTarget The event target at which the event
	 *        listener listens for events.
	 * @param {function(<CustomEvent>)} listener The event listener to
	 *        deregister.
	 * @return {Ima.Event.EventBus} This event bus.
	 */
	unlistenAll(eventTarget, listener) {}

	/**
	 * Removes the provided event listener from the set of event listeners
	 * executed when the specified custom event fired by the same
	 * implementation passes through the specified event target.
	 *
	 * The method has no effect if the listener is not registered for the
	 * specified event at the specified event target.
	 *
	 * @method unlisten
	 * @param {EventTarget} eventTarget The event target at which the listener
	 *        is listening for the event.
	 * @param {string} eventName The name of the event listened for.
	 * @param {function(<CustomEvent>)} listener The event listener to
	 *        deregister.
	 * @return {Ima.Event.EventBus} This event bus.
	 */
	unlisten(eventTarget, eventName, listener) {}
}

ns.Ima.Event.EventBus = EventBus;
