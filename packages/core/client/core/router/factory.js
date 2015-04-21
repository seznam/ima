import ns from 'imajs/client/core/namespace.js';
import oc from 'imajs/client/core/objectContainer.js';
import CoreError from 'imajs/client/core/coreError.js';

ns.namespace('Core.Router');

/**
 * Factory for router.
 *
 * @class Factory
 * @namespace Core.Router
 * @module Core
 * @submodule Core.Router
 */
class Factory {

	/**
	 * @method constructor
	 * @constructor
	 */
	constructor() {}

	/**
	 * Create new instance of Core.Router.Route.
	 *
	 * @method createRoute
	 * @param {string} name
	 * @param {string} pathExpression
	 * @param {string} controller
	 * @param {string} view
	 * @return {Core.Router.Route}
	 */
	createRoute(name, pathExpression, controller, view) {
		return oc.create('$Route', name, pathExpression, controller, view)
	}
}

ns.Core.Router.Factory = Factory;