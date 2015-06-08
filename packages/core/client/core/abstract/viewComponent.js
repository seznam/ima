import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Abstract');

var viewUtils = null;

/**
 * The base class for all view components.
 *
 * @abstract
 * @class ViewComponent
 * @namespace Core.Abstract
 * @module Core
 * @submodule Core.Abstract
 */
export default class ViewComponent extends ns.Vendor.React.Component {
	/**
	 * Returns the utilities for the view components. The returned value is the
	 * value bound to the {@code $Utils} object container constant.
	 *
	 * This method cannot be called before the application initialization has
	 * been completed.
	 *
	 * @method get utils
	 * @return {Object<string, *>} The utilities for the view components.
	 */
	get utils() {
		if (!viewUtils) {
			throw new Error('Cannot access view utils before the ' +
					'application initialization has finished');
		}

		return viewUtils;
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
	 * Sets the view utils the view components should use.
	 *
	 * @method set utils
	 * @param {Object<string, *>} newViewUtils The view utils the view
	 *        components should use.
	 * @throws {Error} Thrown if the utils have already been set.
	 */
	static set utils(newViewUtils) {
		viewUtils = newViewUtils;
	}
}

ns.Core.Abstract.ViewComponent = ViewComponent;
