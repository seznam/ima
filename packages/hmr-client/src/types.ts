import { ErrorOverlayEmitter } from '@ima/dev-utils/dist/ErrorOverlayEmitter';
import { StatsError } from 'webpack';

import { IndicatorWrapper, EventSourceWrapper } from '@/utils';

declare global {
  interface Window {
    __IMA_HMR: {
      emitter: ErrorOverlayEmitter;
      eventSource: EventSourceWrapper;
      indicator: IndicatorWrapper;
    };
  }
}

export interface HMROptions {
  name: 'server' | 'client' | 'client.es';
  port: number;
  hostname: string;
  publicUrl: string;
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
