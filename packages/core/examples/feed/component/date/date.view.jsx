import ns from 'imajs/client/core/namespace';
import { React } from 'app/vendor';

ns.namespace('App.Component.Date');

/**
 * Date Component.
 * @class View
 * @namespace App.Component.Date
 * @module App
 * @submodule Component
 */
class View extends ns.Core.Abstract.Component {

	constructor(props) {
		super(props);
	}

	render() {
		var date = this.props.date || new Date();

		var formattedDate = this.utils.$Dictionary.get('home.dateFormat', {
			DATE: date.getDate(),
			MONTH: date.getMonth() + 1,
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
