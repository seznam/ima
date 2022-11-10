import { StatsError } from 'webpack';

export type EventName = 'error' | 'clear' | 'close' | 'destroy' | 'built';
export type ListenerData = {
  error?: StatsError | Error;
};
export type Listener = (data?: ListenerData) => Promise<void>;
export type PendingEvents = Record<EventName, (ListenerData | undefined)[]>;

/**
 * Tiny event emitter used for communication between
 * application, hmr client and error overlay.
 */
class ErrorOverlayEmitter {
  private _listeners: Map<EventName, Listener[]>;
  private _pendingEvents: PendingEvents | Record<string, never>;

  constructor() {
    this._listeners = new Map();
    this._pendingEvents = {};
  }

  on(eventName: EventName, listener: Listener): void {
    const listeners = this._listeners.get(eventName) ?? [];

    listeners.push(listener);
    this._listeners.set(eventName, listeners);

    // Emit pending events
    if (
      Array.isArray(this._pendingEvents[eventName]) &&
      this._pendingEvents[eventName].length
    ) {
      for (const pendingData of Object.values(this._pendingEvents[eventName])) {
        this.emit(eventName, pendingData);
      }
    }
  }

  emit(eventName: EventName, data?: ListenerData): void {
    const listeners = this._listeners.get(eventName);

    if (!listeners) {
      if (!Array.isArray(this._pendingEvents[eventName])) {
        this._pendingEvents[eventName] = [];
      }

      this._pendingEvents[eventName].push(data);

      return;
    }

    for (const listener of listeners) {
      listener(data);
    }
  }
}

export { ErrorOverlayEmitter };
