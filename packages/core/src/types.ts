import * as $Helper from '@ima/helpers';

import Dictionary from './dictionary/Dictionary';
import Dispatcher from './event/Dispatcher';
import EventBus from './event/EventBus';
import HttpAgent from './http/HttpAgent';
import PageStateManager from './page/state/PageStateManager';
import Router from './router/Router';
import Window from './window/Window';

export interface Utils {
  $Dictionary: Dictionary;
  $Dispatcher: Dispatcher;
  $EventBus: EventBus;
  $Helper: typeof $Helper;
  $Http: HttpAgent;
  $PageStateManager: PageStateManager;
  $Router: Router;
  $Window: Window;
}
