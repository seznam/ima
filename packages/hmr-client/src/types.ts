import { ErrorOverlayEmitter } from '@ima/dev-utils/dist/ErrorOverlayEmitter';
import { StatsError } from 'webpack';

declare global {
  interface Window {
    __IMA_HMR: ErrorOverlayEmitter;
  }
}

export interface HMROptions {
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
