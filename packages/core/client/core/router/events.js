import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Router');

/**
 * Events constants, which is firing to app.
 *
 * @const
 */
const EVENTS = Object.freeze({
	/**
	 * Router fire change route event after router handle the route.
	 *
	 * @const
	 * @property ROUTE
	 * @type {string}
	 */
	CHANGE_ROUTE: '$IMA.$Router.changeRoute'
});

export default EVENTS;

ns.Core.Router.EVENTS = EVENTS;
