/* @if server **
export class ClientPageRenderer {};
/* @else */
import { RendererEvents } from '@ima/core';
import { ReactElement } from 'react';
import { createRoot, hydrateRoot, Root } from 'react-dom/client';

import { AbstractClientPageRenderer } from './AbstractClientPageRenderer';

/**
 * Client-side page renderer. The renderer attempts to reuse the markup sent by
 * server if possible.
 */
export class ClientPageRenderer extends AbstractClientPageRenderer {
  private _reactRoot?: Root;

  unmount(): void {
    if (this._reactRoot) {
      this._reactRoot.unmount();
      this._reactRoot = undefined;
      this._runUnmountCallback();
    }
    super.unmount();
  }

  protected _hydrateViewAdapter(): void {
    const serverNode = this._viewContainer?.cloneNode(true);
    this._reactRoot = hydrateRoot(
      this._viewContainer as Element,
      this._getViewAdapterElement({
        refCallback: this._getHydrateCallback(),
      }) as ReactElement,
      {
        onRecoverableError: error => {
          if ($Debug) {
            console.error('onRecoverableError', error);
          }

          this._dispatcher.fire(
            RendererEvents.HYDRATE_ERROR,
            {
              error,
              serverNode,
              clientNode: this._viewContainer?.cloneNode(true),
            },
            true
          );
        },
      }
    );
  }

  protected _renderViewAdapter(callback?: () => void, props?: unknown): void {
    if (!this._reactRoot) {
      this._reactRoot = createRoot(this._viewContainer as Element);
    }

    this._reactRoot.render(
      this._getViewAdapterElement(
        Object.assign({}, props, {
          refCallback: callback,
        })
      ) as ReactElement
    );
  }
}
/* @endif */
