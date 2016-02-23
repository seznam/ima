import ns from 'ima/namespace';

ns.namespace('ima.router');

/**
 * Utility factory used by router to create routes.
 *
 * @class RouteFactory
 * @namespace ima.router
 * @module ima
 * @submodule ima.router
 */
export default class RouteFactory {

	/**
	 * Initializes the factory.
	 *
	 * @constructor
	 * @method constructor
	 * @param {function(new: ima.router.Route)} Route The implementation of
	 *        the route representation to use.
	 */
	constructor(Route) {
		/**
		 * The implementation of the route representation to use.
		 *
		 * @private
		 * @property _Route
		 * @type {function(new: ima.router.Route)}
		 */
		this._Route = Route;
	}

	/**
	 * Create new instance of ima.router.Route.
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
	 * @return {ima.router.Route} The contructed route.
	 */
	createRoute(name, pathExpression, controller, view, options) {
		return new this._Route(
			name,
			pathExpression,
			controller,
			view,
			options
		);
	}
}

ns.ima.router.RouteFactory = RouteFactory;
