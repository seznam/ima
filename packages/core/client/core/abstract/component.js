import ns from 'imajs/client/core/namespace';
import { React, ReactDOM } from 'app/vendor';

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
export default class Component extends React.Component {

	/**
	 * Initializes the constructor.
	 *
	 * @constructor
	 * @method constructor
	 * @param {Object<string, *>} props The component properties.
	 * @param {Object<string, *>} context The component context.
	 */
	constructor(props, context) {
		super(props, context);

		/**
		 * The view utilities.
		 *
		 * @private
		 * @property _utils
		 * @type {Object<string, *>}
		 */
		this._utils = context ? context.$Utils || props.$Utils : props.$Utils;
	}

	/**
	 * Returns the utilities for the view components. The returned value is the
	 * value bound to the {@code $Utils} object container constant.
	 *
	 * @property utils
	 * @return {Object<string, *>} The utilities for the view components.
	 */
	get utils() {
		if ($Debug) {
			if (!this._utils) {
				throw new Error('You cannot access view utils because they ' +
						'were not passed in the initial props or context as key name ' +
						'$Utils.');
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
		return ReactDOM.findDOMNode(component);
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
	 * Returns URL for route name. Method replace params in route with defined
	 * params. Routes is defined in {@code /app/config/routes.js}.
	 *
	 * @method link
	 * @param {string} name The route name.
	 * @param {Object<string, (number|string)>=} params Router parameters and
	 *        extraneous parameters to add to the URL as a query string.
	 * @return {string} The generated URL.
	 */
	link(name, params = {}) {
		return this._utils.$Router.link(name, params);
	}

	/**
	 * Generate a string of CSS classes from the properties of the passed-in
	 * object that resolve to true.
	 *
	 * @method cssClasses
	 * @param {(string|Object<string, boolean>)} classRules CSS classes in a
	 *        string separated by whitespace, or a map of CSS class names to
	 *        boolean values. The CSS class name will be included in the result
	 *        only if the value is {@code true}.
	 * @param {boolean} includeComponentClassName
	 * @return {string} String of CSS classes that had their property resolved
	 *         to {@code true}.
	 */
	cssClasses(classRules, includeComponentClassName = false) {
		if (typeof classRules === 'string') {
			var  separatedClassNames = classRules.split(/\s+/);
			classRules = {};

			for (var className of separatedClassNames) {
				classRules[className] = true;
			}
		}

		if (!(classRules instanceof Object)) {
			throw new Error('The class rules must be specified as a plain ' +
					`object, ${classRules} provided`);
		}

		if (includeComponentClassName) {
			var propClassNames = this.props.className;
			if (propClassNames) {
				var separatedPropClassNames = propClassNames.split(/\s+/);
				var classNamesMap = {};

				for (var propClassName of separatedPropClassNames) {
					classNamesMap[propClassName] = true;
				}

				classRules = Object.assign({}, classRules, classNamesMap);
			}
		}

		return Object
			.keys(classRules)
			.filter((cssClassName) => {
				return classRules[cssClassName];
			})
			.join(' ');
	}

	/**
	 * Creates and sends a new IMA.js DOM custom event from this component.
	 *
	 * @method fire
	 * @param {string} eventName The name of the event.
	 * @param {*=} data Data to send within the event.
	 */
	fire(eventName, data = null) {
		this._utils.$EventBus.fire(this.findDOMNode(), eventName, data);
	}

	/**
	 * Registers the provided event listener for execution whenever an IMA.js
	 * DOM custom event of the specified name occurs at the specified event
	 * target.
	 *
	 * @method listen
	 * @param {(ReactElement|EventTarget)} eventTarget The react component or
	 *        event target at which the listener should listen for the event.
	 * @param {string} eventName The name of the event for which to listen.
	 * @param {function(Event)} listener The listener for event to register.
	 */
	listen(eventTarget, eventName, listener) {
		if (!eventTarget.addEventListener) { // Safari doesn't have EventTarget
			eventTarget = this.findDOMNode(eventTarget);
		}

		this._utils.$EventBus.listen(eventTarget, eventName, listener);
	}

	/**
	 * Unregisters the provided event listener for an IMA.js DOM custom event
	 * of the specified name at the specified event target.
	 *
	 * @method unlisten
	 * @param {(ReactElement|EventTarget)} eventTarget The react component or
	 *        event target at which the listener should listen for the event.
	 * @param {string} eventName The name of the event for which to listen.
	 * @param {function(Event)} listener The listener for event to register.
	 */
	unlisten(eventTarget, eventName, listener) {
		if (!eventTarget.addEventListener) { // Safari doesn't have EventTarget
			eventTarget = this.findDOMNode(eventTarget);
		}

		this._utils.$EventBus.unlisten(eventTarget, eventName, listener);
	}
}

Component.contextTypes = {
	$Utils: React.PropTypes.object
};

ns.Core.Abstract.Component = Component;
