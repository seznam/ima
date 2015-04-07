import ns from 'core/namespace/ns.js';

ns.namespace('Core.PageRender');

/**
 * @class Server
 * @extends Core.Abstract.PageRender
 * @namespace Core.PageRender
 * @module Core
 * @submodule Core.PageRender
 */
class Server extends ns.Core.Abstract.PageRender {

	/**
	 * @method contructor
	 * @constructor
	 * @param {Vendor.Rsvp} rsvp
	 * @param {Vendor.React} react
	 * @param {Core.Animate.Handler} animate
	 * @param {Object} setting
	 * @param {Core.Router.Respond} respond
	 * @param {Core.Interface.Cache} cache
	 */
	constructor(rsvp, react, animate, setting, respond, cache) {
		super(rsvp, react, animate, setting);

		/**
		 * @property _respond
		 * @private
		 * @type {Core.Router.Respond}
		 * @default respond
		 */
		this._respond = respond;
		
		/**
		 * @property _cache
		 * @private
		 * @type {Core.Interface.Cache}
		 * @default 
		 */
		this._cache = cache;

	}

	/**
	 * Render page for controller.
	 *
	 * @method render
	 * @param {Core.Abstract.Controller} controller
	 * @param {Object} params
	 */
	render(controller, params) {
		super.render(controller, params);

		var loadPromises = this._wrapEachKeyToPromise(controller.load());

		return (
			this._rsvp
				.hash(loadPromises)
				.then((resolvedPromises) => {
					var state = controller.getState();

					for (var key of Object.keys(resolvedPromises)) {
						state[key] = resolvedPromises[key];
					}

					controller.setState(state);
					controller.setSeoParams(resolvedPromises, this._setting);

					var pageMarkup = this._react.renderToString(controller.getReactView());

					var appMarkup = this._react.renderToStaticMarkup(ns.oc.get(this._setting.$PageRender.masterView)({
						page: pageMarkup,
						scripts: this._getScripts(),
						seo: controller.getSeoHandler()
					}));

					this._respond
						.status(controller.getHttpStatus())
						.send('<!doctype html>\n' + appMarkup);
				})
		);
	}

	/**
	 * Return scripts tag for page.
	 *
	 * @method _getScripts
	 * @private
	 * @param {String} language
	 * @return {String}
	 */
	_getScripts() {
		var scripts = [];
		var html = '';

		scripts = this._setting.$PageRender.scripts
			.map((script) => {
				return `<script src="${script}"></script>`;
			});

		scripts.push('<script> window.$IMA = window.$IMA || {};' +
		' window.$IMA.Cache = ' + (this._cache.serialize()) + ';' +
		' window.$IMA.Language = "' + (this._setting.$Language) + '";' +
		' window.$IMA.Environment = "' + (this._setting.$Env) + '";' +
		' window.$IMA.Protocol = "' + (this._setting.$Protocol) + '";'+
		' window.$IMA.Domain = "' + (this._setting.$Domain) + '";'+
		' window.$IMA.Root = "' + (this._setting.$Root) + '";'+
		' window.$IMA.LanguagePartPath = "' + (this._setting.$LanguagePartPath) + '";'+
		'</script>');
		html = scripts.join('');

		return html;
	}
}

ns.Core.PageRender.Server = Server;