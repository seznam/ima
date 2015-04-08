import ns from 'core/namespace/ns.js';

ns.namespace('Core.Interface');

/**
 * Interface for router.
 *
 * @class Router
 * @namespace Core.Interface
 * @module Core
 * @submodule Core.Interface
 */
class Router {

	/**
	 * Initialization router.
	 *
	 * @method init
	 */
	init() {
	}

	/**
	 * Clear all setting in router.
	 *
	 * @method clear
	 */
	clear() {
	}

	/**
	 * Add route to router.
	 *
	 * @method add
	 */
	add() {
	}

	/**
	 * Remove path from router.
	 *
	 * @method remove
	 */
	remove() {
	}

	/**
	 * Ruturns current path.
	 *
	 * @method getPath
	 */
	getPath() {
	}

	/**
	 * Returns current url.
	 *
	 * @method getUrl
	 */
	getUrl() {
	}

	/**
	 * Returns domain
	 *
	 * @method getDomain
	 */
	getDomain() {
	}

	/**
	 * Returns root path.
	 *
	 * @method getRoot
	 */
	getRoot() {
	}

	/**
	 * Returns language part path.
	 *
	 * @method getLanguagePartPath
	 */
	getLanguagePartPath() {
	}

	/**
	 * Returns web protocol.
	 *
	 * @method getProtocol
	 */
	getProtocol() {
	}


	/**
	 * Attach event to window.
	 *
	 * @method listen
	 */
	listen() {
	}

	/**
	 * Redirect to url.
	 *
	 * @method redirect
	 */
	redirect() {
	}

	/**
	 * Return link for route's name with params.
	 *
	 * @method link
	 */
	link() {
	}

	/**
	 * Handle path by router.
	 *
	 * @method route
	 */
	route() {
	}

	/**
	 * Handle Error that call 'error' controller with params.
	 *
	 * @method handleError
	 */
	handleError() {
	}

}

ns.Core.Interface.Router = Router;