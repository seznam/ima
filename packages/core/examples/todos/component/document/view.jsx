import ns from 'imajs/client/core/namespace.js';

ns.namespace('App.Component.Document');

class View extends ns.Core.Abstract.Component {

	constructor(props) {
		super(props);
	}

	render() {
		var appCssFile = this.utils.$Settings.$Env !== 'dev' ? 'app.min.css' : 'app.css';

		return (
			<html lang={'en'} data-framework="imajs">
				<head>
					<meta charSet="utf-8" />
					<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<link rel="stylesheet" href={`/static/css/${appCssFile}`} />
					<title>
						{this.props.metaManager.getTitle()}
					</title>
					<script src="/static/js/todomvc-common-base.js"></script>
				</head>
				<body>
					<div id="page" dangerouslySetInnerHTML={{__html: this.props.page}} />
					<div id="scripts" dangerouslySetInnerHTML={{__html: this.props.scripts}} />
				</body>
			</html>
		);
	}
}

ns.App.Component.Document.View = View;
