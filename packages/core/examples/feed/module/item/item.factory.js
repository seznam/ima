import ns from 'imajs/client/core/namespace';

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
	 * @param {App.Module.Item.Entity} ItemEntityConstructor
	 */
	constructor(ItemEntityConstructor) {
		super(ItemEntityConstructor);
	}
}

ns.App.Module.Item.Factory = Factory;
