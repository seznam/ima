import ns from 'core/namespace/ns.js';

ns.namespace('Core.Dispatcher');

/**
 * Dispatcher for sending event.
 *
 * @class Handler
 * @extends ns.Core.Interface.Dispatcher
 * @namespace Core.Dispatcher
 * @module Core
 * @submodule Core.Dispatcher
 * */
class Handler extends ns.Core.Interface.Dispatcher {

	/**
	 * @method constructor
	 * @constructor
	 * @example
	 *      dispatcher.listen('event', handler, [this]);
	 *      dispatcher.fire('event', data);
	 *      dispatcher.unlisten('event', handler, [this]);
	 *      dispatcher.clear();
	 * */
	constructor() {
		super();

		/**
		 * @property _callbacks
		 * @private
		 * @type {Map}
		 * @default new Map()
		 * */
		this._callbacks = new Map();
	}

	/**
	 * Clear all events.
	 *
	 * @method clear
	 * @chainable
	 * */
	clear() {
		this._callbacks.clear();

		return this;
	}

	/**
	 * Listen handler for event.
	 *
	 * @method listen
	 * @chainable
	 * @param {String} event
	 * @param {Function} handler
	 * @param {Object} [scope]
	 * @return {this}
	 * */
	listen(event, handler, scope) {
		var listener = {
			handlers: [],
			scopes: []
		};

		if (typeof handler !== 'function') {
			throw ns.oc.create('$Error', `Core.Dispatcher.Handler:listen has undefined param handler. Your handler for event '${event}' is ${typeof handler}. Check your workflow.`,{event: event, handler: handler, scope: scope});
		}

		if (this._callbacks.has(event)) {
			listener = this._callbacks.get(event);
		}

		listener.handlers.push(handler);
		listener.scopes.push(scope);
		this._callbacks.set(event, listener);

		return this;
	}

	/**
	 * Unlisten handler for event.
	 *
	 * @method unlisten
	 * @chainable
	 * @param {String} event
	 * @param {Function} handler
	 * @param {Object} scope
	 * @return {this}
	 * */
	unlisten(event, handler, scope) {
		if (this._callbacks.has(event)) {
			var listener = this._callbacks.get(event);
			var indexForListener = listener.handlers.indexOf(handler);
			var isSameScope = listener.scopes[indexForListener] === scope;

			if (indexForListener !== -1 && isSameScope) {
				listener.handlers.splice(indexForListener, 1);
				listener.scopes.splice(indexForListener, 1);
				this._callbacks.set(event, listener);
			} else {
				throw ns.oc.create('$Error', `Core.Dispatcher.Handler:unlisten has undefined handler '${handler}' and scope '${scope}' for event '${event}' . Check your workflow.`,{event: event, handler: handler, scope: scope});
			}
		} else {
			throw ns.oc.create('$Error', `Core.Dispatcher.Handler:unlisten has undefined event '${event}' for handler '${handler}'. Check your workflow.`,{event: event, handler: handler, scope: scope});
		}

		return this;
	}

	/**
	 * Fire event with data.
	 *
	 * @method fire
	 * @chainable
	 * @param {String} event
	 * @param {Object} data
	 * @return {this}
	 * */
	fire(event, data) {
		if (this._callbacks.has(event)) {
			var listener = this._callbacks.get(event);

			for (var listenerKey = 0; listenerKey < listener.handlers.length; listenerKey++) {
				var handler = listener.handlers[listenerKey];
				var scope = listener.scopes[listenerKey];

				if (scope) {
					handler.bind(scope)(data);
				} else {
					handler(data);
				}

			}

		} else {
			throw ns.oc.create('$Error', `Core.Dispatcher.Handler:fire has undefined event '${event}' for data '${data}'. Check your workflow.`,{event: event, data: data});
		}

		return this;
	}
}

ns.Core.Dispatcher.Handler = Handler;