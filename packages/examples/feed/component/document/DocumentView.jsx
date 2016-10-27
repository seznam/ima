import AbstractDocumentView from 'ima/page/AbstractDocumentView';
import React from 'react';

/**
 * Master document layout component.
 */
export default class DocumentView extends AbstractDocumentView {

	static get masterElementId() {
		return 'page';
	}

	render() {
		let appCssFile = this.utils.$Settings.$Env !== 'dev' ? 'app.bundle.min.css' : 'app.css';
		appCssFile += `?version=${this.utils.$Settings.$Version}`;

		return (
			<html>
				<head>
					<meta charSet='utf-8'/>
					<meta httpEquiv='X-UA-Compatible' content='IE=edge'/>

					<meta name='description' content={this.props.metaManager.getMetaName('description')}/>
					<meta name='keywords' content={this.props.metaManager.getMetaName('keywords')}/>

					<meta property='og:title' content={this.props.metaManager.getMetaProperty('og:title')}/>
					<meta property='og:description' content={this.props.metaManager.getMetaProperty('og:description')}/>
					<meta property='og:type' content={this.props.metaManager.getMetaProperty('og:type')}/>
					<meta property='og:url' content={this.props.metaManager.getMetaProperty('og:url')}/>
					<meta property='og:image' content={this.props.metaManager.getMetaProperty('og:image')}/>

					<meta name='viewport' content='width=device-width, initial-scale=1'/>
					<link rel='stylesheet' href={this.utils.$Router.getBaseUrl() + this.utils.$Settings.$Static.css + '/' + appCssFile}/>
					<title>
						{this.props.metaManager.getTitle()}
					</title>
				</head>
				<body>
					<div id='fb-root' />
					<div id='page' dangerouslySetInnerHTML={{ __html: this.props.page }}/>
					<script id='revivalSettings' dangerouslySetInnerHTML={{ __html: this.props.revivalSettings }}/>
					{this.utils.$Settings.$Env === 'dev' ?
						<div id='scripts'>{this.getSyncScripts()}</div>
					:
						<div id='scripts' dangerouslySetInnerHTML={{ __html: this.getAsyncScripts() }}/>
					}
				</body>
			</html>
		);
	}

	getSyncScripts() {
		return this.utils.$Settings.$Page.$Render.scripts
				.map((script, index) => {
					return <script src={script} key={index}/>;
				})
				.concat([<script key={'scriptRunner'}>{'$IMA.Runner.run();'}</script>]);
	}

	getAsyncScripts() {
		let scriptResources = `<script>
			$IMA.Runner = $IMA.Runner || {};
		 	$IMA.Runner.scripts = [
				${this.utils.$Settings.$Page.$Render.scripts
					.map((script) => `'${script}'`)
					.join()
				}
			];
		</script>`;

		let scriptTags = this.utils.$Settings.$Page.$Render.scripts.map((script) => {
			return `<script src='${script}' async onload='$IMA.Runner.load(this)'></script>`;
		});

		return [scriptResources].concat(scriptTags).join('');
	}
}
