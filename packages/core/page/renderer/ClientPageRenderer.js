// @client-side

import ns from '../../namespace';
import AbstractPageRenderer from './AbstractPageRenderer';
import BlankManagedRootView from './BlankManagedRootView';
import PageRenderer from './PageRenderer';
import PageRendererFactory from './PageRendererFactory';
import AbstractDocumentView from '../AbstractDocumentView';
import Controller from '../../controller/Controller';
import ControllerDecorator from '../../controller/ControllerDecorator';
import MetaManager from '../../meta/MetaManager';
import Window from '../../window/Window';

ns.namespace('ima.page.renderer');

/**
 * Client-side page renderer. The renderer attempts to reuse the markup sent by
 * server if possible.
 *
 * @class ClientPageRenderer
 * @extends AbstractPageRenderer
 * @implements PageRenderer
 * @namespace ima.page.renderer
 * @module ima
 * @submodule ima.page
 */
export default class ClientPageRenderer extends AbstractPageRenderer {

	/**
	 * Initializes the client-side page renderer.
	 *
	 * @method constructor
	 * @constructor
	 * @param {PageRendererFactory} factory Factory for receive $Utils to view.
	 * @param {vendor.$Helper} Helper The IMA.js helper methods.
	 * @param {vendor.ReactDOM} ReactDOM React framework instance to use to
	 *        render the page on the client side.
	 * @param {Object<string, *>} settings The application setting for the
	 *        current application environment.
	 * @param {Window} window Helper for manipulating the global object
	 *        ({@code window}) regardless of the client/server-side
	 *        environment.
	 */
	constructor(factory, Helper, ReactDOM, settings, window) {
		super(factory, Helper, ReactDOM, settings);

		/**
		 * Flag signalling that the page is being rendered for the first time.
		 *
		 * @property _firsTime
		 * @private
		 * @type {boolean}
		 * @default true
		 */
		this._firstTime = true;

		/**
		 * Helper for manipulating the global object ({@code window})
		 * regardless of the client/server-side environment.
		 *
		 * @property _window
		 * @private
		 * @type {Window}
		 */
		this._window = window;

		/**
		 * @property _viewContainer
		 * @private
		 * @type {?HTMLElement}
		 */
		this._viewContainer = null;
	}

	/**
	 * @inheritdoc
	 * @abstract
	 * @method mount
	 */
	mount(controller, view, pageResources, routeOptions) {
		let separatedData = this._separatePromisesAndValues(pageResources);
		let defaultPageState = separatedData.values;
		let loadedPromises = separatedData.promises;

		if (!this._firstTime) {
			controller.setState(defaultPageState);
			this._updateDOM(controller, view);
			this._patchPromisesToState(controller, loadedPromises);
		}

		return (
			this._Helper
				.allPromiseHash(loadedPromises)
				.then((fetchedResources) => {

					if (this._firstTime) {
						Object.assign(defaultPageState, fetchedResources);
						controller.setState(defaultPageState);
						this._renderToDOM(controller, view, routeOptions);
						this._firstTime = false;
					}

					controller.setMetaParams(fetchedResources);
					this._updateMetaAttributes(controller.getMetaManager());

					return {
						content: null,
						status: controller.getHttpStatus()
					};
				})
				.catch((error) => this._handleError(error))
		);
	}

	/**
	 * @inheritdoc
	 * @method update
	 */
	update(controller, resourcesUpdate) {
		let separatedData = this._separatePromisesAndValues(resourcesUpdate);
		let defaultPageState = separatedData.values;
		let updatedPromises = separatedData.promises;

		controller.setState(defaultPageState);
		this._patchPromisesToState(controller, updatedPromises);

		return (
			this._Helper
				.allPromiseHash(updatedPromises)
				.then((fetchedResources) => {
					controller.setMetaParams(controller.getState());
					this._updateMetaAttributes(controller.getMetaManager());

					return {
						content: null,
						status: controller.getHttpStatus()
					};
				})
				.catch((error) => this._handleError(error))
		);
	}

	/**
	 * @inheritdoc
	 * @method unmount
	 */
	unmount() {
		if (this._reactiveView) {
			this._reactiveView.setState({
				$pageView: null
			});
		}
	}

	/**
	 * Show error to console in $Debug mode and re-throw that error
	 * for other error handler.
	 *
	 * @private
	 * @method _handleError
	 * @param {Error} error
	 * @throws {Error} Re-throw handled error.
	 */
	_handleError(error) {
		if ($Debug) {
			console.error('Render Error:', error);
		}

		throw error;
	}

	/**
	 * Patch promise values to controller state.
	 *
	 * @method _patchPromisesToState
	 * @param {ControllerDecorator} controller
	 * @param {Object<string, Promise<*>>} patchedPromises
	 */
	_patchPromisesToState(controller, patchedPromises) {
		for (let resourceName of Object.keys(patchedPromises)) {
			patchedPromises[resourceName]
				.then((resource) => {
					controller.setState({
						[resourceName]: resource
					});
				})
				.catch((error) => this._handleError(error));
		}
	}

