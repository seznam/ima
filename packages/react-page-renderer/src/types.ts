import { EventBus, Dictionary, Router } from '@ima/core';

import AbstractComponent from './AbstractComponent';
import AbstractPureComponent from './AbstractPureComponent';

declare global {
  var $Debug: boolean
}

export type Utils = {
  $CssClasses(classRules: string | object, component: AbstractComponent | AbstractPureComponent | ''): string;
  $Dictionary: Dictionary;
  $EventBus: EventBus;
  $Router: Router;
};
