/* @if client **
export class ServerPageRenderer {};
/* @else */
import type {
  UnknownParameters,
  UnknownPromiseParameters,
  RouteOptions,
  Settings,
} from '@ima/core';
import { ControllerDecorator, Dispatcher, GenericError } from '@ima/core';
import * as Helpers from '@ima/helpers';
import * as react from 'react';
import * as reactDOM from 'react-dom/server';

import { AbstractPageRenderer, PageData } from './AbstractPageRenderer';
import { PageRendererFactory } from './PageRendererFactory';

/**
 * Server-side page renderer. The renderer renders the page into the HTML
 * markup and sends it to the client.
 */
export class ServerPageRenderer extends AbstractPageRenderer {
  /**
   * Initializes the server-side page renderer.
   *
   * @param factory Factory for receive $Utils to view.
   * @param helpers The IMA.js helper methods.
   * @param dispatcher Dispatcher fires events to app.
   * @param settings Application setting for the current
   *        application environment.
   * @param cache Resource cache caching the results of HTTP requests
   *        made by services used by the rendered page.
   */
  constructor(
    factory: PageRendererFactory,
    helpers: typeof Helpers,
    dispatcher: Dispatcher,
    settings: Settings
  ) {
    super(factory, helpers, dispatcher, settings);
  }

  /**
   * @inheritDoc
   */
  mount(
    controller: ControllerDecorator,
    pageView: react.ComponentType,
    pageResources: UnknownPromiseParameters,
    routeOptions: RouteOptions
  ): Promise<void | PageData> {
    return this._helpers.allPromiseHash(pageResources).then(pageState => {
      controller.setState(pageState as UnknownParameters);
      controller.setMetaParams(pageState as UnknownParameters);

      this._prepareViewAdapter(controller, pageView, routeOptions);

      return {
        documentView: this._getDocumentView(routeOptions),
        documentViewProps: {
          $Utils: this._factory.getUtils(),
          metaManager: controller.getMetaManager(),
        },
        react,
        reactDOM,
        status: controller.getHttpStatus(),
        viewAdapter: this._getViewAdapterElement(),
      };
    });
  }

  setState() {
    return Promise.resolve();
  }

  /**
   * @inheritDoc
   */
  update() {
    return Promise.reject(
      new GenericError('The update() is denied on server side.')
    );
  }

  /**
   * @inheritDoc
   */
  unmount() {
    // nothing to do
  }
}
/* @endif */
