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
	 * Renders the page using the provided controller and parameters. The actual
	 * behavior of this method differs at the client and the at server in the
	 * following way:
	 *
	 * On server, the method renders the page to a string containing HTML markup
	 * to send to the client.
	 *
	 * On client, the method renders the page into DOM, re-using the DOM created
	 * from the HTML markup send by the server if possible.
	 *
	 * @method render
	 * @param {Core.Abstract.Controller} controller The page controller to use to
	 *        render the page, and bind to the rendered page if at the client.
	 * @param {Object<string, string>} params The route parameters.
	 */
	render(controller, params = {}) {}
}

ns.Core.Interface.PageRender = PageRender;