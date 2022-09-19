/* @if client **
export default class ServerPageRenderer {};
/* @else */
import { Cache, ControllerDecorator, Dispatcher, GenericError } from '@ima/core';
import { ComponentType } from 'react';


import AbstractPageRenderer from './AbstractPageRenderer';
import PageRendererFactory from './PageRendererFactory';
import { Helpers, RouteOptions, Settings } from './types';

/**
 * Server-side page renderer. The renderer renders the page into the HTML
 * markup and sends it to the client.
 *
 * @class ServerPageRenderer
 * @extends AbstractPageRenderer
 * @implements PageRenderer
 * @namespace ima.core.page.renderer
 * @module ima
 * @submodule ima.core.page
 */
export default class ServerPageRenderer extends AbstractPageRenderer {
  private _cache: Cache;

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
    helpers: Helpers,
    dispatcher: Dispatcher,
    settings: Settings,
    cache: Cache
  ) {
    super(factory, helpers, dispatcher, settings);

    /**
     * The resource cache, caching the results of all HTTP requests made by
     * the services using by the rendered page. The state of the cache will
     * then be serialized and sent to the client to re-initialize the page
     * at the client side.
     */
    this._cache = cache;
  }

  /**
   * @inheritdoc
   */
  mount(
    controller: ControllerDecorator,
    pageView: ComponentType,
    pageResources: { [key: string]: unknown | Promise<unknown> },
    routeOptions: RouteOptions
  ) {
    return this._helpers.allPromiseHash(pageResources).then(pageState => {
      controller.setState(pageState as { [key: string]: unknown });
      controller.setMetaParams(pageState as { [key: string]: unknown });

      this._prepareViewAdapter(controller, pageView, routeOptions);

      return {
        controller,
        documentView: this._getDocumentView(routeOptions),
        revivalSettings: this._getRevivalSettings(),
        settings: this._settings,
        utils: this._factory.getUtils(),
        viewAdapter: this._getViewAdapterElement()
      };
    });
  }

  setState() {
    throw new GenericError('The setState() is denied on server side.');
  }

  /**
   * @inheritdoc
   */
  update() {
    return Promise.reject(
      new GenericError('The update() is denied on server side.')
    );
  }

  /**
   * @inheritdoc
   */
  unmount() {
    // nothing to do
  }

  /**
   * The javascript code will include a settings the "revival" data for the
   * application at the client-side.
   *
   * @return The javascript code to include into the
   *         rendered page.
   */
  _getRevivalSettings() {
    return `
			(function(root) {
				root.$Debug = ${$Debug};
				root.$IMA = root.$IMA || {};
				$IMA.Cache =${this._cache.serialize()};
				$IMA.$Language = "${this._settings.$Language}";
				$IMA.$Env = "${this._settings.$Env}";
				$IMA.$Debug = ${this._settings.$Debug};
				$IMA.$Version = "${this._settings.$Version}";
				$IMA.$App = ${JSON.stringify(this._settings.$App)};
				$IMA.$Protocol = "${this._settings.$Protocol}";
				$IMA.$Host = "${this._settings.$Host}";
				$IMA.$Path = "${this._settings.$Path}";
				$IMA.$Root = "${this._settings.$Root}";
				$IMA.$LanguagePartPath = "${this._settings.$LanguagePartPath}";
			})(typeof window !== 'undefined' && window !== null ? window : global);
      #{$Runner}
			`;
  }
}
/* @endif */
