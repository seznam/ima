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

						<meta name="description" content={this.props.seo.getMetaName('description')} />
						<meta name="keywords" content={this.props.seo.getMetaName('keywords')} />

						<meta property="og:title" content={this.props.seo.getMetaProperty('og:title')} />
						<meta property="og:description" content={this.props.seo.getMetaProperty('og:description')} />
						<meta property="og:type" content={this.props.seo.getMetaProperty('og:type')} />
						<meta property="og:url" content={this.props.seo.getMetaProperty('og:url')} />
						<meta property="og:image" content={this.props.seo.getMetaProperty('og:image')} />

						<meta name="viewport" content="width=device-width, initial-scale=1" />
						<link rel="stylesheet" href="/static/css/app.css" />
						<title>
							{this.props.seo.getPageTitle()}
						</title>
					</head>
					<body>
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