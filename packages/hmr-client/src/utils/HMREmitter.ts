import { StatsError } from 'webpack';

export type EventName = 'error' | 'clear' | 'close' | 'destroy';
export type ListenerData = {
  error?: StatsError | Error;
};
export interface ListenerObj {
  listener: (data?: ListenerData) => Promise<void>;
  once: boolean;
}
export type PendingEvents = Record<EventName, (ListenerData | undefined)[]>;

/**
 * Tiny event emitter used for communication between
 * application, hmr client and error overlay.
 */
export class HMREmitter {
  #listeners: Map<EventName, ListenerObj[]>;
  #pendingEvents: PendingEvents | Record<string, never>;

  constructor() {
    this.#listeners = new Map();
    this.#pendingEvents = {};
  }

  on(
    eventName: EventName,
    listener: ListenerObj['listener'],
    once = false
  ): void {
    const listeners = this.#listeners.get(eventName) ?? [];
    listeners.push({
      listener,
      once,
    });

    this.#listeners.set(eventName, listeners);

    // Emit pending events
    if (
      Array.isArray(this.#pendingEvents[eventName]) &&
      this.#pendingEvents[eventName].length
    ) {
      for (const pendingData of Object.values(this.#pendingEvents[eventName])) {
        this.emit(eventName, pendingData);
      }
    }
  }

  emit(eventName: EventName, data?: ListenerData): void {
    const listeners = this.#listeners.get(eventName);

    if (!listeners) {
      if (!Array.isArray(this.#pendingEvents[eventName])) {
        this.#pendingEvents[eventName] = [];
      }

      this.#pendingEvents[eventName].push(data);

      return;
    }

    for (let i = 0; i < listeners.length; i++) {
      listeners[i].listener(data);

      // Delete once used
      if (listeners[i].once) {
        listeners.splice(i, 1);
      }
    }
  }
}

/**
 * Returns singleton instance of EventSource across multiple clients.
 */
export function getHMREmitter() {
  if (!window.__IMA_HMR?.emitter) {
    window.__IMA_HMR = window.__IMA_HMR || {};
    window.__IMA_HMR.emitter = new HMREmitter();
  }

  return window.__IMA_HMR.emitter;
}
