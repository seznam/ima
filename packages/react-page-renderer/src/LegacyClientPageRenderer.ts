// @client-side
import { ReactElement } from 'react';
import { hydrate, render, unmountComponentAtNode } from 'react-dom';

import ClientPageRenderer from './ClientPageRenderer';

/**
 * Client-side page renderer. The renderer attempts to reuse the markup sent by
 * server if possible.
 */
export default class LegacyClientPageRenderer extends ClientPageRenderer {
  setState(pageState = {}) {
    if (this._viewAdapter) {
      render(
        this._getViewAdapterElement({ state: pageState }) as ReactElement,
        this._viewContainer as Element,
        this._getUpdateCallback(pageState)
      );
    }
  }

  unmount() {
    if (this._viewContainer && unmountComponentAtNode(this._viewContainer)) {
      this._runUnmountCallback();
    }
  }

  protected _hydrate() {
    hydrate(
      this._getViewAdapterElement() as ReactElement,
      this._viewContainer as Element,
      this._getHydrateCallback()
    );
  }

  protected _render() {
    render(
      this._getViewAdapterElement() as ReactElement,
      this._viewContainer as Element,
      this._getRenderCallback()
    );
  }
}
