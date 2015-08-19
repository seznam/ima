import ns from 'imajs/client/core/namespace';

ns.namespace('Core.Page.Manager');

/**
 * Page manager for controller on the server side.
 *
 * @class Server
 * @implements Core.Abstract.PageManager
 * @namespace Core.Page.Manager
 * @module Core
 * @submodule Core.Page
 */
export default class Server extends ns.Core.Abstract.PageManager {

	/**
	 * Scroll page to defined vertical and horizontal values.
	 *
	 * Scrolling is async.
	 *
	 * @inheritDoc
	 * @override
	 * @method scrollTo
	 * @param {number} [x=0] x is the pixel along the horizontal axis of the document
	 * @param {number} [y=0] y is the pixel along the vertical axis of the document
	 */
	scrollTo(x = 0, y = 0) {}

}

ns.Core.Page.Manager.Server = Server;
