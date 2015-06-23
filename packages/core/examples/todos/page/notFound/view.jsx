import ns from 'imajs/client/core/namespace.js';

ns.namespace('App.Page.NotFound');

class View extends ns.Core.Abstract.Component {
	constructor(props) {
		super(props);

		this.state = props;
	}

	render() {
		return (
			<div className='l-not-found'>
				<h1>404 - Not Found</h1>
			</div>
		);
	}
}

ns.App.Page.NotFound.View = View;
