import PageFactory from '../PageFactory';
import PageRenderer from '../renderer/PageRenderer';
import PageStateManager from '../state/PageStateManager';
import AbstractPageManager from './AbstractPageManager';

// @server-side class ServerPageManager extends __VARIABLE__ {__CLEAR__}\nexports.default = ServerPageManager;

/**
 * Page manager for controller on the server side.
 */
export default class ServerPageManager extends AbstractPageManager {
  static get $dependencies() {
    return [PageFactory, PageRenderer, PageStateManager];
  }
}
