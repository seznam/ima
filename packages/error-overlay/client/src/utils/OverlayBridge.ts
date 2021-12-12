import { OverlayEventName, ClientEventName } from '../../../types';
import overlayIndexHtml from './overlayIndex.html';

const OVERLAY_IFRAME_ID = 'ima-error-overlay';

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
  }

  compileError(error: string): void {
    if (!error) {
      return;
    }

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
    iframe.style.zIndex = '2147483647';

    // Insert into body
    document.body.appendChild(iframe);

    // Insert overlay html into iframe contents
    iframe.contentWindow?.document.open();
    iframe.contentWindow?.document.write(overlayIndexHtml);
    iframe.contentWindow?.document.close();
  }
}

const overlayBridge = new OverlayBridge();
export { overlayBridge };
