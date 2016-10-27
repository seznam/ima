import AbstractComponent from 'ima/page/AbstractComponent';
import React from 'react';

/**
 * Date Component.
 */
export default class Date extends AbstractComponent {

	render() {
		let date = this.props.date || new Date();

		let formattedDate = this.utils.$Dictionary.get('home.dateFormat', {
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
