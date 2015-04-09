import ns from 'core/namespace/ns.js';

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
	constructor(view) {
		super(view);
	}

	/**
	 * Load all needed data.
	 *
	 * @method load
	 * @return {Object} object of promise
	 */
	load() {
		return {
			//error: ns.oc.get('$Promise').reject(ns.oc.create('$Error', 'Try error page.', {status: 500})),
			message: `I am IMA.js!`
		};
	}

}

ns.App.Page.Home.Controller = Controller;