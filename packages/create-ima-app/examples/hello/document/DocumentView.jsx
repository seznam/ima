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
            dangerouslySetInnerHTML={{
              __html: this.getScripts(this.utils.$Settings.$Page.$Render),
            }}
          />
        </body>
      </html>
    );
  }
}
