/* @if server **
export default class ClientPageRenderer {};
/* @else */
import { ReactElement } from 'react';
import { createRoot, hydrateRoot, Root } from 'react-dom/client';

import AbstractClientPageRenderer from './AbstractClientPageRenderer';

/**
 * Client-side page renderer. The renderer attempts to reuse the markup sent by
 * server if possible.
 */
export default class ClientPageRenderer extends AbstractClientPageRenderer {
  private _reactRoot?: Root;

  unmount(): void {
    if (this._reactRoot) {
      this._reactRoot.unmount();
      this._mounted = false;
      this._reactRoot = undefined;
      this._runUnmountCallback();
    }
  }

  protected _hydrateViewAdapter(): void {
    this._reactRoot = hydrateRoot(
      this._viewContainer as Element,
      this._getViewAdapterElement({
        refCallback: this._getHydrateCallback(),
      }) as ReactElement
    );
  }

  protected _renderViewAdapter(callback: () => void, props?: unknown): void {
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
