import ns from 'ima/namespace';
import AbstractComponent from 'ima/page/AbstractComponent';
import React from 'react';

ns.namespace('app.component.date');

/**
 * Date Component.
 * @class View
 * @extends ima.page.AbstractComponent
 * @namespace app.component.date
 * @module app
 * @submodule app.component
 */
class View extends AbstractComponent {

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

ns.app.component.date.View = View;
