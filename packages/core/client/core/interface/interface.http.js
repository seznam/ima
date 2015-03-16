import ns from 'core/namespace/ns.js';

ns.namespace('Core.Interface');

/**
 * Interface for http handler.
 *
 * @class Http
 * @namespace Core.Interface
 * @module Core
 * @submodule Core.Interface
 */
class Http {

	/**
	 * Return data from api for GET request.
	 *
	 * @method get
	 */
	get() {

	}

	/**
	 * Return data from api for POST request.
	 *
	 * @method post
	 */
	post() {

	}

	/**
	 * Return data from api for PUT request.
	 *
	 * @method put
	 */
	put() {

	}

	/**
	 * Return data from api for PATCH request.
	 *
	 * @method patch
	 * */
	patch() {

	}

	/**
	 * Return data from api for DELETE request.
	 *
	 * @method delete
	 * */
	delete() {

	}

	/**
	 * Return cache key.
	 *
	 * @method getCacheKey
	 */
	getCacheKey() {

	}

	/**
	 * Set constant header to all request.
	 *
	 * @method setConstantHeader
	 */
	setConstantHeader() {

	}


	/**
	 * Clear constant header to all request.
	 *
	 * @method clearConstantHeader
	 */
	clearConstantHeader() {

	}

}

ns.Core.Interface.Http = Http;
