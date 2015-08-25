import ns from 'imajs/client/core/namespace';

ns.namespace('Core.Abstract');

/**
 * The base class for all view components.
 *
 * @abstract
 * @class Component
 * @namespace Core.Abstract
 * @module Core
 * @submodule Core.Abstract
 */
export default class Component extends ns.Vendor.React.Component {

	/**
	 * @constructor
	 * @method constructor
	 * @param {Object<string, *>} props
	 */
	constructor(props) {
		super(props);

		/**
		 * @private
		 * @property _utils
		 * @type {Object<string, *>}
		 */
		this._utils = props.$Utils;

		/**
		 * @public
		 * @property className
		 * @type {string}
		 */
		this.className = props.className ? ' ' + props.className + ' ' : '';
	}

	/**
	 * Returns the utilities for the view components. The returned value is the
	 * value bound to the {@code $Utils} object container constant.
	 *
	 * @method get utils
	 * @return {Object<string, *>} The utilities for the view components.
	 */
	get utils() {
		if ($Debug) {
			if (!this._utils) {
				throw new Error('You cannot access view utils because they were ' +
						'not passed in the initial props as key name $Utils.');
			}
		}

		return this._utils;
	}

	/**
	 * Finds and returns the DOM node representing the specified React
	 * component.
	 *
	 * Note that this method can be used only at the client-side.
	 *
	 * @method findDOMNode
	 * @param {React.Component} component
	 * @return {?HTMLElement} The DOM node representing the specified React
	 *         component, or {@code null} if no such node was found.
	 */
	findDOMNode(component = this) {
		return ns.Vendor.React.findDOMNode(component);
	}

	/**
	 * Returns localize string for defined key. Method replace params in string
	 * with value of params.
	 *
	 * @method localize
	 * @param {string} key Localization key
	 * @param {Object<string, (number|string)>=} params Params for replacement
	 * @return {string} localize string
	 */
	localize(key, params = {}) {
		return this._utils.$Dictionary.get(key, params);
	}

	/**
	 * Returns URL for route name. Method replace params in route with defined params.
	 * Routes is defined in {@code /app/config/routes.js}.
	 *
	 * @method link
	 * @param {string} name Route name
	 * @param {Object<string, (number|string)>=} params Params for replacement
	 * @return {string}
	 */
	link(name, params = {}) {
		return this._utils.$Router.link(name, params);
	}

	/**
	 * Generate string of CSS classes, which have set value to true.
	 *
	 * @method cssClasses
	 * @param {Object<string, boolean>} classRules Map of CSS classes with boolean values.
	 * @return {string} string of CSS classes
	 */
	cssClasses(classRules) {
		if (!(classRules instanceof Object)) {
			throw new Error('The class rules must be specified as a plain ' +
					`object, ${classRules} provided`);
		}

		return Object
			.keys(classRules)
			.filter((cssClassName) => {
				return classRules[cssClassName];
			})
			.join(' ');
	}

	/**
	 * Create and send new IMA.js DOM Custom event from this component.
	 *
	 * @method fire
	 * @param {string} eventName Name of event
	 * @param {*=} data Data for event
	 */
	fire(eventName, data = null) {
		this._utils.$EventBus.fire(this.findDOMNode(), eventName, data);
	}

	/**
	 * Add listener for defined IMA.js DOM Custom event.
	 *
	 * @method listen
	 * @param {(ReactElement|EventTarget)} eventTarget Element for add
	 *        event listener
	 * @param {string} eventName Name of event which is listen
	 * @param {function(Event)} listener Listener for event
	 */
	listen(eventTarget, eventName, listener) {
		if (!eventTarget.addEventListener) { // Safari doesn't know EventTarget
			eventTarget = this.findDOMNode(eventTarget);
		}

		this._utils.$EventBus.listen(eventTarget, eventName, listener);
	}
}

ns.Core.Abstract.Component = Component;
