import ns from '../namespace';

ns.namespace('ima.router');

/**
 * Events constants, which is firing to app.
 *
 * @enum {string}
 */
const Events = Object.freeze({
	/**
	 * Router fire event {@code $IMA.$Router.beforeHandleRoute} before page
	 * manager handle the route. Event's data contain
	 * {@code { params: Object<string, string>}, route: ima.router.Route,
	 * path: string, options: Object<string, *>}}. The {@code path} is current
	 * path, the {@code params} are params extracted from path, the
	 * {@code route} is handle route for path and the {@code options} is route
	 * additional options.
	 *
	 * @const
	 * @type {string}
	 */
	BEFORE_HANDLE_ROUTE: '$IMA.$Router.beforeHandleRoute',

	/**
	 * Router fire event {@code $IMA.$Router.afterHandleRoute} after page
	 * manager handle the route. Event's data contain
	 * {@code {response: Object<string, *>, params: Object<string, string>},
	 * route: ima.router.Route, path: string, options: Object<string, *>}}.
	 * The {@code response} is page render result. The {@code path} is current
	 * path, the {@code params} are params extracted from path, the
	 * {@code route} is handle route for path and the {@code options} is route
	 * additional options.
	 *
	 * @const
	 * @type {string}
	 */
	AFTER_HANDLE_ROUTE: '$IMA.$Router.afterHandleRoute'
});

export default Events;

ns.ima.router.Events = Events;
