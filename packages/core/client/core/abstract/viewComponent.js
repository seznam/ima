import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Abstract');

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

		delete props.$Utils;
	}

	/**
	 * Returns the utilities for the view components. The returned value is the
	 * value bound to the {@code $Utils} object container constant.
	 *
	 * @method get utils
	 * @return {Object<string, *>} The utilities for the view components.
	 */
	get utils() {
		if ($Debug && !this._utils) {
			throw new Error('You cannot access view utils because they were ' +
					'not passed in the initial props as key name $Utils.');
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
}

ns.Core.Abstract.ViewComponent = ViewComponent;
