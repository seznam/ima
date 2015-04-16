import ns from 'imajs/client/core/namespace.js';
import bootstrap from 'imajs/client/core/bootstrap.js';

bootstrap.addComponent((utils) => {

	ns.namespace('App.Component.Layout.Master');

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
			var appCssFile = utils.setting.$Env !== 'dev' ? 'app.min.css' : 'app.css';

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

	ns.App.Component.Layout.Master.View = React.createFactory(View);
});