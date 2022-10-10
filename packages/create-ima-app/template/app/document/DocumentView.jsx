import { AbstractDocumentView } from '@ima/core';

export default class DocumentView extends AbstractDocumentView {
  static get masterElementId() {
    return 'page';
  }

  render() {
    const { metaManager } = this.props;

    return (
      <html>
        <head>
          <meta charSet='utf-8' />
          <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />

          {metaManager.getMetaNames().map(name => (
            <meta
              key={name}
              name={name}
              content={metaManager.getMetaName(name)}
            />
          ))}

          {metaManager.getMetaProperties().map(property => (
            <meta
              key={property}
              property={property}
              content={metaManager.getMetaProperty(property)}
            />
          ))}

          {metaManager.getLinks().map(rel => (
            <link key={rel} href={metaManager.getLink(rel)} rel={rel} />
          ))}

          {/* Inject styles from $Source.styles */}
          {'#{$Styles}'}
          {/* Inject scripts from $Source.scripts */}
          {'#{$RevivalSettings}'}
          {'#{$Runner}'}

          <title>{this.props.metaManager.getTitle()}</title>
        </head>
        <body>
          <div
            id={this.constructor.masterElementId}
            dangerouslySetInnerHTML={{ __html: this.props.page }}
          />
          {/* Inject http cache */}
          {'#{$RevivalCache}'}
        </body>
      </html>
    );
  }
}
