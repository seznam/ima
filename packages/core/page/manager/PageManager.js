import ns from 'ima/namespace';

ns.namespace('ima.page.manager');

/**
 * The page manager is a utility for managing the current controller and its
 * view.
 *
 * @interface PageManager
 * @namespace ima.page.manager
 * @module ima
 * @submodule ima.page
 */
export default class PageManager {

	/**
	 * Initializes the page manager.
	 *
	 * @method init
	 */
	init() {}

	/**
	 * Starts to manage the provided controller and its view. The manager
	 * stops the management of any previously managed controller and view.
	 *
	 * The controller and view will be initialized and rendered either into the
	 * UI (at the client-side) or to the response to send to the client (at the
	 * server-side).
	 *
	 * @method manage
	 * @param {(string|function(new: ima.controller.Controller, ...*))} controller
	 *        The alias, namespace path, or constructor of the controller to
	 *        manage.
	 * @param {(string|function(new: React.Component, Object<string, *>, ?Object<string, *>))} view
	 *        The alias, namespace path, or constructor of the page view to
	 *        manage.
	 * @param {{
	 *            onlyUpdate: (
	 *                boolean|
	 *                function(
	 *                    (string|function(new: ima.controller.Controller, ...*)),
	 *                   (string|function(new: React.Component, Object<string, *>, ?Object<string, *>))
	 *               ): boolean
	 *            ),
	 *           autoScroll: boolean,
	 *           allowServeSPA: boolean,
	 *           documentView: ?ima.page.AbstractDocumentView
	 *        }} options The current route options.
	 * @param {Object<string, string>=} [params={}] The route parameters of the
	 *        current route.
	 * @return {Promise<{status: number, content: ?string}>} A promise that
	 *         will resolve to information about the rendered page. The
	 *         {@code status} will contain the HTTP status code to send to the
	 *         client (at the server side) or determine the type of error page
	 *         to navigate to (at the client side).
	 *         The {@code content} field will contain the rendered markup of
	 *         the page at the server-side, or {@code null} at the client-side.
	 */
	manage(controller, view, options, params = {}) {}

	/**
	 * Scrolls the viewport to the specified horizontal and vertical offset.
	 *
	 * This method has no effect at the server-side.
	 *
	 * @method scrollTo
	 * @param {number=} [x=0] The horizontal offset to scroll to.
	 * @param {number=} [y=0] The vertical offset to scroll to.
	 */
	scrollTo(x = 0, y = 0) {}

	/**
	 * Finalization callback, called when the page manager is being discarded.
	 * This usually happens when the page is hot-reloaded at the client side.
	 *
	 * @method destroy
	 */
	destroy() {}
}

ns.ima.page.manager.PageManager = PageManager;
