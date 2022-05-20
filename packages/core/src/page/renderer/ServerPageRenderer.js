import { processContent } from '@ima/helpers';

import AbstractPageRenderer from './AbstractPageRenderer';
import GenericError from '../../error/GenericError';

// @server-side class ServerPageRenderer extends __VARIABLE__ {__CLEAR__}\nexports.default = ServerPageRenderer;

let runner = '';

//#if _SERVER
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
  /**
   * Initializes the server-side page renderer.
   *
   * @param {PageRendererFactory} factory Factory for receive $Utils to view.
   * @param {vendor.$Helper} Helper The IMA.js helper methods.
   * @param {vendor.ReactDOMServer} ReactDOMServer React framework instance
   *        to use to render the page on the server side.
   * @param {Dispatcher} dispatcher Dispatcher fires events to app.
   * @param {Object<string, *>} settings Application setting for the current
   *        application environment.
   * @param {Response} response Utility for sending the page markup to the
   *        client as a response to the current HTTP request.
   * @param {Cache} cache Resource cache caching the results of HTTP requests
   *        made by services used by the rendered page.
   */
  constructor(
    factory,
    Helper,
    ReactDOMServer,
    dispatcher,
    settings,
    response,
    cache
  ) {
    super(factory, Helper, ReactDOMServer, dispatcher, settings);

    /**
     * Utility for sending the page markup to the client as a response to
     * the current HTTP request.
     *
     * @type {Response}
     */
    this._response = response;

    /**
     * The resource cache, caching the results of all HTTP requests made by
     * the services using by the rendered page. The state of the cache will
     * then be serialized and sent to the client to re-initialize the page
     * at the client side.
     *
     * @type {Cache}
     */
    this._cache = cache;
  }

  /**
   * @inheritdoc
   * @abstract
   * @method mount
   */
  mount(controller, view, pageResources, routeOptions) {
    if (this._response.isResponseSent()) {
      return Promise.resolve(this._response.getResponseParams());
    }

    return this._Helper
      .allPromiseHash(pageResources)
      .then(pageState =>
        this._renderPage(controller, view, pageState, routeOptions)
      );
  }

  /**
   * @inheritdoc
   * @method update
   */
  update() {
    return Promise.reject(
      new GenericError('The update() is denied on server side.')
    );
  }

  /**
   * @inheritdoc
   * @method unmount
   */
  unmount() {
    // nothing to do
  }

  /**
   * The javascript code will include a settings the "revival" data for the
   * application at the client-side.
   *
   * @param {object} props Revival settings properties passed to $IMA
   *         object on window.
   * @return {string} The javascript code to include into the
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
   * Creates a copy of the provided data map object that has the values of
   * its fields wrapped into Promises.
   *
   * The the values that are already Promises will referenced directly
   * without wrapping then into another Promise.
   *
   * @param {Object<string, *>=} [dataMap={}] A map of data that should have
   *        its values wrapped into Promises.
   * @return {Object<string, Promise>} A copy of the provided data map that
   *         has all its values wrapped into promises.
   */
  _wrapEachKeyToPromise(dataMap = {}) {
    let copy = {};

    for (let field of Object.keys(dataMap)) {
      let value = dataMap[field];

      if (value instanceof Promise) {
        copy[field] = value;
      } else {
        copy[field] = Promise.resolve(value);
      }
    }

    return copy;
  }

  /**
   * Render page after all promises from loaded resources is resolved.
   *
   * @param {AbstractController} controller
   * @param {React.Component} view
   * @param {Object<string, *>} pageState
   * @param {Object<string, *>} routeOptions
   * @return {{content: string, status: number,
   *         pageState: Object<string, *>}}
   */
  _renderPage(controller, view, pageState, routeOptions) {
    if (!this._response.isResponseSent()) {
      controller.setState(pageState);
      controller.setMetaParams(pageState);

      this._response
        .status(controller.getHttpStatus())
        .setPageState(pageState)
        .send(this._renderPageContentToString(controller, view, routeOptions));
    }

    return this._response.getResponseParams();
  }

  /**
   * Render page content to a string containing HTML markup.
   *
   * @param {AbstractController} controller
   * @param {function(new: React.Component)} view
   * @param {Object<string, *>} routeOptions
   * @return {string}
   */
  _renderPageContentToString(controller, view, routeOptions) {
    // Render current page to string
    const page = this._ReactDOM.renderToString(
      this._getWrappedPageView(controller, view, routeOptions)
    );

    // Get document view factory
    const documentViewFactory = this._factory.createReactElementFactory(
      this._getDocumentView(routeOptions)
    );

    // Render document view (base HTML) to string
    let appMarkup = this._ReactDOM.renderToStaticMarkup(
      documentViewFactory({
        page,
        $Utils: this._factory.getUtils(),
        metaManager: controller.getMetaManager(),
        revivalSettings: this._getRevivalSettings(),
      })
    );

    // TODO IMA@18 - should be handled in server
    appMarkup = processContent({
      content: appMarkup,
      SPA: false,
      settings: this._settings,
      runner,
    });

    // Return HTML markup with injected styles
    return '<!doctype html>\n' + appMarkup;
  }
  //#endif
}
