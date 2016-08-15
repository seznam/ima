import ns from '../namespace';
import Route from './Route';
import Controller from '../controller/Controller';
import AbstractDocumentView from '../page/AbstractDocumentView';

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
	 * @param {function(
	 *          new: Route,
	 *          string,
	 *          string,
	 *          string,
	 *          string,
	 *          Object
	 *        )} Route The implementation of the route
	 *        representation to use.
	 */
	constructor(Route) {
		/**
		 * The implementation of the route representation to use.
		 *
		 * @private
		 * @property _Route
		 * @type {function(new: Route, string, string, string, string, Object)}
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
	 * @param {{
	 *          onlyUpdate: (
	 *            boolean|
	 *            function(
	 *              (string|function(new: Controller, ...*)),
	 *              (string|function(
	 *                new: React.Component,
	 *                Object<string, *>,
	 *                ?Object<string, *>
	 *              ))
	 *            ): boolean
	 *          )=,
	 *          autoScroll: boolean=,
	 *          allowSPA: boolean=,
	 *          documentView: ?AbstractDocumentView=
	 *        }} options The route additional options.
	 * @return {Route} The constructed route.
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
