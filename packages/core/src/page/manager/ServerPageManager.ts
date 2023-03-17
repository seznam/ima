/* @if client **
export class ServerPageManager {};
/* @else */
import { AbstractPageManager } from './AbstractPageManager';
import { PageFactory } from '../PageFactory';
import { PageRenderer } from '../renderer/PageRenderer';
import { PageStateManager } from '../state/PageStateManager';

/**
 * Page manager for controller on the server side.
 */
export class ServerPageManager extends AbstractPageManager {
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
