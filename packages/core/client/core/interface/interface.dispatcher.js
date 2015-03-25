import ns from 'core/namespace/ns.js';

ns.namespace('Core.Interface');

/**
 * Dispatcher interface.
 *
 * @class Dispatcher
 * @namespace Core.Interface
 * @module Core
 * @submodule Core.Interface
 */
class Dispatcher {

	/**
	 * Clear all events.
	 *
	 * @method clear
	 */
	clear() {
	}

	/**
	 * Listen handler for event.
	 *
	 * @method listen
	 */
	listen() {
	}

	/**
	 * Unlisten handler for event.
	 *
	 * @method unlisten
	 */
	unlisten() {
	}

	/**
	 * Fire event with data.
	 *
	 * @method fire
	 */
	fire() {
	}
}

ns.Core.Interface.Dispatcher = Dispatcher;