	/**
	 * Updates the rendered DOM using the provided controller's state and its
	 * view.
	 *
	 * @private
	 * @method _updateDOM
	 * @param {ControllerDecorator} controller
	 * @param {function(new: React.Component)} view
	 */
	_updateDOM(controller, view) {
		if (!this._reactiveView) {
			return;
		}

		this._reactiveView.setState(Object.assign({}, controller.getState(), {
			$pageView: view
		}));
	}

	/**
	 * Renders the current route to DOM.
	 *
	 * @private
	 * @method _renderToDOM
	 * @param {ControllerDecorator} controller
	 * @param {function(new: React.Component)} view
	 * @param {{
	 *          onlyUpdate: (
	 *            boolean|
	 *            function(
	 *              (string|function(new: Controller, ...*)),
	 *              (
	 *                string|
	 *                function(
	 *                  new: React.Component,
	 *                  Object<string, *>,
	 *                  ?Object<string, *>
	 *                )
	 *              )
	 *            ): boolean
	 *          ),
	 *          autoScroll: boolean,
	 *          allowSPA: boolean,
	 *          documentView: ?function(new: AbstractDocumentView),
	 *          managedRootView: ?function(new: React.Component)
	 *        }} routeOptions The current route options.
	 */
	_renderToDOM(controller, view, routeOptions) {
		let configuredManagedRootView =
				routeOptions.managedRootView ||
				this._settings.$Page.$Render.managedRootView ||
				BlankManagedRootView;
		let managedRootView = this._factory.getManagedRootView(
			configuredManagedRootView
		);
		let props = this._generateViewProps(
			managedRootView,
			Object.assign({}, controller.getState(), { $pageView: view })
		);
		let reactElementView = this._factory.wrapView(props);

		let configuredDocumentView = routeOptions.documentView ||
			this._settings.$Page.$Render.documentView;
		let documentView = this._factory.getDocumentView(
			configuredDocumentView
		);

		let masterElementId = documentView.masterElementId;
		this._viewContainer = this._window.getElementById(masterElementId);

		this._reactiveView = this._ReactDOM.render(
			reactElementView,
			this._viewContainer
		);
	}

	/**
	 * Separate promises and values from provided data map. Values will be use
	 * for default page state. Promises will be patched to state after their
	 * resolve.
	 *
	 * @method _separatePromisesAndValues
	 * @private
	 * @param {Object<string, *>} dataMap A map of data.
	 * @return {{
	 *           promises: Object<string, Promise<*>>,
	 *           values: Object<string, *>
	 *         }} Return separated promises and other values.
	 */
	_separatePromisesAndValues(dataMap) {
		let promises = {};
		let values = {};

		for (let field of Object.keys(dataMap)) {
			let value = dataMap[field];

			if (value instanceof Promise) {
				promises[field] = value;
			} else {
				values[field] = value;
			}
		}

		return { promises, values };
	}

	/**
	 * Updates the title and the contents of the meta elements used for SEO.
	 *
	 * @private
	 * @method _updateMetaAttributes
	 * @param {MetaManager} metaManager meta attributes storage providing the
	 *        new values for page meta elements and title.
	 */
	_updateMetaAttributes(metaManager) {
		this._window.setTitle(metaManager.getTitle());

		this._updateMetaNameAttributes(metaManager);
		this._updateMetaPropertyAttributes(metaManager);
		this._updateMetaLinkAttributes(metaManager);
	}

	/**
	 * Updates the contents of the generic meta elements used for SEO.
	 *
	 * @private
	 * @method _updateMetaNameAttributes
	 * @param {MetaManager} metaManager meta attributes storage providing the
	 *        new values for page meta elements and title.
	 */
	_updateMetaNameAttributes(metaManager) {
		let metaTagKey = null;
		let metaTag;

		for (metaTagKey of metaManager.getMetaNames()) {
			metaTag = this._window.querySelector(`meta[name="${metaTagKey}"]`);

			if (metaTag) {
				metaTag.content = metaManager.getMetaName(metaTagKey);
			}
		}
	}

	/**
	 * Updates the contents of the specialized meta elements used for SEO.
	 *
	 * @private
	 * @method _updateMetaPropertyAttributes
	 * @param {MetaManager} metaManager meta attributes storage providing the
	 *        new values for page meta elements and title.
	 */
	_updateMetaPropertyAttributes(metaManager) {
		let metaTagKey = null;
		let metaTag;

		for (metaTagKey of metaManager.getMetaProperties()) {
			metaTag = this._window.querySelector(
				`meta[property="${metaTagKey}"]`
			);

			if (metaTag) {
				metaTag.content = metaManager.getMetaProperty(metaTagKey);
			}
		}
	}

	/**
	 * Updates the href of the specialized link elements used for SEO.
	 *
	 * @private
	 * @method _updateMetaLinkAttributes
	 * @param {MetaManager} metaManager meta attributes storage providing the
	 *        new values for page meta elements and title.
	 */
	_updateMetaLinkAttributes(metaManager) {
		let linkTagKey = null;
		let linkTag;

		for (linkTagKey of metaManager.getLinks()) {
			linkTag = this._window.querySelector(
				`link[rel="${linkTagKey}"]`
			);

			if (linkTag && linkTag.href) {
				linkTag.href = metaManager.getLink(linkTagKey);
			}
		}
	}
}

ns.ima.page.renderer.ClientPageRenderer = ClientPageRenderer;
