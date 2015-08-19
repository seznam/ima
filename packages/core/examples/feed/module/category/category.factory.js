import ns from 'imajs/client/core/namespace';

ns.namespace('App.Module.Category');

/**
 * Factory to create category entity.
 *
 * @class Factory
 * @extends App.Base.EntityFactory
 * @namespace App.Module.Category
 * @module App
 * @submodule App.Module
 */
class Factory extends ns.App.Base.EntityFactory {
	/**
	 * @constructor
	 * @method constructor
	 * @param {App.Module.Category.Entity} CategoryEntityConstructor
	 */
	constructor(CategoryEntityConstructor) {
		super(CategoryEntityConstructor);
	}
}

ns.App.Module.Category.Factory = Factory;
