import { HMRMessageData, HMROptions } from '@/types';
import { getIndicator } from '@/utils/IndicatorWrapper';

import { logger } from './Logger';

export type EventSourceListener = (data: HMRMessageData) => void;

const TIMEOUT = 5000;

/**
 * Initiates connection to webpack-hot-middleware SSE event source.
 *
 * Based on https://github.com/webpack-contrib/webpack-hot-middleware/blob/master/client.js
 */
export class EventSourceWrapper {
  #listeners: Record<string, EventSourceListener[]> = {};
  #eventSource?: EventSource;
  #lastActivity = Date.now();
  #liveCheck = setInterval(() => {
    if (Date.now() - this.#lastActivity > TIMEOUT) {
      this.disconnect();
    }
  }, TIMEOUT / 2);

  public publicUrl: string;

  constructor(publicUrl: string) {
    this.publicUrl = publicUrl;

    // Init event source
    this.#init();
  }

  #init(): void {
    this.#eventSource = new EventSource(`${this.publicUrl}/__webpack_hmr`);

    this.#eventSource.addEventListener('error', () => this.#errorHandler());
    this.#eventSource.addEventListener('open', () => this.#openHandler());
    this.#eventSource.addEventListener('message', data =>
      this.#messageHandler(data)
    );
  }

  #openHandler(): void {
    this.#lastActivity = Date.now();
    logger.info('connected');
  }

  #messageHandler(event: MessageEvent): void {
    this.#lastActivity = Date.now();

    if (!event.data.includes('action')) {
      return;
    }

    try {
      const data: HMRMessageData = JSON.parse(event?.data);
      const { name, action } = data;

      /**
       * `building` action is not specific to client name
       * so we fire it to all listeners.
       */
      if (action === 'building') {
        Object.values(this.#listeners)
          .flat()
          .forEach(listener => listener(data));
      } else if (name && Array.isArray(this.#listeners[name])) {
        this.#listeners[name].forEach(listener => listener(data));
      }
    } catch (error) {
      logger.error('Unable to parse event source data', event.data, error);
    }
  }

  #errorHandler(): void {
    getIndicator().create('invalid');

    // Close event source
    this.#eventSource?.close();

    // Clear pending timeouts
    if (this.#liveCheck) {
      clearInterval(this.#liveCheck);
    }

    // Autoconnect
    setTimeout(() => this.#init(), TIMEOUT);
  }

  disconnect(): void {
    this.#errorHandler();
  }

  addListener(name: string, listener: EventSourceListener): void {
    if (!this.#listeners[name]) {
      this.#listeners[name] = [];
    }

    this.#listeners[name].push(listener);
  }
}

/**
 * Returns singleton instance of EventSource across multiple clients.
 */
export function getEventSource(options: HMROptions) {
  if (!window.__IMA_HMR?.eventSource) {
    window.__IMA_HMR = window.__IMA_HMR || {};
    window.__IMA_HMR.eventSource = new EventSourceWrapper(options.publicUrl);
  }

  return window.__IMA_HMR.eventSource;
}
