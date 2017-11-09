import React from 'react';
import * as helpers from './componentHelpers';

/**
 * The base class for all view components.
 *
 * @abstract
 */
export default class AbstractComponent extends React.Component {
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
   * Returns the localized phrase identified by the specified key. The
   * placeholders in the localization phrase will be replaced by the provided
   * values.
   *
   * @param {string} key Localization key.
   * @param {Object<string, (number|string)>=} params Values for replacing
   *        the placeholders in the localization phrase.
   * @return {string} Localized phrase.
   */
  localize(key, params = {}) {
    return helpers.localize(this, key, params);
  }

  /**
   * Generates an absolute URL using the provided route name (see the
   * <code>app/config/routes.js</code> file). The provided parameters will
   * replace the placeholders in the route pattern, while the extraneous
   * parameters will be appended to the generated URL's query string.
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

  /**
   * Registers the provided event listener for execution whenever an IMA.js
   * DOM custom event of the specified name occurs at the specified event
   * target.
   *
   * @param {(React.Element|EventTarget)} eventTarget The react component or
   *        event target at which the listener should listen for the event.
   * @param {string} eventName The name of the event for which to listen.
   * @param {function(Event)} listener The listener for event to register.
   */
  listen(eventTarget, eventName, listener) {
    helpers.listen(this, eventTarget, eventName, listener);
  }

  /**
   * Deregisters the provided event listener for an IMA.js DOM custom event
   * of the specified name at the specified event target.
   *
   * @param {(React.Element|EventTarget)} eventTarget The react component or
   *        event target at which the listener should listen for the event.
   * @param {string} eventName The name of the event for which to listen.
   * @param {function(Event)} listener The listener for event to register.
   */
  unlisten(eventTarget, eventName, listener) {
    helpers.unlisten(this, eventTarget, eventName, listener);
  }
}
