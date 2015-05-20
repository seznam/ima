import ns from 'imajs/client/core/namespace.js';
import component from 'imajs/client/core/component.js';

component.add((utils) => {

	ns.namespace('App.Component.Date');

	/**
	 * Date Component.
	 * @class View
	 * @namespace App.Component.Date
	 * @module App
	 * @submodule Component
	 */
	class View extends React.Component {

		constructor(props) {
			super(props);
		}

		render() {
			var date = this.props.date || new Date();

			var formattedDate = utils.$Dictionary.get('home.dateFormat', {
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
	}
	
	ns.App.Component.Date.View = View;
});
