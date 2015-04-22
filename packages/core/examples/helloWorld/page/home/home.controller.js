import ns from 'imajs/client/core/namespace.js';
import oc from 'imajs/client/core/objectContainer.js';
import CoreError from 'imajs/client/core/coreError.js';

ns.namespace('App.Page.Home');

/**
 * @class Controller
 * @extends App.Base.Controller
 * @namespace App.Page.Home
 * @module App
 * @submodule App.Page
 */
class Controller extends ns.App.Base.Controller {

	/**
	 * @method constructor
	 * @constructor
	 * @param {App.Page.Home.View} view
	 */
	constructor() {
		super();
	}

	/**
	 * Load all needed data.
	 *
	 * @method load
	 * @return {Object} object of promise
	 */
	load() {
		return {
			//error: oc.get('$Promise').reject(new CoreError('Try error page.')),
			message: `I am IMA.js!`
		};
	}

}

ns.App.Page.Home.Controller = Controller;