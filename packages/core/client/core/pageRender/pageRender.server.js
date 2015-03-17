import ns from 'core/namespace/ns.js';

ns.namespace('Core.PageRender');

/**
 * @class Server
 * @extends Core.Abstract.PageRender
 * @namespace Core.PageRender
 * @module Core
 * @submodule Core.PageRender
 * */
class Server extends ns.Core.Abstract.PageRender {

	/**
	 * @method contructor
	 * @constructor
	 * @param {Vendor.Rsvp} rsvp
	 * @param {Vendor.React} react
	 * @param {Core.Animate.Handler} animate
	 * @param {Object} setting
	 * */
	constructor(rsvp, react, animate, setting) {
		super(rsvp, react, animate, setting);
	}

	/**
	 * Render page for controller.
	 *
	 * @method render
	 * @param {Core.Abstract.Controller} controller
	 * @param {Object} params
	 * @param {Core.Router.Request} request
	 * @param {Core.Router.Respond} respond
	 * */
	render(controller, params, request, respond) {
		super.render(controller, params);

		var loadPromises = controller.load();

		this._rsvp
			.hash(loadPromises)
			.then((resolvedPromises) => {
				var state = controller.getState();

				for (var key of Object.keys(resolvedPromises)) {
					state[key] = resolvedPromises[key];
				}

				controller.setState(state);
				controller.setSeoParams(resolvedPromises);

				var pageMarkup = this._react.renderToString(controller.getView());

				var appMarkup = this._react.renderToStaticMarkup(ns.oc.get(this._setting.$PageRender.masterView)({
					page: pageMarkup,
					scripts: this._getScripts(),
					seo: controller.getSeoParams()
				}));

				respond
					.status(controller.getHttpStatus())
					.send('<!doctype html>\n' + appMarkup);

			}).catch((reason) => {
				console.error('PageRender.render catch:', reason, reason.stack);
				var status = reason instanceof ns.oc.get('Error') ? reason.getHttpStatus() : 500;
				respond
					.status(status)
					.send('PageRender.render Catch:' + reason.message + '<pre>' + reason.stack + '</pre><pre>' + JSON.stringify(reason._params) + '</pre>');
			});
	}

	/**
	 * Return scripts tag for page.
	 *
	 * @method _getScripts
	 * @private
	 * @param {String} language
	 * @return {String}
	 * */
	_getScripts() {
		var scripts = [];
		var html = '';

		scripts = this._setting.$PageRender.scripts
			.map((script) => {
				return `<script src="${script}"></script>`;
			});

		scripts.push('<script> window.$IzoApp = window.$IMA || {};' +
		' window.$IMA.Cache = ' + (ns.oc.get('$Cache').serialize()) + ';' +
		' window.$IMA.Language = "' + (this._setting.$Language) + '";' +
		' window.$IMA.Enviroment = "' + (this._setting.$Env) + '";' +
		' window.$IMA.Protocol = document.location.protocol;' +
		'</script>');
		html = scripts.join('');

		return html;
	}
}

ns.Core.PageRender.Server = Server;