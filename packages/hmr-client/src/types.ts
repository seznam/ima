import { DebouncedFunc } from 'lodash';
import { StatsError } from 'webpack';

import { HMREventSource, OverlayBridge } from '#/utils';

declare global {
  interface Window {
    __ima_hmr: {
      hmrEventSource?: HMREventSource;
      overlayBridge?: OverlayBridge;
      handleRuntimeError: DebouncedFunc<(error: Error) => void>;
      clearRuntimeErrors(): void;
      showCompileErrors(errors: StatsError[]): void;
      clearCompileError(): void;
    };
  }

  interface WindowEventMap {
    [OverlayEventName.Ready]: CustomEvent;
    [OverlayEventName.Close]: CustomEvent;
    [ClientEventName.RuntimeErrors]: CustomEvent<{ error: Error }>;
    [ClientEventName.CompileErrors]: CustomEvent<{ errors: StatsError[] }>;
    [ClientEventName.ClearRuntimeErrors]: CustomEvent;
    [ClientEventName.ClearCompileErrors]: CustomEvent;
  }
}

export interface HMRReport {
  message: string;
  moduleId: string;
  moduleIdentifier: string;
  moduleName: string;
}

export interface HMRMessageData {
  action: 'built' | 'building' | 'sync';
  hash?: string;
  name?: string;
  time?: number;
  errors?: StatsError[];
  warnings?: StatsError[];
  modules?: Record<string, string>;
}

export enum OverlayEventName {
  Ready = 'ima.error.overlay.overlay:ready',
  Close = 'ima.error.overlay.overlay:close'
}

export enum ClientEventName {
  RuntimeErrors = 'ima.error.overlay.client:runtime.error',
  CompileErrors = 'ima.error.overlay.client:compile.error',
  ClearRuntimeErrors = 'ima.error.overlay.client:clear.runtime.errors',
  ClearCompileErrors = 'ima.error.overlay.client:clear.compile.errors'
}
