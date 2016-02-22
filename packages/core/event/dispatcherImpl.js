import ns from 'ima/namespace';
import IMAError from 'ima/imaError';
import DispatcherInterface from 'ima/event/dispatcher';

ns.namespace('Ima.Event');

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
 * Default implementation of the {@codelink Ima.Event.Dispatcher}
 * interface.
 *
 * @class DispatcherImpl
 * @implements Ima.Event.Dispatcher
 * @namespace Ima.Event
 * @module Ima
 * @submodule Ima.Event
 */
export default class DispatcherImpl extends DispatcherInterface {
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
		 * which the event listener should be bound when being executed due to
		 * the event.
		 *
		 * @private
		 * @property _eventListeners
		 * @type {Map<string, Map<function(*), Set<?Object>>>}
		 */
		this._eventListeners = new Map();
	}

	/**
	 * @inheritdoc
	 * @method clear
	 */
	clear() {
		this._eventListeners.clear();

		return this;
	}

	/**
	 * @inheritdoc
	 * @method listen
	 */
	listen(event, listener, scope = null) {
		if ($Debug) {
			if (!(listener instanceof Function)) {
				throw new IMAError(`The listener must be a function, ` +
						`${listener} provided.`);
			}
		}

		if (!this._eventListeners.has(event)) {
			this._createNewEvent(event);
		}
		var listeners = this._getListenersOf(event);

		if (!listeners.has(listener)) {
			this._createNewListener(event, listener);
		}
		this._getScopesOf(event, listener).add(scope);

		return this;
	}

	/**
	 * @inheritdoc
	 * @method unlisten
	 */
	unlisten(event, listener, scope = null) {
		var scopes = this._getScopesOf(event, listener);

		if ($Debug) {
			if (!scopes.has(scope)) {
				console.warn('Ima.Event.DispatcherImpl.unlisten(): the ' +
						`provided listener '${listener}' is not registered ` +
						`for the specified event '${event}' and scope ` +
						`'${scope}'. Check your workflow.`, {
							event: event,
							listener: listener,
							scope: scope
						});
			}
		}

		scopes.delete(scope);
		if (!scopes.size) {
			var listeners = this._getListenersOf(event);
			listeners.delete(listener);

			if (!listeners.size) {
				this._eventListeners.delete(event);
			}
		}

		return this;
	}

	/**
	 * @inheritdoc
	 * @method fire
	 */
	fire(event, data, imaInternalEvent = false) {
		var listeners = this._getListenersOf(event);

		if (!listeners.size && !imaInternalEvent) {
			console.warn('There are no event listeners registered for the ' +
					`${event} event`, {
						event: event,
						data: data
					});
		}

		for (var [listener, scopes] of listeners) {
			for (var scope of scopes) {
				listener.bind(scope)(data);
			}
		}

		return this;
	}

	/**
	 * Create new Map storage of listeners for the specified event.
	 *
	 * @private
	 * @method _createNewEvent
	 * @param {string} event The name of the event.
	 */
	_createNewEvent(event) {
		var listeners = new Map();
		this._eventListeners.set(event, listeners);
	}

	/**
	 * Create new Set storage of scopes for the specified event and listener.
	 *
	 * @private
	 * @method _createNewListener
	 * @param {string} event The name of the event.
	 * @param {function(*)} listener The event listener.
	 */
	_createNewListener(event, listener) {
		var scopes = new Set();
		this._eventListeners.get(event).set(listener, scopes);
	}

	/**
	 * Retrieves the scopes in which the specified event listener should be
	 * executed for the specified event.
	 *
	 * @private
	 * @method _getScopesOf
	 * @param {string} event The name of the event.
	 * @param {function(*)} listener The event listener.
	 * @return {Set<?Object>} The scopes in which the specified listeners
	 *         should be executed in case of the specified event. The returned
	 *         set is an unmodifiable empty set if no listeners are registered
	 *         for the event.
	 */
	_getScopesOf(event, listener) {
		var listenersToScopes = this._getListenersOf(event);

		if (listenersToScopes.has(listener)) {
			return listenersToScopes.get(listener);
		}

		return EMPTY_SET;
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

ns.Ima.Event.DispatcherImpl = DispatcherImpl;
