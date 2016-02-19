import ns from 'ima/namespace';
import AbstractPageManager from 'ima/abstract/pageManager';

ns.namespace('Ima.Page.Manager');

/**
 * Page manager for controller on the server side.
 *
 * @class Server
 * @implements Ima.Abstract.PageManager
 * @namespace Ima.Page.Manager
 * @module Ima
 * @submodule Ima.Page
 */
export default class Server extends AbstractPageManager {

	/**
	 * @inheritdoc
	 * @method scrollTo
	 */
	scrollTo(x = 0, y = 0) {}

}

ns.Ima.Page.Manager.Server = Server;
