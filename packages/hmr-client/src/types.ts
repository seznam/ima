import { IndicatorWrapper, EventSourceWrapper, HMREmitter } from './utils';

declare global {
  interface Window {
    __IMA_HMR: {
      emitter?: HMREmitter;
      eventSource?: EventSourceWrapper;
      indicator?: IndicatorWrapper;
    };
  }
}

export {};
