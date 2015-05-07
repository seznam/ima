import ns from 'imajs/client/core/namespace.js';
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
			//error: Promise.reject(new CoreError('Try error page.')),
			//redirect: Promise.reject(new CoreError('Redirect from home page to error page for $Debug = false.', {status: 303, url: 'http://localhost:3001/not-found'})),
			message: `I am IMA.js!`
		};
	}
}

ns.App.Page.Home.Controller = Controller;