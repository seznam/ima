
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

const PRIVATE = {
	contextTypes: Symbol('contextTypes')
};
if (typeof $Debug !== 'undefined' && $Debug) {
	Object.freeze(PRIVATE);
}

/**
 * Retrieves the context type declarations for the specified component.
 *
 * @param {function(new: React.Component, ...*)} classConstructor The
 *        constructor of the react component.
 * @return {Object<string, function(...*): boolean>} The context type
 *         declarations associated with the specified component.
 */
export function getContextTypes(classConstructor) {
	if (classConstructor.hasOwnProperty(PRIVATE.contextTypes)) {
		return this[PRIVATE.contextTypes];
	}

	return {
		$Utils: PropTypes.object.isRequired
	};
}

/**
 * Overrides the previously associated context type declarations for the
 * specified component to the provided ones.
 *
 * @param {function(new: React.Component, ...*)} classConstructor The
 *        constructor of the react component.
 * @param {Object<string, function(...*): boolean>} contextTypes The new
 *        context type declarations to associate with the specified component.
 * @return {Object<string, function(...*): boolean>} The provided context type
 *         declarations.
 */
export function setContextTypes(classConstructor, contextTypes) {
	return classConstructor[PRIVATE.contextTypes] = contextTypes;
}

/**
 * Retrieves the view utilities from the component's current context or
 * properties (preferring the context).
 *
 * @param {Object<string, *>} props The component's current properties.
 * @param {Object<string, *>} context The component's current context.
 * @return {Object<string, *>} The retrieved view utilities.
 * @throws Error Throw if the view utils cannot be located in the provided
 *         properties nor context.
 */
export function getUtils(props, context) {
	const utils = context ? context.$Utils || props.$Utils : props.$Utils;

	if ($Debug && !utils) {
		throw new Error(
			'The component cannot access the view utils because they were ' +
			'not passed in the initial props or context as $Utils.'
		);
	}

	return utils;
}

/**
 * Returns the localized phrase identified by the specified key. The
 * placeholders in the localization phrase will be replaced by the provided
 * values.
 *
 * @param {(AbstractComponent|AbstractPureComponent)} component The component
 *        requiring the localization.
 * @param {string} key Localization key.
 * @param {Object<string, (number|string)>=} params Values for replacing the
 *        placeholders in the localization phrase.
 * @return {string} Localized phrase.
 */
export function localize(component, key, params) {
	return component.utils.$Dictionary.get(key, params);
}

/**
 * Generates an absolute URL using the provided route name (see the
 * <code>app/config/routes.js</code> file). The provided parameters will
 * replace the placeholders in the route pattern, while the extraneous
 * parameters will be appended to the generated URL's query string.
 *
 * @param {(AbstractComponent|AbstractPureComponent)} component The component
 *        requiring the generating of the URL.
 * @param {string} name The route name.
 * @param {Object<string, (number|string)>=} params Router parameters and
 *        extraneous parameters to add to the URL as a query string.
 * @return {string} The generated URL.
 */
export function link(component, name, params) {
	return component.utils.$Router.link(name, params);
}

/**
 * Generate a string of CSS classes from the properties of the passed-in
 * object that resolve to {@code true}.
 *
 * @example
 *        this.cssClasses('my-class my-class-modificator', true);
 * @example
 *        this.cssClasses({
 *            'my-class': true,
 *            'my-class-modificator': this.props.modificator
 *        }, true);
 * @param {(AbstractComponent|AbstractPureComponent)} component The component
 *        requiring the composition of the CSS class names.
 * @param {(string|Object<string, boolean>)} classRules CSS classes in a
 *        string separated by whitespace, or a map of CSS class names to
 *        boolean values. The CSS class name will be included in the result
 *        only if the value is {@code true}.
 * @param {boolean} includeComponentClassName
 * @return {string} String of CSS classes that had their property resolved
 *         to {@code true}.
 */
export function cssClasses(component, classRules, includeComponentClassName) {
	return component.utils.$CssClasses(
		classRules,
		includeComponentClassName && component
	);
}

/**
 * Generate a string of CSS classes from the properties of the passed-in
 * object that resolve to {@code true}.
 *
 * @param {(string|Object<string, boolean>)} classRules CSS classes in a
 *        string separated by whitespace, or a map of CSS class names to
 *        boolean values. The CSS class name will be included in the result
 *        only if the value is {@code true}.
 * @param {?(AbstractComponent|AbstractPureComponent)} component The component
 *        requiring the composition of the CSS class names, if it has the
 *        {@code className} property set and requires its inclusion this time.
 * @return {string} String of CSS classes that had their property resolved
 *         to {@code true}.
 */
export function defaultCssClasses(
	classRules, component
) {
	let extraClasses = component instanceof React.Component ?
		component.props.className
	:
		component;
	return classnames(
		classRules,
		extraClasses
	);
}

/**
 * Creates and sends a new IMA.js DOM custom event from the provided component.
 *
 * @param {(AbstractComponent|AbstractPureComponent)} component The component
 *        at which's root element the event will originate.
 * @param {string} eventName The name of the event.
 * @param {*=} data Data to send within the event.
 */
export function fire(component, eventName, data = null) {
	return component.utils.$EventBus.fire(
		ReactDOM.findDOMNode(component),
		eventName,
		data
	);
}

/**
 * Registers the provided event listener for execution whenever an IMA.js
 * DOM custom event of the specified name occurs at the specified event
 * target.
 *
 * @param {(AbstractComponent|AbstractPureComponent)} component The component
 *        requesting the registration of the event listener.
 * @param {(React.Element|EventTarget)} eventTarget The react component or
 *        event target at which the listener should listen for the event.
 * @param {string} eventName The name of the event for which to listen.
 * @param {function(Event)} listener The listener for event to register.
 */
export function listen(component, eventTarget, eventName, listener) {
	if (!eventTarget.addEventListener) { // Safari doesn't have EventTarget
		eventTarget = ReactDOM.findDOMNode(eventTarget);
	}

	return component.utils.$EventBus.listen(eventTarget, eventName, listener);
}

/**
 * Deregisters the provided event listener for an IMA.js DOM custom event
 * of the specified name at the specified event target.
 *
 * @param {(AbstractComponent|AbstractPureComponent)} component The component
 *        that requested the registration of the event listener.
 * @param {(React.Element|EventTarget)} eventTarget The react component or
 *        event target at which the listener should listen for the event.
 * @param {string} eventName The name of the event for which to listen.
 * @param {function(Event)} listener The listener for event to register.
 */
export function unlisten(component, eventTarget, eventName, listener) {
	if (!eventTarget.addEventListener) { // Safari doesn't have EventTarget
		eventTarget = ReactDOM.findDOMNode(eventTarget);
	}

	const eventBus = component.utils.$EventBus;
	return eventBus.unlisten(eventTarget, eventName, listener);
}
