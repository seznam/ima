import { HMRMessageData } from '@/utils';

export type HMRReconnectListener = () => void;
export type HMREventSourceListener = (data: HMRMessageData) => void;
export type HMRErrorListener = (data: Event) => void;

const RECONNECT_TIMEOUT = 1500;

/**
 * Initiates connection to webpack-hot-middleware SSE event source.
 */
class HMREventSource {
  private _idCounter: number;
  private _eventSource?: EventSource;
  private _reconnectTimeout?: number;

  private _reconnectListeners: Map<number, HMRReconnectListener>;
  private _errorListeners: Map<number, HMRErrorListener>;
  private _listeners: Map<number, HMREventSourceListener>;

  public publicUrl: string;

  constructor(publicUrl: string) {
    this._idCounter = 0;
    this._reconnectListeners = new Map();
    this._listeners = new Map();
    this._errorListeners = new Map();

    this._reconnectHandler = this._reconnectHandler.bind(this);
    this._messageHandler = this._messageHandler.bind(this);
    this._errorHandler = this._errorHandler.bind(this);

    this.publicUrl = publicUrl;

    // Init event source
    this._init();
  }

  private _init(reconnect = false): void {
    this._eventSource = new EventSource(`${this.publicUrl}/__webpack_hmr`);

    this._eventSource.addEventListener('message', this._messageHandler);
    this._eventSource.addEventListener('error', this._errorHandler);

    // Handle reconnection events
    if (reconnect) {
      const reconnectTimeout = setTimeout(() => {
        this._reconnectHandler();
      }, 50);

      this._eventSource.addEventListener('error', () => {
        clearTimeout(reconnectTimeout);
      });
    }
  }

  private _reconnectHandler(): void {
    for (const listener of this._reconnectListeners.values()) {
      listener();
    }
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
    // Close event source
    if (this._eventSource) {
      this._eventSource.close();
    }

    // Clear pending timeouts
    if (this._reconnectTimeout) {
      window.clearTimeout(this._reconnectTimeout);
    }

    // Create reconnect timeout
    this._reconnectTimeout = window.setTimeout(() => {
      this._init(true);
    }, RECONNECT_TIMEOUT);

    for (const listener of this._errorListeners.values()) {
      listener(event);
    }
  }

  addListener(
    type: 'message' | 'error' | 'reconnect',
    listener: HMREventSourceListener | HMRReconnectListener
  ): number {
    const listenerId = this._idCounter++;

    switch (type) {
      case 'error':
        this._errorListeners.set(listenerId, listener as HMRErrorListener);
        break;

      case 'message':
        this._listeners.set(listenerId, listener as HMREventSourceListener);
        break;

      case 'reconnect':
        this._reconnectListeners.set(
          listenerId,
          listener as HMRReconnectListener
        );
        break;
    }

    return listenerId;
  }

  removeListener(listenerId: number): boolean {
    return this._listeners.delete(listenerId);
  }
}

export { HMREventSource };
