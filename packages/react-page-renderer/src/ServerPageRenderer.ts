import { Cache, ControllerDecorator, Dispatcher, Response } from '@ima/core';
import { Attributes, ComponentType, createElement, ReactElement } from 'react';
//#if _SERVER
/* eslint-disable import/no-duplicates,import/order */
import { GenericError } from '@ima/core';
/* eslint-enable */
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
//#endif

import AbstractPageRenderer from './AbstractPageRenderer';
import PageRendererFactory from './PageRendererFactory';
import { Helpers, RouteOptions, Settings } from './types';

// @server-side class ServerPageRenderer extends __VARIABLE__ {__CLEAR__}\nexports.default = ServerPageRenderer;

let runner = '';

//#if _SERVER
/* eslint-disable @typescript-eslint/no-var-requires */
if (typeof window === 'undefined' || window === null) {
  const fs = require('fs');
  const path = require('path');
  const runnerPath = path.resolve('./build/static/public/runner.js');

  if (fs.existsSync(runnerPath)) {
    runner = fs.readFileSync(
      path.resolve('./build/static/public/runner.js'),
      'utf8'
    );
  }
}
/* eslint-enable */
//#endif

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
  //#if _SERVER
  private _response: Response;
  private _cache: Cache;

  /**
   * Initializes the server-side page renderer.
   *
   * @param factory Factory for receive $Utils to view.
   * @param helpers The IMA.js helper methods.
   * @param dispatcher Dispatcher fires events to app.
   * @param settings Application setting for the current
   *        application environment.
   * @param response Utility for sending the page markup to the
   *        client as a response to the current HTTP request.
   * @param cache Resource cache caching the results of HTTP requests
   *        made by services used by the rendered page.
   */
  constructor(
    factory: PageRendererFactory,
    helpers: Helpers,
    dispatcher: Dispatcher,
    settings: Settings,
    response: Response,
    cache: Cache
  ) {
    super(factory, helpers, dispatcher, settings);

    /**
     * Utility for sending the page markup to the client as a response to
     * the current HTTP request.
     */
    this._response = response;

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
    if (this._response.isResponseSent()) {
      return Promise.resolve(this._response.getResponseParams());
    }

    return this._helpers.allPromiseHash(pageResources).then(pageState => {
      if (!this._response.isResponseSent()) {
        controller.setState(pageState as { [key: string]: unknown });
        controller.setMetaParams(pageState as { [key: string]: unknown });

        this._response
          .status(controller.getHttpStatus())
          .setPageState(pageState as { [key: string]: unknown })
          .send(
            this._renderPageViewToString(controller, pageView, routeOptions)
          );
      }

      return this._response.getResponseParams();
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

  /**
   * Render page content to a string containing HTML markup.
   */
  _renderPageViewToString(
    controller: ControllerDecorator,
    pageView: ComponentType,
    routeOptions: RouteOptions
  ) {
    this._prepareViewAdapter(controller, pageView, routeOptions);

    // Render current page to string
    const page = renderToString(this._getViewAdapterElement() as ReactElement);

    // Render document view (base HTML) to string
    let appMarkup = renderToStaticMarkup(
      createElement(this._getDocumentView(routeOptions), {
        page,
        $Utils: this._factory.getUtils(),
        metaManager: controller.getMetaManager(),
        revivalSettings: this._getRevivalSettings(),
      } as Attributes)
    );

    // TODO IMA@18 - should be handled in server
    appMarkup = this._helpers.processContent({
      content: appMarkup,
      SPA: false,
      settings: this._settings,
      runner,
    });

    // Return HTML markup with injected styles
    return '<!doctype html>\n' + appMarkup;
  }
  //#endif
  /* eslint-disable */
  ; // TODO Remove when jscc is not longer used.
  /* eslint-enable */
}
