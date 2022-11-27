import { Emitter } from '@esmj/emitter';

import { IndicatorWrapper, EventSourceWrapper } from './utils';

declare global {
  interface Window {
    __IMA_HMR: {
      emitter?: Emitter;
      eventSource?: EventSourceWrapper;
      indicator?: IndicatorWrapper;
    };
  }
}

export {};
