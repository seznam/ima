import ns from 'core/namespace/ns.js';

ns.namespace('Core.Interface');

/**
 * @class Controller
 * @namespace Core.Interface
 * @module Core
 * @submodule Core.Interface
 */
class Controller {

	/**
	 * Initialization controller.
	 *
	 * @method init
	 */
	init() {
	}

	/**
	 * Deinicialization controller.
	 *
	 * @method deinit
	 */
	deinit() {
	}

	/**
	 * Controller will be activated, after load complete.
	 *
	 * @method activate
	 */
	activate() {
	}

	/**
	 * Load data for controller.
	 *
	 * @method load
	 */
	load() {
	}

	/**
	 * Returns reactive view.
	 *
	 * @method getReactView
	 */
	getReactView() {
	}

	/**
	 * Set reactive view.
	 *
	 * @method setReactiveView
	 */
	setReactiveView() {
	}

	/**
	 * Set state to controller and to assigned reactive view (if exists).
	 *
	 * @method setState
	 */
	setState() {
	}

	/**
	 * Add state to controller and to assigned reactive view (if exists).
	 *
	 * @method addState
	 */
	addState() {
	}

	/**
	 * Returns state.
	 *
	 * @method getState
	 */
	getState() {
	}

	/**
	 * Set SEO params.
	 *
	 * @method setSeoParams
	 */
	setSeoParams() { // jshint ignore:line
	}

	/**
	 * Returns SEO params.
	 *
	 * @method getSeoHandler
	 */
	getSeoHandler() {
	}

	/**
	 * Returns http status.
	 *
	 * @method getHttpStatus
	 */
	getHttpStatus() {
	}
}

ns.Core.Interface.Controller = Controller;