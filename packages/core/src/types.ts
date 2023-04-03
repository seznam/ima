import * as $Helper from '@ima/helpers';

import { AppEnvironment } from './boot';
import { Dictionary, DictionaryConfig } from './dictionary/Dictionary';
import { Dispatcher } from './event/Dispatcher';
import { EventBus } from './event/EventBus';
import { HttpAgent } from './http/HttpAgent';
import { PageStateManager } from './page/state/PageStateManager';
import { Router } from './router/Router';
import { Window } from './window/Window';

export type StringParameters = {
  [key: string]: string;
};

export type UnknownParameters = {
  [key: string]: unknown;
};

export type UnknownPromiseParameters = {
  [key: string]: unknown | Promise<unknown>;
};

export type ObjectParameters = {
  [key: string]: boolean | number | string | Date;
};

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

export interface GlobalImaObject {
  $Env: keyof AppEnvironment;
  $Version: string;
  $App: Record<string, unknown>;
  $Language: string;
  $Debug: boolean;
  $Protocol: 'http:' | 'https:';
  $Host: string;
  $Path: string;
  $Root: string;
  $LanguagePartPath: string;
  Runner: object;
  SPA: boolean;
  $IMA: GlobalImaObject;
  $RequestID: string;
  $PublicPath: string;
  i18n: DictionaryConfig['dictionary'];
  fatalErrorHandler?: (error: Error) => void;
  Cache?: object;
}

declare global {
  /* eslint-disable no-var */
  var $Debug: boolean;
  var $IMA: GlobalImaObject;
  /* eslint-enable no-var */

  interface Window {
    $IMA: GlobalImaObject;
  }
}
