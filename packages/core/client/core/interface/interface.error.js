import ns from 'core/namespace/ns.js';

ns.namespace('Core.Interface');

/**
 * Error interface.
 *
 * @class Error
 * @namespace Core.Interface
 * @module Core
 * @submodule Core.Interface
 */
class Error {

	/**
	 * Return http status.
	 *
	 * @method getHttpStatus
	 */
	getHttpStatus() {
	}

	/**
	 * Return error params.
	 *
	 * @method getParams
	 */
	getParams() {
	}

	/**
	 * Return error name.
	 *
	 * @method getName
	 */
	getName() {
	}

	/**
	 * Convert to string.
	 *
	 * @method toString
	 */
	toString() {
	}

	/**
	 * Convert to source.
	 *
	 * @method toSource
	 */
	toSource() {
	}
}

ns.Core.Interface.Error = Error;