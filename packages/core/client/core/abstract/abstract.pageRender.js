import ns from 'core/namespace/ns.js';

ns.namespace('Core.Abstract');

/**
 * Base class for implementations of the
 * {@codelink Core.Interface.PageRenderer} interface.
 *
 * @class PageRender
 * @implements Core.Interface.PageRender
 * @namespace Core.Abstract
 * @module Core
 * @submodule Core.Abstract
 *
 * @requires Vendor.Rsvp
 * @requires Vendor.React
 * @requires Core.Interface.Animate
 */
class PageRender extends ns.Core.Interface.PageRender {

	/**
	 * Initializes the abstract page renderer.
	 *
	 * @constructor
	 * @method constructor
	 * @param {Vendor.Rsvp} rsvp The RSVP implementation of Promise API and
	 *        helper methods.
	 * @param {Vendor.React} react React framework instance, will be used to
	 *        render the page.
	 * @param {Core.Interface.Animate} animate The client-side UI animation
	 *        helper.
	 * @param {Object<string, *>} settings Application settings for the current
	 *        application environment.
	 */
	constructor(rsvp, react, animate, settings) {
		super();

		/**
		 * The RSVP implementation of Promise API and helper methods.
		 *
		 * @property _rsvp
		 * @protected
		 * @type {Vendor.Rsvp}
		 */
		this._rsvp = rsvp;

		/**
		 * Rect framework instance, used to render the page.
		 *
		 * @property react
		 * @protected
		 * @type {Vendor.React}
		 */
		this._react = react;

		/**
		 * The client-side UI animation control helper.
		 *
		 * @property _animate
		 * @protected
		 * @type {Core.Interface.Animate}
		 */
		this._animate = animate;

		/**
		 * Application settings for the current application environment.
		 *
		 * @property _settings
		 * @protected
		 * @type {Object<string, *>}
		 */
		this._settings = settings;
	}

	/**
	 * Renders the page using the provided controller and parameters. The actual
	 * behavior of this method differs at the client and the at server in the
	 * following way:
	 *
	 * On server, the method renders the page to a string containing HTML markup
	 * to send to the client.
	 *
	 * On client, the method renders the page into DOM, re-using the DOM created
	 * from the HTML markup send by the server if possible.
	 *
	 * @override
	 * @method render
	 * @abstract
	 * @param {Core.Abstract.Controller} controller The page controller that
	 *        should have its view rendered.
	 * @param {Object<string, string>=} [params=null] The route parameters.
	 */
	render(controller, params = {}) { // jshint ignore:line
		throw new Error('The render() method is abstract and must be overridden');
	}

	/**
	 * Initializes the provided controller using the provided parameters.
	 *
	 * @method _initController
	 * @protected
	 * @param {Core.Abstract.Controller} controller The controller to initialize.
	 * @param {Object<string, *>=} [params={}] Parameters to use to initialize
	 *        the controller.
	 * @throws {Error} Thrown if the provided controller is not a valid
	 *         controller.
	 */
	_initController(controller, params = {}) {
		if (!controller) {
			throw new Error(`Core.Abstract.PageRender._initController(): The ` +
			`controller parameter is required`);
		}

		controller.init(params);
	}

	/**
	 * Creates a copy of the provided data map object that has the values of its
	 * fields wrapped into Promises.
	 *
	 * The the values that are already Promises will referenced directly without
	 * wrapping then into another Promise.
	 *
	 * @method _wrapEachKeyToPromise
	 * @protected
	 * @param {Object<string, *>} dataMap A map of data that should have its
	 *        values wrapped into Promises.
	 * @return {Object<string, Vendor.Rsvp.Promise>} A copy of the provided data
	 *         map that has all its values wrapped into promises.
	 */
	_wrapEachKeyToPromise(dataMap) {
		var Promise = this._rsvp.Promise;
		var copy = {};

		for (var field of Object.keys(dataMap)) {
			var value = dataMap[field];

			if (value instanceof Promise) {
				copy[field] = value;
			} else {
				copy[field] = Promise.resolve(value);
			}
		}

		return copy;
	}
}

ns.Core.Abstract.PageRender = PageRender;