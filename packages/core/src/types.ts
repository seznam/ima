import * as $Helper from '@ima/helpers';

import { Dictionary } from './dictionary/Dictionary';
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

declare global {
  /* eslint-disable no-var */
  var $Debug: boolean;
  var $IMA: Record<string, unknown>;
  // Test Functions
  var using: (values: unknown[], func: object) => void;
  var extend: (ChildClass: object, ParentClass: object) => void;

  interface Window {
    $IMA?: {
      SPA: boolean;
      $PublicPath: string;
      $Language: string;
      $Env: string;
      $Debug: boolean;
      $Version: string;
      $App: string;
      $Protocol: string;
      $Host: string;
      $Path: string;
      $Root: string;
      $LanguagePartPath: string;
      Runner: string;
      Cache: object;
      i18n?: object;
    };
  }
}
