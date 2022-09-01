import { Controller, Dictionary, EventBus, Router } from '@ima/core';
import type { ErrorOverlayEmitter } from '@ima/dev-utils/dist/ErrorOverlayEmitter';
import { allPromiseHash, processContent } from '@ima/helpers';
import { ComponentType } from 'react';

import AbstractComponent from './AbstractComponent';
import AbstractPureComponent from './AbstractPureComponent';

declare global {
  const $Debug: boolean;
  interface Window {
    __IMA_HMR: ErrorOverlayEmitter;
  }
}

export type Helpers = {
  allPromiseHash: typeof allPromiseHash;
  processContent: typeof processContent;
};

export type RouteOptions = {
  allowSPA: boolean;
  autoScroll: boolean;
  documentView?: ComponentType;
  managedRootView?: ComponentType;
  onlyUpdate?: (controller: Controller, view: ComponentType) => boolean;
  viewAdapter?: ComponentType;
};

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
      documentView?: ComponentType;
      managedRootView?: ComponentType;
      masterElementId?: string;
      useLegacyReact: boolean;
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
