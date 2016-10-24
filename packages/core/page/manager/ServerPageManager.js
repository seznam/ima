import ns from '../../namespace';
import PageFactory from '../PageFactory';
import PageRenderer from '../renderer/PageRenderer';
import PageStateManager from '../state/PageStateManager';
import AbstractPageManager from './AbstractPageManager';
import PageManager from './PageManager';

ns.namespace('ima.page.manager');

/**
 * Page manager for controller on the server side.
 *
 * @class ServerPageManager
 * @extends AbstractPageManager
 * @implements PageManager
 * @namespace ima.page.manager
 * @module ima
 * @submodule ima.page
 */
export default class ServerPageManager extends AbstractPageManager {

	static get $dependencies() {
		return [PageFactory, PageRenderer, PageStateManager];
	}

	/**
	 * @inheritdoc
	 * @method scrollTo
	 */
	scrollTo(x = 0, y = 0) {}

}

ns.ima.page.manager.ServerPageManager = ServerPageManager;
