import { ErrorEventEmitter } from '@ima/dev-utils/dist/ErrorEventEmitter';
import { DebouncedFunc } from 'lodash';
import { StatsError } from 'webpack';

import { HMREventSource } from '#/utils';

// TODO CLEANUP
declare global {
  interface Window {
    __ima_hmr: {
      options: HMROptions;
      hmrEventSource?: HMREventSource;
      // overlayBridge?: OverlayBridge;
      handleRuntimeError: DebouncedFunc<(error: Error) => void>;
      clearRuntimeErrors(): void;
      showCompileError(error: StatsError): void;
      clearCompileError(): void;
    };

    __IMA_HMR: ErrorEventEmitter;
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

export interface HMROptions {
  port: number;
  hostname: string;
  public: string;
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
  Close = 'ima.error.overlay.overlay:close',
}

export enum ClientEventName {
  RuntimeErrors = 'ima.error.overlay.client:runtime.error',
  CompileErrors = 'ima.error.overlay.client:compile.error',
  ClearRuntimeErrors = 'ima.error.overlay.client:clear.runtime.errors',
  ClearCompileErrors = 'ima.error.overlay.client:clear.compile.errors',
}
