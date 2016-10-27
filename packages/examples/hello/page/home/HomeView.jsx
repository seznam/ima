import AbstractComponent from 'ima/page/AbstractComponent';
import React, { PropTypes } from 'react';

/**
 * Home page.
 */
export default class HomeView extends AbstractComponent {

	static get contextTypes() {
		return {
			$Utils: React.PropTypes.object
		};
	}

	render() {
		return (
			<div className='l-homepage'>
				<div className='content'>
					<img
							src={
								this.utils.$Router.getBaseUrl() +
								this.utils.$Settings.$Static.image +
								'/imajs-logo.png'
							}
							alt='IMA.js logo'/>
					<h1>
						{`${this.localize('home.hello')}, ${this.props.message} `}
						<a href='//imajs.io' title={this.props.name} target='_blank'>{this.props.name}</a>!
					</h1>
				</div>
			</div>
		);
	}
}
