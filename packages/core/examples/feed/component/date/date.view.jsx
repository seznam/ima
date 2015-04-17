import ns from 'imajs/client/core/namespace.js';
import bootstrap from 'imajs/client/core/bootstrap.js';

bootstrap.addComponent((utils) => {

	ns.namespace('App.Component.Date');

	/**
	 * Feed writing.
	 * @class View
	 * @namespace App.Component.Date
	 * @module App
	 * @submodule Component
	 */
	/* jshint ignore:start */
	ns.App.Component.Date.View = React.createClass({
		render() {
			var date = this.props.date || new Date();

			var formattedDate = utils.dictionary.get('home.dateFormat', {
				DATE: date.getDate(),
				MONTH: date.getMonth()+1,
				YEAR: date.getFullYear()
			});

			return (
				<div className='date'>
					{formattedDate}
				</div>
			);
		}
	});
	/* jshint ignore:end */
});
