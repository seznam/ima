import ns from 'ima/namespace';

ns.namespace('Ima.Interface');

/**
 * The page renderer is a utility for rendering the page at either the client
 * or the server, handling the differences in the environment.
 *
 * @interface PageRender
 * @namespace Ima.Interface
 * @module Ima
 * @submodule Ima.Interface
 */
export default class PageRender {
	/**
	 * Renders the page using the provided controller and view. The actual
	 * behavior of this method differs at the client and the at server in the
	 * following way:
	 *
	 * On server, the method renders the page to a string containing HTML
	 * markup to send to the client.
	 *
	 * On client, the method renders the page into DOM, re-using the DOM
	 * created from the HTML markup send by the server if possible.
	 *
	 * @inheritdoc
	 * @override
	 * @method mount
	 * @abstract
	 * @param {Ima.Abstract.Controller} controller
	 * @param {Vendor.React.Component} view
	 * @param {Object<string, *>} loadedPageState
	 * @return {Promise}
	 */
	mount(controller, view, loadedPageState) {}

	/**
	 * Only update controller state and React view not call constructor.
	 *
	 * It is useful for same controller and view, where only change url params.
	 * Then it is possible to reuse same controller and view.
	 *
	 * @inheritdoc
	 * @override
	 * @method update
	 * @param {Ima.Abstract.Controller} controller
	 * @param {Object<string, *>} updatedPageState
	 * @return {Promise}
	 */
	update(controller, updatedPageState) {}

	/**
	 * Unmount view from the DOM. Then React always call constructor
	 * for new mounting view.
	 *
	 * @inheritdoc
	 * @override
	 * @method unmount
	 */
	unmount() {}

	/**
	 * Set state to reactive react component.
	 *
	 * @method setState
	 * @param {Object<string, *>=} [state={}]
	 */
	setState(state = {}) {}
}

ns.Ima.Interface.PageRender = PageRender;
