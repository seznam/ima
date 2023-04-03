import type { Utils, DictionaryMap } from '@ima/core';
import { PureComponent, ContextType } from 'react';

import * as helpers from '../componentHelpers';
import { PageContext } from '../PageContext';

/**
 * The base class for all view components.
 */
export abstract class AbstractPureComponent<
  P = unknown,
  S = unknown,
  SS = unknown
> extends PureComponent<P, S, SS> {
  static contextType = PageContext;
  declare context: ContextType<typeof PageContext>;

  private _utils?: Utils;

  /**
   * Returns the utilities for the view components. The returned value is the
   * value bound to the `$Utils` object container constant.
   *
   * @return The utilities for the view components.
   */
  get utils(): Utils {
    if (!this._utils) {
      this._utils = helpers.getUtils(this.props, this.context);
    }

    return this._utils!;
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
  localize(
    key: keyof DictionaryMap,
    params: { [key: string]: string | number } = {}
  ): string {
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
  link(name: string, params: { [key: string]: string } = {}): string {
    return helpers.link(this, name, params);
  }

  /**
   * Generate a string of CSS classes from the properties of the passed-in
   * object that resolve to true.
   *
   * @example
   *        this.cssClasses('my-class my-class-modifier', true);
   * @example
   *        this.cssClasses({
   *            'my-class': true,
   *            'my-class-modifier': this.props.modifier
   *        }, true);
   *
   * @param classRules CSS classes in a
   *        string separated by whitespace, or a map of CSS class names to
   *        boolean values. The CSS class name will be included in the result
   *        only if the value is `true`.
   * @param includeComponentClassName
   * @return String of CSS classes that had their property resolved
   *         to `true`.
   */
  cssClasses(
    classRules: string | { [key: string]: boolean },
    includeComponentClassName = false
  ): string {
    return helpers.cssClasses(this, classRules, includeComponentClassName);
  }

  /**
   * Creates and sends a new IMA.js DOM custom event from this component.
   *
   * @param eventName The name of the event.
   * @param eventTarget EventTarget compatible node.
   * @param data Data to send within the event.
   */
  fire(eventTarget: EventTarget, eventName: string, data = undefined): void {
    helpers.fire(this, eventTarget, eventName, data);
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
  ): void {
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
  ): void {
    helpers.unlisten(this, eventTarget, eventName, listener);
  }
}
