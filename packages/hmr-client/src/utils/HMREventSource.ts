import { HMRMessageData } from '#/types';

export type HMREventSourceListener = (data: HMRMessageData) => void;
export type HMRErrorListener = (data: Event) => void;

class HMREventSource {
  private _idCounter: number;
  private _eventSource: EventSource;

  private _errorListeners: Map<number, HMRErrorListener>;
  private _listeners: Map<number, HMREventSourceListener>;

  constructor() {
    this._idCounter = 0;
    this._listeners = new Map();
    this._errorListeners = new Map();

    this._messageHandler = this._messageHandler.bind(this);
    this._errorHandler = this._errorHandler.bind(this);

    this._eventSource = new EventSource(
      `http://${window.parent.__ima_hmr.options.public}/__webpack_hmr`
    );
    this._eventSource.addEventListener('message', this._messageHandler);
    this._eventSource.addEventListener('error', this._errorHandler);
  }

  private _messageHandler(event: MessageEvent): void {
    if (!event.data.includes('action')) {
      return;
    }

    try {
      const data: HMRMessageData = JSON.parse(event?.data);

      for (const listener of this._listeners.values()) {
        listener(data);
      }
    } catch (error) {
      console.error('Unable to parse webpack HMR event source', error);
    }
  }

  private _errorHandler(event: Event): void {
    for (const listener of this._errorListeners.values()) {
      listener(event);
    }
  }

  addListener(listener: HMREventSourceListener): number {
    const listenerId = this._idCounter++;
    this._listeners.set(listenerId, listener);

    return listenerId;
  }

  addErrorListener(listener: HMRErrorListener): number {
    const listenerId = this._idCounter++;
    this._errorListeners.set(listenerId, listener);

    return listenerId;
  }

  removeListener(listenerId: number): boolean {
    return this._listeners.delete(listenerId);
  }
}

// Ensure there's only one instance
function getEventSource(): HMREventSource {
  if (!window.__ima_hmr?.hmrEventSource) {
    window.__ima_hmr.hmrEventSource = new HMREventSource();
  }

  return window.__ima_hmr.hmrEventSource;
}

export { HMREventSource, getEventSource };
