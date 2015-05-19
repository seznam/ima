import ns from 'imajs/client/core/namespace.js';
import IMAError from 'imajs/client/core/imaError.js';

ns.namespace('Core.Event');

/**
 * An empty immutable map of event listener to scopes, used for a mismatch in
 * the {@codelink _eventListeners} map.
 *
 * @property EMPTY_MAP
 * @const
 * @type {Map<function (*), Set<?Object>>}
 */
const EMPTY_MAP = Object.freeze(new Map());

/**
 * An empty immutable set of event listener scopes, used for a mismatch in the
 * {@codelink _eventListeners} map.
 *
 * @property EMPTY_SET
 * @const
 * @type {Set<?Object>}
 */
const EMPTY_SET = Object.freeze(new Set());

/**
 * Default implementation of the {@codelink Core.Interface.Dispatcher}
 * interface.
 *
 * @class Dispatcher
 * @implements ns.Core.Interface.Dispatcher
 * @namespace Core.Event
 * @module Core
 * @submodule Core.Event
 *
 * @requires Core.Interface.Storage
 */
class Dispatcher extends ns.Core.Interface.Dispatcher {
	/**
	 * Initializes the dispatcher.
	 *
	 * @constructor
	 * @method constructor
	 */
	constructor() {
		super();

		/**
		 * Map of event names to a map of event listeners to a set of scopes to
		 * which the event listener should be bound when being executed due to the
		 * event.
		 *
		 * @private
		 * @property _eventListeners
		 * @type {Map<string, Map<function(*), Set<?Object>>>}
		 */
		this._eventListeners = new Map();
	}

	/**
	 * Unregisters all event listeners currently registered with this dispatcher.
	 *
	 * @inheritdoc
	 * @override
	 * @chainable
	 * @method clear
	 * @return {Core.Interface.Dispatcher} This dispatcher.
	 */
	clear() {
		this._eventListeners.clear();

		return this;
	}

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
	 * @inheritdoc
	 * @override
	 * @chainable
	 * @method listen
	 * @param {string} event The name of the event to listen for.
	 * @param {function(*)} listener The event listener to register.
	 * @param {?Object=} scope The object to which the {@code this} keyword will
	 *        be bound in the event listener.
	 * @return {Core.Interface.Dispatcher} This dispatcher.
	 */
	listen(event, listener, scope = null) {
		if (!(listener instanceof Function)) {
			throw new IMAError(`The listener must be a function, ${listener} provided`);
		}

		var scopes = this._prepareScopesFor(event, listener);
		scopes.add(scope);

		return this;
	}

	/**
	 * Unregistered the provided event listener, so it will no longer be executed
	 * with the specified scope when the specified event is fired.
	 *
	 * @inheritdoc
	 * @override
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
	unlisten(event, listener, scope = null) {
		var scopes = this._getScopesOf(event, listener);

		if (!scopes.has(scope)) {
			throw new IMAError('Core.Event.Handler.unlisten(): the provided ' +
			`listener '${listener}' is not registered for the specified event ` +
			`'${event}' and scope '${scope}'. Check your workflow.`, {
				event: event,
				listener: listener,
				scope: scope
			});
		}

		scopes.delete(scope);
		if (!scopes.size) {
			var listenersToScopes = this._getListenersOf(event);
			listenersToScopes.delete(listener);

			if (!listenersToScopes.size) {
				this._eventListeners.delete(event);
			}
		}

		return this;
	}

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
	 * @inheritdoc
	 * @override
	 * @chainable
	 * @method fire
	 * @param {string} event The name of the event to fire.
	 * @param {*} data The data to pass to the event listeners.
	 * @return {Core.Interface.Dispatcher} This dispatcher.
	 * @throws {Error} Thrown if there is no event listener registered for the
	 *         specified event.
	 */
	fire(event, data) {
		var listenersToScopes = this._getListenersOf(event);

		if (!listenersToScopes.size) {
			throw new IMAError('There are no event listeners registered for the ' +
			`${event} event`, {
				event: event,
				data: data
			});
		}

		for (var [listener, scopes] of listenersToScopes) {
			for (var scope of scopes) {
				listener.bind(scope)(data);
			}
		}
	}

	/**
	 * Prepares the scopes in which the specified event listener should be
	 * executed for the specified event.
	 *
	 * @private
	 * @method _getScopesOf
	 * @param {string} event The name of the event.
	 * @param {function(*)} listener The event listener.
	 * @return {Set<?Object>} The scopes in which the specified listeners should
	 *         be executed in case of the specified event.
	 */
	_prepareScopesFor(event, listener) {
		var listenersToScopes = this._prepareListenersFor(event);

		if (!listenersToScopes.has(listener)) {
			var scopes = new Set();
			listenersToScopes.set(listener, scopes);
			return scopes;
		}

		return listenersToScopes.get(listener);
	}

	/**
	 * Retrieves the scopes in which the specified event listener should be
	 * executed for the specified event.
	 *
	 * @private
	 * @method _getScopesOf
	 * @param {string} event The name of the event.
	 * @param {function(*)} listener The event listener.
	 * @return {Set<?Object>} The scopes in which the specified listeners should
	 *         be executed in case of the specified event. The returned set is an
	 *         unmodifiable empty set if no listeners are registered for the
	 *         event.
	 */
	_getScopesOf(event, listener) {
		var listenersToScopes = this._getListenersOf(event);

		if (listenersToScopes.has(listener)) {
			return listenersToScopes.get(listener);
		}

		return EMPTY_SET;
	}

	/**
	 * Prepares a listeners to scopes map for listeners for the specified event.
	 * The method returns a previously created map for the same event if there
	 * already is one in the {@codelink _eventListeners} map. The method
	 * otherwise creates a new listeners to scopes map and addes it to the
	 * {@codelink _eventListeners} map before returning it.
	 *
	 * @private
	 * @method _prepareListenersFor
	 * @param {string} event The name of the event.
	 * @return {Map<function(*), Set<?Object>>} A map of event listeners to the
	 *         scopes in which they should be executed.
	 */
	_prepareListenersFor(event) {
		if (!this._eventListeners.has(event)) {
			var listeners = new Map();
			this._eventListeners.set(event, listeners);
			return listeners;
		}

		return this._eventListeners.get(event);
	}

	/**
	 * Retrieves the map of event listeners to scopes they are bound to.
	 *
	 * @private
	 * @method _getListenersOf
	 * @param {string} event The name of the event.
	 * @return {Map<function(*), Set<?Object>>} A map of event listeners to the
	 *         scopes in which they should be executed. The returned map is an
	 *         unmodifiable empty map if no listeners are registered for the
	 *         event.
	 */
	_getListenersOf(event) {
		if (this._eventListeners.has(event)) {
			return this._eventListeners.get(event);
		}

		return EMPTY_MAP;
	}
}

ns.Core.Event.Dispatcher = Dispatcher;
