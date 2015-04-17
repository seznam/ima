import ns from 'imajs/client/core/namespace.js';

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
	 * @param {Vendor.React} React
	 * @param {Object} utils
	 */
	constructor(React, utils) {
		super(React, utils);
	}

	/**
	 * Initialization view.
	 *
	 * @method init
	 * @param {function()} getInitializationState
	 */
	init(getInitializationState) {
		super.init(getInitializationState);
		var self = this;

		this._view = this._React.createClass({
			mixins: [self._viewMixin],
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