import { PureComponent, ContextType, createRef } from 'react';

import * as helpers from '../componentHelpers';
import PageContext from '../PageContext';
import { Utils } from '../types';

/**
 * The base class for all view components.
 */
export default abstract class AbstractPureComponent extends PureComponent {
  static contextType = PageContext;
  declare context: ContextType<typeof PageContext>;

  eventBusRef = createRef();

  private _utils?: Utils;

  /**
   * Returns the utilities for the view components. The returned value is the
   * value bound to the {@code $Utils} object container constant.
   *
   * @return The utilities for the view components.
   */
  get utils(): Utils {
    if (!this._utils) {
      this._utils = helpers.getUtils(this.props, this.context);
    }

    return this._utils as Utils;
  }

  /**
   * Returns the localized phrase identified by the specified key. The
   * placeholders in the localization phrase will be replaced by the provided
   * values.
   *
   * @param key Localization key.
   * @param params Values for replacing
   *        the placeholders in the localization phrase.
   * @return Localized phrase.
   */
  localize(key: string, params: { [key: string]: string | number } = {}) {
    return helpers.localize(this, key, params);
  }

  /**
   * Generates an absolute URL using the provided route name (see the
   * <code>app/config/routes.js</code> file). The provided parameters will
   * replace the placeholders in the route pattern, while the extraneous
   * parameters will be appended to the generated URL's query string.
   *
   * @param name The route name.
   * @param params Router parameters and
   *        extraneous parameters to add to the URL as a query string.
   * @return The generated URL.
   */
  link(name: string, params: { [key: string]: string | number } = {}) {
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
   * @param classRules CSS classes in a
   *        string separated by whitespace, or a map of CSS class names to
   *        boolean values. The CSS class name will be included in the result
   *        only if the value is {@code true}.
   * @param includeComponentClassName
   * @return String of CSS classes that had their property resolved
   *         to {@code true}.
   */
  cssClasses(
    classRules: string | { [key: string]: boolean },
    includeComponentClassName = false
  ) {
    return helpers.cssClasses(this, classRules, includeComponentClassName);
  }

  /**
   * Creates and sends a new IMA.js DOM custom event from this component.
   *
   * @param eventName The name of the event.
   * @param data Data to send within the event.
   */
  fire(eventName: string, data = undefined) {
    helpers.fire(this, eventName, data);
  }

  /**
   * Registers the provided event listener for execution whenever an IMA.js
   * DOM custom event of the specified name occurs at the specified event
   * target.
   *
   * @param eventTarget The react component or
   *        event target at which the listener should listen for the event.
   * @param eventName The name of the event for which to listen.
   * @param listener The listener for event to register.
   */
  listen(
    eventTarget: EventTarget,
    eventName: string,
    listener: (event: Event) => void
  ) {
    helpers.listen(this, eventTarget, eventName, listener);
  }

  /**
   * Deregisters the provided event listener for an IMA.js DOM custom event
   * of the specified name at the specified event target.
   *
   * @param eventTarget The react component or
   *        event target at which the listener should listen for the event.
   * @param eventName The name of the event for which to listen.
   * @param listener The listener for event to register.
   */
  unlisten(
    eventTarget: EventTarget,
    eventName: string,
    listener: (event: Event) => void
  ) {
    helpers.unlisten(this, eventTarget, eventName, listener);
  }
}