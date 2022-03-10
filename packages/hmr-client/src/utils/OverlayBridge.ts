import { StatsError } from 'webpack';

import { OverlayEventName, ClientEventName } from '#/types';

import overlayIndexHtml from '../public/overlayIndex.html';

const OVERLAY_IFRAME_ID = '__ima-error-overlay-iframe-id';

class OverlayBridge {
  private _isReady = false;
  private _eventsQueue: CustomEvent[] = [];
  private _imaErrorOverlay: HTMLElement | null = null;

  get iframe(): HTMLIFrameElement | null {
    const iframe = document.getElementById(OVERLAY_IFRAME_ID);

    if (!iframe) {
      return null;
    }

    return iframe as HTMLIFrameElement;
  }

  init(): void {
    if (this._imaErrorOverlay) {
      return;
    }

    this._isReady = false;

    // Add ready handler to initialize overlay connection
    this._readyHandler = this._readyHandler.bind(this);
    window.addEventListener(OverlayEventName.Ready, this._readyHandler);

    // Close iframe handler
    this._closeHandler = this._closeHandler.bind(this);
    window.addEventListener(OverlayEventName.Close, this._closeHandler);

    // Init overlay
    this._imaErrorOverlay = document.createElement('ima-error-overlay');
    document.body.appendChild(this._imaErrorOverlay);
  }

  compileError(errors: StatsError[]): void {
    if (!errors) {
      return;
    }

    this._dispatchEvent(
      new CustomEvent<{ errors: StatsError[] }>(ClientEventName.CompileErrors, {
        detail: { errors },
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
    if (!error) {
      return;
    }

    this._dispatchEvent(
      new CustomEvent<{ error: Error }>(ClientEventName.RuntimeErrors, {
        detail: { error },
      })
    );
  }

  clearRuntimeErrors(): void {
    // Send only when ready without using events queue
    if (this._isReady) {
      this._dispatchEvent(new CustomEvent(ClientEventName.ClearRuntimeErrors));
    }
  }

  destroy(): void {
    if (!this.iframe) {
      return;
    }

    // Remove ready event listeners
    window.removeEventListener(OverlayEventName.Ready, this._readyHandler);
    window.removeEventListener(OverlayEventName.Close, this._closeHandler);

    // Remove iframe and readiness flag
    this._isReady = false;
    this.iframe?.remove();
  }

  private _readyHandler(): void {
    console.log('READY HANDLER');

    this._isReady = true;
    let customEvent;

    while ((customEvent = this._eventsQueue.pop())) {
      console.log('loop', this._eventsQueue);

      this._dispatchEvent(customEvent);
    }
  }

  private _closeHandler(): void {
    this.destroy();
  }

  private _dispatchEvent(customEvent: CustomEvent) {
    if (this._isReady && this.iframe) {
      this.iframe?.contentWindow?.dispatchEvent(customEvent);
    } else {
      this._eventsQueue.push(customEvent);
    }
  }
}

// Ensure there's only one instance
// function getOverlayBridge(): OverlayBridge {
//   if (!window.__ima_hmr?.overlayBridge) {
//     window.__ima_hmr.overlayBridge = new OverlayBridge();
//   }

//   return window.__ima_hmr.overlayBridge;
// }

export { OverlayBridge };
