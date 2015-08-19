import ns from 'imajs/client/core/namespace';

ns.namespace('Core.Router');

/**
 * Events constants, which is firing to app.
 *
 * @const
 */
const EVENTS = Object.freeze({
	/**
	 * Router fire event {@code $IMA.$Router.handleRoute} after page manager handle the route.
	 * Event's data contain {{response: Object<string, *>, params: Object<string, string>},
	 * route: ns.Core.Router.Route, path: string}. The {@code response} is page render result.
	 * The {@code path} is current path, the {@code params} are params extracted from path and
	 * the {@code route} is handle route for path.
	 *
	 * @const
	 * @property HANDLE_ROUTE
	 * @type {string}
	 */
	HANDLE_ROUTE: '$IMA.$Router.handleRoute'
});

export default EVENTS;

ns.Core.Router.EVENTS = EVENTS;
