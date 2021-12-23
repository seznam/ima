import { StatsError } from 'webpack';

import { OverlayEventName, ClientEventName } from '#/types';

import overlayIndexHtml from '../public/overlayIndex.html';

const OVERLAY_IFRAME_ID =
  'ima-error-overlay-bf121178-c2b6-556d-a702-b7d2987bbf51';

class OverlayBridge {
  private _isReady = false;
  private _eventsQueue: CustomEvent[] = [];

  get iframe(): HTMLIFrameElement | null {
    const iframe = document.getElementById(OVERLAY_IFRAME_ID);

    if (!iframe) {
      return null;
    }

    return iframe as HTMLIFrameElement;
  }

  init(): void {
    if (this.iframe) {
      return;
    }

    // Create iframe
    this._isReady = false;
    this._createIframe();

    // Add ready handler to initialize overlay connection
    this._readyHandler = this._readyHandler.bind(this);
    window.addEventListener(OverlayEventName.Ready, this._readyHandler);

    // Close iframe handler
    this._closeHandler = this._closeHandler.bind(this);
    window.addEventListener(OverlayEventName.Close, this._closeHandler);
  }

  compileError(errors: StatsError[]): void {
    if (!errors) {
      return;
    }

    this._dispatchEvent(
      new CustomEvent<{ errors: StatsError[] }>(ClientEventName.CompileErrors, {
        detail: { errors }
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
    this._isReady = true;
    let customEvent;

    while ((customEvent = this._eventsQueue.pop())) {
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

  private _createIframe(): void {
    const iframe = document.createElement('iframe');

    iframe.id = OVERLAY_IFRAME_ID;
    iframe.src = 'about:blank';

    // Iframe styles
    iframe.style.border = 'none';
    iframe.style.height = '100%';
    iframe.style.left = '0';
    iframe.style.minHeight = '100vh';
    iframe.style.minHeight = '-webkit-fill-available';
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.width = '100vw';
    iframe.style.zIndex = '2147483646';

    // Insert into body
    document.body.appendChild(iframe);

    // Insert overlay html into iframe contents
    iframe.contentWindow?.document.open();
    iframe.contentWindow?.document.write(overlayIndexHtml);
    iframe.contentWindow?.document.close();
  }
}

// Ensure there's only one instance
function getOverlayBridge(): OverlayBridge {
  if (!window.__ima_hmr?.overlayBridge) {
    window.__ima_hmr = window.__ima_hmr || {};
    window.__ima_hmr.overlayBridge = new OverlayBridge();
  }

  return window.__ima_hmr.overlayBridge;
}

export { OverlayBridge, getOverlayBridge };
