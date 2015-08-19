import ns from 'imajs/client/core/namespace';

ns.namespace('Core.Router');

/**
 * Utility factory used by router to create routes.
 *
 * @class Factory
 * @namespace Core.Router
 * @module Core
 * @submodule Core.Router
 */
export default class Factory {

	/**
	 * Initializes the factory.
	 *
	 * @constructor
	 * @method constructor
	 * @param {function(new: Core.Router.Route)} Route The implementation of the
	 *        route representation to use.
	 */
	constructor(Route) {
		/**
		 * The implementation of the route representation to use.
		 *
		 * @private
		 * @property _Route
		 * @type {function(new: Core.Router.Route)}
		 */
		this._Route = Route;
	}

	/**
	 * Create new instance of Core.Router.Route.
	 *
	 * @method createRoute
	 * @param {string} name The unique name of this route, identifying it among
	 *        the rest of the routes in the application.
	 * @param {string} pathExpression A path expression specifying the URL path
	 *        part matching this route (must not contain a query string),
	 *        optionally containing named parameter placeholders specified as
	 *        {@code :parameterName}.
	 * @param {string} controller The full name of Object Container alias
	 *        identifying the controller associated with this route.
	 * @param {string} view The full name or Object Container alias identifying
	 *        the view class associated with this route.
	 * @param {Object<string, *>=} [options] The route additional options.
	 * @return {Core.Router.Route} The contructed route.
	 */
	createRoute(name, pathExpression, controller, view, options) {
		return new this._Route(name, pathExpression, controller, view, options);
	}
}

ns.Core.Router.Factory = Factory;
