import ns from 'core/namespace/ns.js';

ns.namespace('Core.Interface');

/**
 * Error interface.
 *
 * @class Error
 * @namespace Core.Interface
 * @module Core
 * @submodule Core.Interface
 * */
class Error {

	/**
	 * Return http status.
	 *
	 * @method getHttpStatus
	 * @return {Number}
	 * */
	getHttpStatus() {

	}

	/**
	 * Return error params.
	 *
	 * @method getParams
	 * @return {Object}
	 * */
	getParams() {

	}

	/**
	 * Return error name.
	 *
	 * @method getName
	 * @return {String}
	 * */
	getName() {

	}

	/**
	 * Convert to string.
	 *
	 * @method toString
	 * @return {String}
	 * */
	toString() {

	}

	/**
	 * Convert to source.
	 *
	 * @method toSource
	 * @return {String}
	 * */
	toSource() {

	}
}

ns.Core.Interface.Error = Error;