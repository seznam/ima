import ns from 'imajs/client/core/namespace';

ns.namespace('App.Interface');

/**
 * @class Entity
 * @namespace App.Interface
 * @module App
 * @submodule App.Interface
 * */
class Entity {

	/**
	 * @constructor
	 * @method constructor
	 * @param {Mixed} id
	 */
	constructor(id) {}

	/**
	 * Return entity unique id.
	 *
	 * @method getId
	 * @return {Mixed}
	 */
	getId() {}
}

ns.App.Interface.Entity = Entity;
