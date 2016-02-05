import ns from 'imajs/client/core/namespace';
import { React } from 'app/vendor';

ns.namespace('App.Component.Document');

class View extends ns.Core.Abstract.Component {

	constructor(props) {
		super(props);
	}

	render() {
		var appCssFile = this.utils.$Settings.$Env !== 'dev' ? 'app.bundle.min.css' : 'app.css';
		appCssFile += `?version=${this.utils.$Settings.$Version}`;
		var scripts = this.getScripts();

		return (
			<html lang={'en'} data-framework="imajs">
				<head>
					<meta charSet="utf-8" />
					<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<link rel="stylesheet" href={this.utils.$Router.getBaseUrl() + this.utils.$Settings.$Static.css + '/' + appCssFile} />
					<title>
						{this.props.metaManager.getTitle()}
					</title>
					<script src={this.utils.$Router.getBaseUrl() + this.utils.$Settings.$Static.js + '/todomvc-common-base.js'}></script>
				</head>
				<body>
					<div id="page" dangerouslySetInnerHTML={{__html: this.props.page}} />
					<div id="revivalSettings" dangerouslySetInnerHTML={{__html: this.props.revivalSettings}}/>
					<div id="scripts">
						{scripts}
					</div>
				</body>
			</html>
		);
	}

	getScripts() {
		return this.utils.$Settings.$Page.$Render.scripts.map((script, index) => {
			return <script src={script} key={"script" + index}/>;
		});
	}
}

ns.App.Component.Document.View = View;
