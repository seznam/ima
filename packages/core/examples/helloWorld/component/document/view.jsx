import ns from 'imajs/client/core/namespace.js';
import component from 'imajs/client/core/component.js';

component.add((utils) => {

	ns.namespace('App.Component.Document');

	/**
	 * Master Layout.
	 * @class View
	 * @namespace App.Component.Layout.Master
	 * @module App
	 * @submodule Component
	 */
	class View extends React.Component {

		constructor(props) {
			super(props);
		}

		render() {
			var appCssFile = utils.$Settings.$Env !== 'dev' ? 'app.min.css' : 'app.css';
			appCssFile += `?version=${utils.$Settings.$Page.$Render.version}`;

			return (
				<html>
					<head>
						<meta charSet="utf-8" />
						<meta httpEquiv="X-UA-Compatible" content="IE=edge" />

						<meta name="description" content={this.props.seo.getMetaName('description')} />
						<meta name="keywords" content={this.props.seo.getMetaName('keywords')} />

						<meta property="og:title" content={this.props.seo.getMetaProperty('og:title')} />
						<meta property="og:description" content={this.props.seo.getMetaProperty('og:description')} />
						<meta property="og:type" content={this.props.seo.getMetaProperty('og:type')} />
						<meta property="og:url" content={this.props.seo.getMetaProperty('og:url')} />
						<meta property="og:image" content={this.props.seo.getMetaProperty('og:image')} />

						<meta name="viewport" content="width=device-width, initial-scale=1" />
						<link rel="stylesheet" href={`/static/css/${appCssFile}`} />
						<title>
							{this.props.seo.getTitle()}
						</title>
					</head>
					<body>
						<div id="page" dangerouslySetInnerHTML={{__html: this.props.page}} />
						<div id="scripts" dangerouslySetInnerHTML={{__html: this.props.scripts}} />
					</body>
				</html>
			);
		}
	}

	ns.App.Component.Document.View = React.createFactory(View);
});
