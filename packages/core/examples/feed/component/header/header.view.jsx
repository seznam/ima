import ns from 'imajs/client/core/namespace.js';

ns.namespace('App.Component.Header');

/**
 * Header writing.
 *
 * @class View
 * @namespace App.Component.Header
 * @module App
 * @submodule Component
 */
 class View extends ns.Core.Abstract.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className='l-header'>
				<a href={'//' + this.utils.$Dictionary.get('home.imaLink')} title={this.utils.$Dictionary.get('home.imaLink')}>
					{this.utils.$Dictionary.get('home.imaLink')}
				</a>
				<div className='title-wrapper'>
					<a href='/' title={this.utils.$Dictionary.get('home.pageTitle')} className="logo"></a>
					<h1>{this.utils.$Dictionary.get('home.pageTitle')}</h1>
				</div>
			</div>
		);
	}
}

ns.App.Component.Header.View = View;
