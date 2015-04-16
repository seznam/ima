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

		this._view = this._React.createClass({
			mixins: [self._viewMixin],
			displayName: '',
			/* jshint ignore:start */
			render() {
				var error = this.state.error || {};
				var message = error.message || '';
				var stack = error.stack || '';

				return (
					<div className='l-error'>
						<h1>500 - Error</h1>
						<div className="message">
							{message}
						</div>
						<pre>
							{stack}
						</pre>
					</div>
				);
			}
			/* jshint ignore:end */
		});

		return this;
	}
}

ns.App.Page.Error.View = View;