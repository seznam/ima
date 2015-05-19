import ns from 'imajs/client/core/namespace.js';

ns.namespace('Core.Interface');

/**
 * The page renderer is a utility for rendering the page at either the client
 * or the server, handling the differences in the environment.
 *
 * @interface PageRender
 * @namespace Core.Interface
 * @module Core
 * @submodule Core.Interface
 */
class PageRender {
	/**
	 * Renders the page using the provided controller and view. The actual
	 * behavior of this method differs at the client and the at server in the
	 * following way:
	 *
	 * On server, the method renders the page to a string containing HTML markup
	 * to send to the client.
	 *
	 * On client, the method renders the page into DOM, re-using the DOM created
	 * from the HTML markup send by the server if possible.
	 *
	 * @method unmount
	 * @param {Core.Abstract.Controller} controller
	 * @param {Vendor.React.Component} view
	 * @return {Promise}
	 */
	mount(controller, view) {}

	/**
	 * Unmount view from th DOM.
	 *
	 * @method unmount
	 */
	unmount() {}

	/**
	 * Set state to reactive react component.
	 *
	 * @method setState
	 * @param {object} [state={}]
	 */
	setState(state = {}) {}
}

ns.Core.Interface.PageRender = PageRender;
