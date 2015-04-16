import ns from 'imajs/client/core/namespace.js';

ns.namespace('App.Page.NotFound');
/**
 * NotFoundPage view.
 * @class View
 * @extends Core.Abstract.View
 * @namespace App.Page.NotFound
 * @module App
 * @submodule App.Page
 */
class View extends ns.Core.Abstract.View {

	/*
	* @method constructor
	* @constructor
	* @param {Vendor.React} React
	* */
	constructor(React) {
		super(React);
	}

	/**
	 * Initialization view.
	 *
	 * @method init
	 * @param {App.Page.NotFound.Controller} cotroller
	 * */
	init(controller) {
		super.init(controller);
		var self = this;

		this._view = this._React.createClass({
			mixins: [self._viewMixin],
			displayName: '',
			/* jshint ignore:start */
			render() {
				return (
					<div className='l-not-found'>
						<div className="message"><h1>404 - Not Found</h1></div>
					</div>
				);
			}
			/* jshint ignore:end */
		});

		return this;
	}
}

ns.App.Page.NotFound.View = View;