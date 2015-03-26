import ns from 'core/namespace/ns.js';

ns.namespace('App.Page.Error');
/**
 * ErrorPage view.
 *
 * @class View
 * @extends Core.Abstract.View
 * @namespace App.Page.Error
 * @module App
 * @submodule App.Page
 *
 */
class View extends ns.Core.Abstract.View {

	/*
	* @method constructor
	* @constructor
	* @param {Vendor.React} react
	* */
	constructor(react) {
		super(react);
	}

	/**
	 * Initialization view.
	 *
	 * @method init
	 * @param {App.Page.Error.Controller} cotroller
	 * */
	init(controller) {
		super.init(controller);
		var self = this;

		this._view = this._react.createClass({
			mixins: [self._viewConfig],
			displayName: '',
			/* jshint ignore:start */
			render() {

				return (
					<div className='l-error'>
						<div className="message"><h1>500 - Error</h1></div>
					</div>
				);
			}
			/* jshint ignore:end */
		});

		return this;
	}
}

ns.App.Page.Error.View = View;