import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core');

/**
 * Registry for UI component factory functions.
 *
 * @class Component
 * @namespace Core
 * @module Core
 */
class Component {

	/**
	 * Initializes the registry.
	 *
	 * @method constructor
	 * @constructor
	 */
	constructor() {

		/**
		 * The internal registry of UI component factory functions. The functions
		 * are in the order they were registered.
		 *
		 * The functions must be called with the UI utils as argument.
		 *
		 * @private
		 * @property _components
		 * @type {function(*)[]}
		 */
		this._components = [];
	}

	/**
	 * Registers the provided UI component factory function. The function should
	 * create the component class and bind it to the namespace.
	 *
	 * The function will be called with the UI utils as argument during
	 * application initialization.
	 *
	 * @method addComponent
	 * @param {function(*)} componentFactory Factory function that creates the UI
	 *        component.
	 */
	add(componentFactory) {
		this._components.push(componentFactory);
	}

	/**
	 * Returns all registered UI component factory functions. The functions are
	 * returned in the same order that they were registered.
	 *
	 * @method getComponents
	 * @return {function(*)[]}
	 */
	getComponents() {
		return this._components;
	}
}

ns.Core.Component = Component;

export default new Component();
