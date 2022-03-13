import { StatsError } from 'webpack';

export type EventName = 'error' | 'clear' | 'close';
export type ListenerData = {
  error?: StatsError | Error;
  type: 'compile' | 'runtime';
};
export type Listener = (data?: ListenerData) => Promise<void>;

class ErrorOverlayEmitter {
  private _listeners: Map<EventName, Listener[]>;

  constructor() {
    this._listeners = new Map();
  }

  on(eventName: EventName, listener: Listener): void {
    const listeners = this._listeners.get(eventName) ?? [];

    listeners.push(listener);
    this._listeners.set(eventName, listeners);
  }

  emit(eventName: EventName, data?: ListenerData): void {
    const listeners = this._listeners.get(eventName);

    if (!listeners) {
      return;
    }

    for (const listener of listeners) {
      listener(data);
    }
  }
}

export { ErrorOverlayEmitter };
