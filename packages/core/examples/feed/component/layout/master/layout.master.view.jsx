import ns from 'core/namespace/ns.js';

var boot = ns.oc.get('$Boot');

boot.addComponent(() => {

	ns.namespace('App.Component.Layout.Master');

	/**
	 * Master Layout.
	 * @class View
	 * @namespace App.Component.Layout.Master
	 * @module App
	 * @submodule Component
	 */
	/* jshint ignore:start */
	ns.App.Component.Layout.Master.RC = React.createClass({
		render() {
			return (
				<html>
					<head>
						<meta charSet="utf-8" />
						<meta httpEquiv="X-UA-Compatible" content="IE=edge" />

						<meta name="description" content={this.props.seo.get('description')} />
						<meta name="keywords" content={this.props.seo.get('keywords')} />

						<meta property="og:title" content={this.props.seo.get('title')} />
						<meta property="og:description" content={this.props.seo.get('description')} />
						<meta property="og:type" content={this.props.seo.get('type')} />
						<meta property="og:url" content={this.props.seo.get('url')} />
						<meta property="og:image" content={this.props.seo.get('image')} />

						<meta name="viewport" content="width=device-width, initial-scale=1" />
						<link rel="stylesheet" href="/static/css/app.css" />
						<title>
							{this.props.seo.get('title')}
						</title>
					</head>
					<body>
						<div id="fb-root" />
						<div id="page" dangerouslySetInnerHTML={{__html: this.props.page}} />
						<div id="scripts" dangerouslySetInnerHTML={{__html: this.props.scripts}} />
					</body>
				</html>
			);
		}
	});
	ns.App.Component.Layout.Master.View = React.createFactory(ns.App.Component.Layout.Master.RC);
	/* jshint ignore:end */
});