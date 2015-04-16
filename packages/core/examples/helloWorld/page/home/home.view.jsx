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
	* @param {Vendor.React} React
	* @param {Object} utils component utils
	*/
	constructor(React, utils) {
		super(React, utils);
	}

	/**
	 * Initialization view.
	 *
	 * @method init
	 * @param {Function} getInitialState
	 */
	init(getInitialState) {
		super.init(getInitialState);
		var self = this;

		this._view = self._React.createClass({
			mixins: [self._viewMixin],
			displayName: '',
			/* jshint ignore:start */
			render() {
				return (
					<div className='l-homepage'>
						<div className='content'>
							<img src="static/img/imajs-logo.png" alt="IMA.js logo"/>
							<h1>{self.utils.dictionary.get('home.hello')}, {this.state.message}</h1>
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