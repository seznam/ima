import ns from 'core/namespace/ns.js';

var boot = ns.oc.get('$Boot');

boot.addComponent(() => {

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

			var dictionary = ns.oc.get('$Dictionary');
			var formattedDate = dictionary.get('home.dateFormat', {
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
