/* @if client **
export default class ServerPageManager {};
/* @else */
import PageFactory from '../PageFactory';
import PageRenderer from '../renderer/PageRenderer';
import PageStateManager from '../state/PageStateManager';
import AbstractPageManager from './AbstractPageManager';

/**
 * Page manager for controller on the server side.
 */
export default class ServerPageManager extends AbstractPageManager {
  static get $dependencies() {
    return [
      PageFactory,
      PageRenderer,
      PageStateManager,
      '$PageHandlerRegistry',
    ];
  }
}
// @endif
