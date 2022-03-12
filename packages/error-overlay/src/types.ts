import type { ErrorEventEmitter } from '@ima/dev-utils/dist/ErrorEventEmitter';

import { StackFrame } from '#/entities';

declare global {
  interface Window {
    __IMA_HMR: ErrorEventEmitter;
  }
}

export interface ParsedError {
  name: string;
  message: string;
  type: 'compile' | 'runtime';
  frames: StackFrame[];
}
