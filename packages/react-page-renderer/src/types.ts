import { ComponentType } from 'react';

import { defaultCssClasses } from './componentHelpers';

export interface Settings {
  [key: string]: unknown;
  $App: object;
  $Debug: boolean;
  $Env: 'prod' | 'dev';
  $Host: string;
  $Language: string;
  $LanguagePartPath: string;
  $Path: string;
  $Page: {
    $Render: {
      batchResolve?: boolean;
      documentView?: ComponentType;
      managedRootView?: ComponentType;
      masterElementId?: string;
      viewAdapter?: ComponentType;
    };
  };
  $Protocol: string;
  $Root: string;
  $Version: string;
}

declare module '@ima/core' {
  interface Utils {
    $Settings: Settings;
    $CssClasses: typeof defaultCssClasses;
  }
}
