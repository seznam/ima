import ns from 'core/namespace/ns.js';

ns.namespace('App.Module.Item');

/**
 * Factory  to create item entity.
 *
 * @class Factory
 * @extends App.Base.EntityFactory
 * @namespace App.Module.Item
 * @module App
 * @submodule App.Module
 */
class Factory extends ns.App.Base.EntityFactory {
	/**
	 * @constructor
	 * @method constructor
	 */
	constructor() {
		super('ItemEntity');
	}
}

ns.App.Module.Item.Factory = Factory;