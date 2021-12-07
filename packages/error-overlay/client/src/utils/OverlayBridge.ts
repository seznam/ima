import { OverlayEventName, ClientEventName } from '../../../types';

class OverlayBridge {
  iframe?: HTMLIFrameElement;

  private _isReady = false;
  private _eventsQueue: CustomEvent[] = [];

  private _readyHandler(): void {
    this._isReady = true;
    let customEvent;

    while ((customEvent = this._eventsQueue.pop())) {
      this._dispatchEvent(customEvent);
    }
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

  compileError(error: string): void {
    // eslint-disable-next-line no-console
    console.count('sendCompileError');
    this._dispatchEvent(
      new CustomEvent<{ error: string }>(ClientEventName.CompileErrors, {
        detail: { error }
      })
    );
  }

  clearCompileErrors(): void {
    // Send only when ready without using events queue
    if (this._isReady) {
      this._dispatchEvent(new CustomEvent(ClientEventName.ClearCompileErrors));
    }
  }

  runtimeError(error: Error): void {
    // eslint-disable-next-line no-console
    console.count('sendRuntimeError');
    this._dispatchEvent(
      new CustomEvent<{ error: Error }>(ClientEventName.RuntimeErrors, {
        detail: { error }
      })
    );
  }

  clearRuntimeErrors(): void {
    // Send only when ready without using events queue
    if (this._isReady) {
      this._dispatchEvent(new CustomEvent(ClientEventName.ClearRuntimeErrors));
    }
  }
}

const overlayBridge = new OverlayBridge();
export { overlayBridge };
