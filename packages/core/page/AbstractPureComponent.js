import React from 'react';
import * as helpers from './componentHelpers';

/**
 * The base class for all pure (state-less) view components.
 *
 * @abstract
 */
export default class AbstractPureComponent extends React.PureComponent {

	static get contextTypes() {
		return helpers.getContextTypes(this);
	}

	static set contextTypes(contextTypes) {
		helpers.setContextTypes(this, contextTypes);
	}

	/**
	 * Initializes the component.
	 *
	 * @param {Object<string, *>} props The component properties.
	 * @param {Object<string, *>} context The component context.
	 */
	constructor(props, context) {
		super(props, context);

		/**
		 * The view utilities, initialized lazily upon first use from either
		 * the context, or the component's props.
		 *
		 * @type {?Object<string, *>}
		 */
		this._utils = null;
	}

	/**
	 * Returns the utilities for the view components. The returned value is the
	 * value bound to the {@code $Utils} object container constant.
	 *
	 * @return {Object<string, *>} The utilities for the view components.
	 */
	get utils() {
		if (!this._utils) {
			this._utils = helpers.getUtils(this.props, this.context);
		}

		return this._utils;
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
		return helpers.localize(this, key, params);
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
		return helpers.link(this, name, params);
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
		return helpers.cssClasses(this, classRules, includeComponentClassName);
	}

	/**
	 * Creates and sends a new IMA.js DOM custom event from this component.
	 *
	 * @param {string} eventName The name of the event.
	 * @param {*=} data Data to send within the event.
	 */
	fire(eventName, data = null) {
		helpers.fire(this, eventName, data);
	}
}
