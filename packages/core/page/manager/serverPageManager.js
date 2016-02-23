// @server-side

import ns from 'ima/namespace';
import AbstractPageManager from 'ima/page/manager/abstractPageManager';

ns.namespace('Ima.Page.Manager');

/**
 * Page manager for controller on the server side.
 *
 * @class ServerPageManager
 * @implements Ima.Page.Manager.AbstractPageManager
 * @namespace Ima.Page.Manager
 * @module Ima
 * @submodule Ima.Page
 */
export default class ServerPageManager extends AbstractPageManager {

	/**
	 * @inheritdoc
	 * @method scrollTo
	 */
	scrollTo(x = 0, y = 0) {}

}

ns.Ima.Page.Manager.ServerPageManager = ServerPageManager;
