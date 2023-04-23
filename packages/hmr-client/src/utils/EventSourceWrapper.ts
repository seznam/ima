import { getIndicator } from './IndicatorWrapper';
import { Logger } from './Logger';
import { HMROptions } from './utils';

export interface HMRMessageData {
  action: 'built' | 'building' | 'sync';
  hash?: string;
  name?: string;
  time?: number;
  errors?: string[];
  warnings?: string[];
  modules?: Record<string, string>;
}

export type EventSourceListener = (data: HMRMessageData) => void;

/**
 * Initiates connection to webpack-hot-middleware SSE event source.
 *
 * Based on https://github.com/webpack-contrib/webpack-hot-middleware/blob/master/client.js
 */
export class EventSourceWrapper {
  #options: HMROptions;
  #logger: Logger;
  #liveCheck: number;
  #eventSource?: EventSource;

  #listeners: Record<string, EventSourceListener[]> = {};
  #lastActivity = Date.now();

  constructor(options: HMROptions, logger: Logger) {
    this.#options = options;
    this.#logger = logger;

    // Init event source
    this.#init();

    this.#liveCheck = window.setInterval(() => {
      if (Date.now() - this.#lastActivity > this.#options.timeout) {
        this.disconnect();
      }
    }, this.#options.timeout / 2);
  }

  #init(): void {
    this.#eventSource = new EventSource(
      `${this.#options.publicUrl}/__webpack_hmr`
    );

    this.#eventSource.addEventListener('error', () => this.#errorHandler());
    this.#eventSource.addEventListener('open', () => this.#openHandler());
    this.#eventSource.addEventListener('message', data =>
      this.#messageHandler(data)
    );
  }

  #openHandler(): void {
    this.#lastActivity = Date.now();
    this.#logger.info('check', 'Connected');
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
      this.#logger.error(
        false,
        'Unable to parse event source data',
        event.data,
        error
      );
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
    setTimeout(() => this.#init(), this.#options.timeout);
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
export function getEventSource(options: HMROptions, logger: Logger) {
  if (!window.__IMA_HMR?.eventSource) {
    window.__IMA_HMR = window.__IMA_HMR || {};
    window.__IMA_HMR.eventSource = new EventSourceWrapper(options, logger);
  }

  return window.__IMA_HMR.eventSource;
}
