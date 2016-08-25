import React from 'react';
import AbstractComponent from 'ima/page/AbstractComponent';

export default class NotFoundView extends AbstractComponent {
	render() {
		return (
			<div className='l-not-found'>
				<h1>404 - Not Found</h1>
			</div>
		);
	}

	static get contextTypes() {
		return {
			$Utils: React.PropTypes.object
		};
	}
}
