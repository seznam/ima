import { AbstractDocumentView } from '@ima/core';

export default class DocumentView extends AbstractDocumentView {
  static get masterElementId() {
    return 'page';
  }

  render() {
    return (
      <html>
        <head>
          <meta charSet='utf-8' />
          <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />

          <meta
            name='description'
            content={this.props.metaManager.getMetaName('description')}
          />
          <meta
            name='keywords'
            content={this.props.metaManager.getMetaName('keywords')}
          />

          <meta
            property='og:title'
            content={this.props.metaManager.getMetaProperty('og:title')}
          />
          <meta
            property='og:description'
            content={this.props.metaManager.getMetaProperty('og:description')}
          />
          <meta
            property='og:type'
            content={this.props.metaManager.getMetaProperty('og:type')}
          />
          <meta
            property='og:url'
            content={this.props.metaManager.getMetaProperty('og:url')}
          />
          <meta
            property='og:image'
            content={this.props.metaManager.getMetaProperty('og:image')}
          />

          {this.utils.$Settings.$Page.$Render.styles.map(style => (
            <link key={style} rel='stylesheet' href={style} />
          ))}

          <title>{this.props.metaManager.getTitle()}</title>
        </head>
        <body>
          <div
            id='page'
            dangerouslySetInnerHTML={{ __html: this.props.page }}
          />
          <script
            id='revivalSettings'
            dangerouslySetInnerHTML={{ __html: this.props.revivalSettings }}
          />
          <div
            id='scripts'
            dangerouslySetInnerHTML={{ __html: this.getAsyncScripts() }}
          />
        </body>
      </html>
    );
  }

  getAsyncScripts() {
    let scriptResources = `<script>
		    function checkAsyncAwait () {
		        try {
		            new Function('(async () => ({}))()');
		            return true;
		        } catch (e) {
		            return false;
		        }
		    }
		    $IMA.Runner = $IMA.Runner || {};

		    if (Object.values && checkAsyncAwait()) {
		        $IMA.Runner.scripts = [
		            ${this.utils.$Settings.$Page.$Render.esScripts
                  .map(script => `'${script}'`)
                  .join()}
	            ];
		    } else {
		        $IMA.Runner.scripts = [
		            ${this.utils.$Settings.$Page.$Render.scripts
                  .map(script => `'${script}'`)
                  .join()}
	            ];
		    }

		    $IMA.Runner.scripts.forEach(function(source) {
		        var script = document.createElement('script');
		        script.async = $IMA.$Env !== 'dev';
		        script.onload = $IMA.Runner.load;
		        script.src = source;
		        document.getElementById('scripts').appendChild(script);
		    });
	    </script>`;
    return scriptResources;
  }
}
