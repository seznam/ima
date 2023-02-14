/* @if server **
export class LegacyClientPageRenderer {};
/* @else */
import { ReactElement } from 'react';
import { hydrate, render, unmountComponentAtNode } from 'react-dom';

import { AbstractClientPageRenderer } from './AbstractClientPageRenderer';

/**
 * Client-side page renderer. The renderer attempts to reuse the markup sent by
 * server if possible.
 */
export class LegacyClientPageRenderer extends AbstractClientPageRenderer {
  unmount() {
    if (this._viewContainer && unmountComponentAtNode(this._viewContainer)) {
      this._runUnmountCallback();
    }
    super.unmount();
  }

  protected _hydrateViewAdapter(): void {
    hydrate(
      this._getViewAdapterElement() as ReactElement,
      this._viewContainer as Element,
      this._getHydrateCallback()
    );
  }

  protected _renderViewAdapter(callback?: () => void, props?: unknown): void {
    render(
      this._getViewAdapterElement(Object.assign({}, props)) as ReactElement,
      this._viewContainer as Element,
      callback
    );
  }
}
/* @endif */
