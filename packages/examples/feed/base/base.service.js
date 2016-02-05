import ns from 'imajs/client/core/namespace';

ns.namespace('App.Base');

/**
 * Base class for model.
 * @class Service
 * @extends App.Interface.Service
 * @namespace App.Base
 * @module App.Base
 */
class Service extends ns.App.Interface.Service {
	/**
	 * @method constructor
	 * @constructor
	 */
	constructor() {
		super();
	}

	/**
	 * Initialization model.
	 *
	 * @method init
	 */
	init() {

	}

	/**
	 * Deinitialization model.
	 *
	 * @method deinit
	 */
	deinit() {

	}

	/**
	 * Load data for model.
	 *
	 * @method load
	 */
	load() {

	}
}

ns.App.Base.Service = Service;
