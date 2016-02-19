import ns from 'imajs/client/core/namespace';
import AbstractPageRender from 'imajs/client/core/abstract/pageRender';

ns.namespace('Core.Page.Render');

/**
 * Client-side page renderer. The renderer attempts to reuse the markup sent by
 * server if possible.
 *
 * @class Client
 * @extends Core.Abstract.PageRender
 * @namespace Core.Page.Render
 * @module Core
 * @submodule Core.Page
 */
export default class Client extends AbstractPageRender {

	/**
	 * Initializes the client-side page renderer.
	 *
	 * @method constructor
	 * @constructor
	 * @param {Core.Page.Render.Factory} factory Factory for receive $Utils to
	 *        view.
	 * @param {Vendor.$Helper} Helper The IMA.js helper methods.
	 * @param {Vendor.ReactDOM} ReactDOM React framework instance to use to
	 *        render the page on the client side.
	 * @param {Object<string, *>} settings The application setting for the
	 *        current application environment.
	 * @param {Core.Interface.Window} window Helper for manipulating the global
	 *        object ({@code window}) regardless of the client/server-side
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
		 * @type {Core.Interface.Window}
		 */
		this._window = window;

		/**
		 * @property _viewContainer
		 * @private
		 * @type {HTMLElement}
		 */
		this._viewContainer = this._window.getElementById(
			this._settings.$Page.$Render.masterElementId
		);
	}

	/**
	 * @inheritdoc
	 * @abstract
	 * @method mount
	 */
	mount(controller, view, loadedPageState) {
		var separatedData = this._separatePromisesAndValues(loadedPageState);
		var defaultPageState = separatedData.values;
		var loadedPromises = separatedData.promises;

		if (this._firstTime === false) {
			controller.setState(defaultPageState);
			this._renderToDOM(controller, view);
			this._patchPromisesToState(controller, loadedPromises);
		}

		return (
			this._Helper
				.allPromiseHash(loadedPromises)
				.then((fetchedResources) => {

					if (this._firstTime === true) {
						Object.assign(defaultPageState, fetchedResources);
						controller.setState(defaultPageState);
						this._renderToDOM(controller, view);
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
	update(controller, updatedPageState) {
		var separatedData = this._separatePromisesAndValues(updatedPageState);
		var defaultPageState = separatedData.values;
		var updatedPromises = separatedData.promises;

		controller.setState(defaultPageState);
		this._patchPromisesToState(controller, updatedPromises);

		return (
			this._Helper
				.allPromiseHash(updatedPromises)
				.then((fetchedResources) => {
					controller.setMetaParams(fetchedResources);
					this._updateMetaAttributes(controller.getMetaManager());
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
			this._ReactDOM.unmountComponentAtNode(this._viewContainer);
			this._reactiveView = null;
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
	 * @param {Core.Decorator.Controller} controller
	 * @param {Object<string, Promise>} patchedPromises
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
	 * Render React element to DOM for controller state.
	 *
	 * @private
	 * @method _renderToDOM
	 * @param {Core.Decorator.Controller} controller
	 * @param {Vendor.React.Component} view
	 */
	_renderToDOM(controller, view) {
		var props = this._generateViewProps(view, controller.getState());
		var reactElementView = this._factory.wrapView(props);

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
	 * @return {{promises: Object<string, Promise>, values: Object<string, *>}}
	 *         Return separated promises and other values.
	 */
	_separatePromisesAndValues(dataMap) {
		var promises = {};
		var values = {};

		for (var field of Object.keys(dataMap)) {
			var value = dataMap[field];

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
	 * @param {Core.Interface.MetaManager} metaManager meta attributes storage
	 *        providing the new values for page meta elements and title.
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
	 * @param {Core.Interface.MetaManager} metaManager meta attributes storage
	 *        providing the new values for page meta elements and title.
	 */
	_updateMetaNameAttributes(metaManager) {
		var metaTagKey = null;
		var metaTag = null;

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
	 * @param {Core.Interface.MetaManager} metaManager meta attributes storage
	 *        providing the new values for page meta elements and title.
	 */
	_updateMetaPropertyAttributes(metaManager) {
		var metaTagKey = null;
		var metaTag = null;

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
	 * @param {Core.Interface.MetaManager} metaManager meta attributes storage
	 *        providing the new values for page meta elements and title.
	 */
	_updateMetaLinkAttributes(metaManager) {
		var linkTagKey = null;
		var linkTag = null;

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

ns.Core.Page.Render.Client = Client;
