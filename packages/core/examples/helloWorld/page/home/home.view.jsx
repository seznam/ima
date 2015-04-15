import ns from 'imajs/client/core/namespace.js';
import oc from 'imajs/client/core/objectContainer.js';

ns.namespace('App.Page.Home');
/**
 * HomePage view.
 *
 * @class View
 * @extends Core.Abstract.View
 * @namespace App.Page.Home
 * @module App
 * @submodule App.Page
 *
 * @uses App.Component.Layout.Header.View
 * @uses App.Component.Layout.Main.View
 * @uses App.Component.Sign.List.View
 */
class View extends ns.Core.Abstract.View {

	/*
	* @method constructor
	* @constructor
	* @param {Vendor.React} react
	*/
	constructor(react) {
		super(react);
	}

	/**
	 * Initialization view.
	 *
	 * @method init
	 * @param {App.Page.Home.Controller} cotroller
	 */
	init(controller) {
		super.init(controller);
		var self = this;

		this._view = this._react.createClass({
			mixins: [self._viewConfig],
			displayName: '',
			/* jshint ignore:start */
			render() {
				var Master = ns.App.Component.Layout.Master.View;
				return (
					<div className='l-homepage'>
						<div className='content'>
							<img src="static/img/imajs-logo.png" alt="IMA.js logo"/>
							<h1>{oc.get('$Dictionary').get('home.hello')}, {this.state.message}</h1>
						</div>
					</div>
				);
			}
			/* jshint ignore:end */
		});

		return this;
	}
}

ns.App.Page.Home.View = View;