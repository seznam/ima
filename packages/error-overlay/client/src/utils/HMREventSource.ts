import { HMRMessageData } from 'types';

export type HMREventSourceListener = (data: HMRMessageData) => void;

class HMREventSource {
  private _idCounter: number;
  private _eventSource: EventSource;
  private _listeners: Map<number, HMREventSourceListener>;

  constructor() {
    this._idCounter = 0;
    this._listeners = new Map();
    this._messageHandler = this._messageHandler.bind(this);

    this._eventSource = new EventSource('/__webpack_hmr');
    this._eventSource.addEventListener('message', this._messageHandler);
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

  addListener(listener: HMREventSourceListener): number {
    const listenerId = this._idCounter++;
    this._listeners.set(listenerId, listener);

    return listenerId;
  }

  removeListener(listenerId: number): boolean {
    return this._listeners.delete(listenerId);
  }
}

const hmrEventSource = new HMREventSource();
export { hmrEventSource };
