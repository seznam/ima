import { Dictionary, EventBus, Router } from '@ima/core';
import { ComponentType } from 'react';

import AbstractComponent from './component/AbstractComponent';
import AbstractPureComponent from './component/AbstractPureComponent';

export type Settings = {
  $App: unknown;
  $Debug: unknown;
  $Env: unknown;
  $Host: unknown;
  $Language: unknown;
  $LanguagePartPath: unknown;
  $Path: unknown;
  $Page: {
    $Render: {
      batchResolve: boolean;
      documentView?: ComponentType;
      managedRootView?: ComponentType;
      masterElementId?: string;
      viewAdapter?: ComponentType;
    };
  };
  $Protocol: unknown;
  $Root: unknown;
  $Version: unknown;
};

export type Utils = {
  $CssClasses(
    classRules: string | object,
    component: AbstractComponent | AbstractPureComponent | ''
  ): string;
  $Dictionary: Dictionary;
  $EventBus: EventBus;
  $Router: Router;
};
