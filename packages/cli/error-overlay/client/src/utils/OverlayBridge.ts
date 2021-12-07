import { OverlayEventName, ClientEventName } from '../../../types';

class OverlayBridge {
  iframe?: HTMLIFrameElement;

  private _isReady = false;
  private _eventsQueue: CustomEvent[] = [];

  private _readyHandler(): void {
    this._isReady = true;
    this._eventsQueue.forEach(customEvent => {
      this._dispatchEvent(customEvent);
    });

    this._eventsQueue = [];
  }

  private _dispatchEvent(customEvent: CustomEvent) {
    if (!this._isReady) {
      this._eventsQueue.push(customEvent);
    } else {
      this.iframe?.contentWindow?.dispatchEvent(customEvent);
    }
  }

  init(iframe: HTMLIFrameElement): void {
    this.iframe = iframe;

    window.addEventListener(
      OverlayEventName.Ready,
      this._readyHandler.bind(this)
    );
  }

  clearErrors(): void {
    console.count('clearErrors');
    this._dispatchEvent(new CustomEvent(ClientEventName.ClearErrors));
  }

  sendCompileError(error: string): void {
    console.count('sendCompileError');
    this._dispatchEvent(
      new CustomEvent<{ error: string }>(ClientEventName.CompileErrors, {
        detail: { error }
      })
    );
  }

  sendRuntimeError(error: Error): void {
    console.count('sendRuntimeError');
    this._dispatchEvent(
      new CustomEvent<{ error: Error }>(ClientEventName.RuntimeErrors, {
        detail: { error }
      })
    );
  }
}

const overlayBridge = new OverlayBridge();
export { overlayBridge };
