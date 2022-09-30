import { clone } from '@ima/helpers';
import type { ErrorOverlayEmitter } from '@ima/dev-utils/dist/ErrorOverlayEmitter';
declare global {
  type $Debug = boolean;
  interface Window {
    __IMA_HMR: ErrorOverlayEmitter;
    FormData: FormData;
  }
}

export type Helpers = {
  clone: typeof clone;
};
