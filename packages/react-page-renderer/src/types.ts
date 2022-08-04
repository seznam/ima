import { EventBus, Dictionary, Router } from '@ima/core';
import type { ErrorOverlayEmitter } from '@ima/dev-utils/dist/ErrorOverlayEmitter';

import AbstractComponent from './AbstractComponent';
import AbstractPureComponent from './AbstractPureComponent';

declare global {
  var $Debug: boolean
  interface Window {
    __IMA_HMR: ErrorOverlayEmitter;
  }
}

export type Utils = {
  $CssClasses(classRules: string | object, component: AbstractComponent | AbstractPureComponent | ''): string;
  $Dictionary: Dictionary;
  $EventBus: EventBus;
  $Router: Router;
};
