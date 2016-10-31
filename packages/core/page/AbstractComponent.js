import React from 'react';
import ReactDOM from 'react-dom';
import ns from '../namespace';

ns.namespace('ima.page');

const PRIVATE = Object.freeze({
	contextTypes: Symbol('contextTypes')
});

/**
 * The base class for all view components.
 *
 * @abstract
 */
export default class AbstractComponent extends React.Component {

	static get contextTypes() {
		if (this.hasOwnProperty(PRIVATE.contextTypes)) {
			return this[PRIVATE.contextTypes];
		}

		return {
			$Utils: React.PropTypes.object
		};
	}

	static set contextTypes(contextTypes) {
		this[PRIVATE.contextTypes] = contextTypes;
	}

	/**
	 * Initializes the constructor.
	 *
	 * @param {Object<string, *>} props The component properties.
	 * @param {Object<string, *>} context The component context.
	 */
	constructor(props, context) {
		super(props, context);

		/**
		 * The view utilities.
		 *
		 * @type {Object<string, *>}
		 */
		this._utils = context ? context.$Utils || props.$Utils : props.$Utils;
	}

	/**
	 * Returns the utilities for the view components. The returned value is the
	 * value bound to the {@code $Utils} object container constant.
	 *
	 * @return {Object<string, *>} The utilities for the view components.
	 */
	get utils() {
		if ($Debug) {
			if (!this._utils) {
				throw new Error(
					'You cannot access the view utils because they were not ' +
					'passed in the initial props or context as $Utils.'
				);
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
	 * @example
	 *        this.cssClasses('my-class my-class-modificator', true);
	 * @example
	 *        this.cssClasses({
	 *            'my-class': true,
	 *            'my-class-modificator': this.props.modificator
	 *        }, true);
	 *
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
			let separatedClassNames = classRules.split(/\s+/);
			classRules = {};

			for (let className of separatedClassNames) {
				classRules[className] = true;
			}
		}

		if (!(classRules instanceof Object)) {
			throw new Error(
				'The class rules must be specified as a plain object, ' +
				`${classRules} provided`
			);
		}

		if (includeComponentClassName) {
			let propClassNames = this.props.className;
			if (propClassNames) {
				let separatedPropClassNames = propClassNames.split(/\s+/);
				let classNamesMap = {};

				for (let propClassName of separatedPropClassNames) {
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
	 * Deregisters the provided event listener for an IMA.js DOM custom event
	 * of the specified name at the specified event target.
	 *
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

ns.ima.page.AbstractComponent = AbstractComponent;
