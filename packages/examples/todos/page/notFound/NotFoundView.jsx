import PropTypes from 'prop-types';
import React from 'react';
import AbstractComponent from 'ima/page/AbstractComponent';

export default class NotFoundView extends AbstractComponent {

	static get contextTypes() {
		return {
			$Utils: PropTypes.object
		};
	}

	render() {
		return (
			<div className='l-not-found'>
				<h1>404 &ndash; Not Found</h1>
			</div>
		);
	}
}
