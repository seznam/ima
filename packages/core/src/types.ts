import { clone } from '@ima/helpers';
import type { ErrorOverlayEmitter } from '@ima/dev-utils/dist/ErrorOverlayEmitter';

declare global {
  interface Window {
    __IMA_HMR: ErrorOverlayEmitter;
  }
}

export type Helpers = {
  clone: typeof clone;
};
