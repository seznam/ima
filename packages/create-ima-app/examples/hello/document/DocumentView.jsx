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

          {this.props.metaManager.getMetaProperties().map(property => (
            <meta
              key={property}
              property={property}
              content={this.props.metaManager.getMetaProperty(property)}
            />
          ))}

          {this.utils.$Settings.$Page.$Source.styles.map(style => (
            <link key={style} rel='stylesheet' href={style} />
          ))}

          <title>{this.props.metaManager.getTitle()}</title>
        </head>
        <body>
          <div
            id={this.constructor.masterElementId}
            dangerouslySetInnerHTML={{ __html: this.props.page }}
          />
          <script
            id='revivalSettings'
            dangerouslySetInnerHTML={{ __html: this.props.revivalSettings }}
          />
        </body>
      </html>
    );
  }
}
