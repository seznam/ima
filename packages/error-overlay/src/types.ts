import type { ErrorOverlayEmitter } from '@ima/dev-utils/dist/ErrorOverlayEmitter';

import { StackFrame } from '@/entities';

declare module '*.less' {
  export const use: (args?: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    __IMA_HMR: ErrorOverlayEmitter;
  }
}

export interface ParsedError {
  name: string;
  message: string;
  type?: 'compile' | 'runtime';
  frames: StackFrame[];
  params?: string | object;
}
