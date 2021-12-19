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
      showCompileErrors?(errors: StatsError[]): void;
      clearCompileError(): void;
    };
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
