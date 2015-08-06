import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Router');

/**
 * Events constants, which is firing to app.
 *
 * @const
 */
const EVENTS = Object.freeze({
	/**
	 * Router fire event {@code $IMA.$Router.routeHandle} after page manager handle the route.
	 * Event's data contain {{response: Object<string, *>, params: Object<string, string>},
	 * route: ns.Core.Router.Route, path: string}. The {@code response} is page render result.
	 * The {@code path} is current path, the {@code params} are params extracted from path and
	 * the {@code route} is handle route for path.
	 *
	 * @const
	 * @property ROUTE_HANDLE
	 * @type {string}
	 */
	ROUTE_HANDLE: '$IMA.$Router.routeHandle'
});

export default EVENTS;

ns.Core.Router.EVENTS = EVENTS;
