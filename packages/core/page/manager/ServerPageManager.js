import ns from '../../namespace';
import PageFactory from '../PageFactory';
import PageRenderer from '../renderer/PageRenderer';
import PageStateManager from '../state/PageStateManager';
import AbstractPageManager from './AbstractPageManager';

ns.namespace('ima.page.manager');

// @server-side export default class ServerPageManager extends AbstractPageManager {}

/**
 * Page manager for controller on the server side.
 */
export default class ServerPageManager extends AbstractPageManager {
  static get $dependencies() {
    return [PageFactory, PageRenderer, PageStateManager];
  }

  /**
	 * @inheritdoc
	 */
  scrollTo(x = 0, y = 0) {}
}

ns.ima.page.manager.ServerPageManager = ServerPageManager;
