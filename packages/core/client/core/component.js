import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core');

/**
 * Storage for all app component.
 *
 * @class Component
 * @namespace Core
 * @module Core
 */
class Component {

	/**
	 * @method constructor
	 * @constructor
	 */
	constructor() {

		/**
		 *
		 *
		 * @property _components
		 * @private
		 * @type {Array}
		 * @default []
		 */
		this._components = [];
	}

	/**
	 * Add component to pipe.
	 *
	 * @method addComponent
	 * @param {Function} component - function for init react component
	 */
	add(component) {
		this._components.push(component);
	}

	/**
	 * Return all components.
	 *
	 * @method getComponents
	 * @return {function}[]
	 */
	getComponents() {
		return this._components;
	}
}

ns.Core.Component = Component;

export default new Component();
