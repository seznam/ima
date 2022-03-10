import type { ErrorEventEmitter } from '@ima/dev-utils/dist/ErrorEventEmitter';
import { StatsError } from 'webpack';

import { StackFrame } from '#/entities';

declare global {
  interface WindowEventMap {
    [OverlayEventName.Ready]: CustomEvent;
    [OverlayEventName.Close]: CustomEvent;
    [ClientEventName.RuntimeErrors]: CustomEvent<{ error: Error }>;
    [ClientEventName.CompileErrors]: CustomEvent<{ errors: StatsError[] }>;
    [ClientEventName.ClearRuntimeErrors]: CustomEvent;
    [ClientEventName.ClearCompileErrors]: CustomEvent;
  }
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

declare global {
  interface Window {
    __ima_server_error: {
      name: string;
      message: string;
      stack: string;
    };

    __ima_hmr: {
      options: HMROptions;
    };

    __IMA_HMR: ErrorEventEmitter;
  }
}

// TODO merge similar options with hmr-client
export interface HMROptions {
  port: number;
  hostname: string;
  public: string;
}

export interface ParsedError {
  name: string;
  message: string;
  type: 'compile' | 'runtime';
  frames: StackFrame[];
}
