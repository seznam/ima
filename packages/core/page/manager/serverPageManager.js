// @server-side

import ns from 'ima/namespace';
import AbstractPageManager from 'ima/page/manager/abstractPageManager';

ns.namespace('ima.page.manager');

/**
 * Page manager for controller on the server side.
 *
 * @class ServerPageManager
 * @implements ima.page.manager.AbstractPageManager
 * @namespace ima.page.manager
 * @module ima
 * @submodule ima.page
 */
export default class ServerPageManager extends AbstractPageManager {

	/**
	 * @inheritdoc
	 * @method scrollTo
	 */
	scrollTo(x = 0, y = 0) {}

}

ns.ima.page.manager.ServerPageManager = ServerPageManager;
