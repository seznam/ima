import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Interface');

/**
 * A Dispatcher is a utility that manager event listeners registered for events
 * and allows distributing (firing) events to the listeners registered for the
 * given event.
 *
 * @interface Dispatcher
 * @namespace Core.Interface
 * @module Core
 * @submodule Core.Interface
 */
export default class Dispatcher {
	/**
	 * Unregisters all event listeners currently registered with this dispatcher.
	 *
	 * @chainable
	 * @method clear
	 * @return {Core.Interface.Dispatcher} This dispatcher.
	 */
	clear() {}

	/**
	 * Registers the provided event listener to be executed when the specified
	 * event is fired on this dispatcher.
	 *
	 * When the specified event is fired, the event listener will be executed
	 * with the data passed with the event as the first argument.
	 *
	 * The order in which the event listeners will be executed is unspecified and
	 * should not be relied upon. Registering the same listener for the same
	 * event and with the same scope multiple times has no effect.
	 *
	 * @chainable
	 * @method listen
	 * @param {string} event The name of the event to listen for.
	 * @param {function(*)} listener The event listener to register.
	 * @param {?Object=} scope The object to which the {@code this} keyword will
	 *        be bound in the event listener.
	 * @return {Core.Interface.Dispatcher} This dispatcher.
	 */
	listen(event, listener, scope = null) {}

	/**
	 * Unregistered the provided event listener, so it will no longer be executed
	 * with the specified scope when the specified event is fired.
	 *
	 * @chainable
	 * @method unlisten
	 * @param {string} event The name of the event for which the listener should
	 *        be unregistered.
	 * @param {function(*)} listener The event listener to unregister.
	 * @param {?Object=} scope The object to which the {@code this} keyword would
	 *        be bound in the event listener
	 * @return {Core.Interface.Dispatcher} This dispatcher.
	 * @throws {Error} Thrown if there is no such listener registered.
	 */
	unlisten(event, listener, scope = null) {}

	/**
	 * Fires a new event of the specified name, carrying the provided data.
	 *
	 * The method will synchronously execute all event listeners registered for
	 * the specified event, passing the provided data to them in arguments.
	 *
	 * Note that this method does not prevent the event listeners to modify the
	 * data in any way. The order in which the event listeners will be executed
	 * is unspecified and should not be relied upon.
	 *
	 * @chainable
	 * @method fire
	 * @param {string} event The name of the event to fire.
	 * @param {*} data The data to pass to the event listeners.
	 * @return {Core.Interface.Dispatcher} This dispatcher.
	 * @throws {Error} Thrown if there is no event listener registered for the
	 *         specified event.
	 */
	fire(event, data) {}
}

ns.Core.Interface.Dispatcher = Dispatcher;
