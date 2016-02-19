import ns from 'ima/core/namespace';

ns.namespace('Core.Router');

/**
 * Events constants, which is firing to app.
 *
 * @const
 */
const EVENTS = Object.freeze({
	/**
	 * Router fire event {@code $IMA.$Router.preHandleRoute} before page
	 * manager handle the route. Event's data contain
	 * {@code { params: Object<string, string>}, route: ns.Core.Router.Route,
	 * path: string, options: Object<string, *>}}. The {@code path} is current
	 * path, the {@code params} are params extracted from path, the
	 * {@code route} is handle route for path and the {@code options} is route
	 * additional options.
	 *
	 * @const
	 * @property BEFORE_HANDLE_ROUTE
	 * @type {string}
	 */
	BEFORE_HANDLE_ROUTE: '$IMA.$Router.beforeHandleRoute',

	/**
	 * Router fire event {@code $IMA.$Router.postHandleRoute} after page
	 * manager handle the route. Event's data contain
	 * {@code {response: Object<string, *>, params: Object<string, string>},
	 * route: ns.Core.Router.Route, path: string, options: Object<string, *>}}.
	 * The {@code response} is page render result. The {@code path} is current
	 * path, the {@code params} are params extracted from path, the
	 * {@code route} is handle route for path and the {@code options} is route
	 * additional options.
	 *
	 * @const
	 * @property AFTER_HANDLE_ROUTE
	 * @type {string}
	 */
	AFTER_HANDLE_ROUTE: '$IMA.$Router.afterHandleRoute'
});

export default EVENTS;

ns.Core.Router.EVENTS = EVENTS;
