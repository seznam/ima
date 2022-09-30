import { AbstractPureComponent } from '@ima/react-page-renderer';

export default class DocumentView extends AbstractPureComponent {
  render() {
    const { metaManager } = this.props;

    return (
      <html>
        <head>
          {/* Global meta tags */}
          <meta charSet='utf-8' />
          <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />

          {/* Meta tags defined per-controller */}
          {metaManager.getMetaNames().map(name => (
            <meta
              key={name}
              name={name}
              content={metaManager.getMetaName(name)}
              data-ima-meta
            />
          ))}
          {metaManager.getMetaProperties().map(property => (
            <meta
              key={property}
              property={property}
              content={metaManager.getMetaProperty(property)}
              data-ima-meta
            />
          ))}
          {metaManager.getLinks().map(rel => (
            <link
              key={rel}
              href={metaManager.getLink(rel)}
              rel={rel}
              data-ima-meta
            />
          ))}

          {/* Inject styles from $Source.styles */}
          {'#{$Styles}'}

          <title>{metaManager.getTitle()}</title>
        </head>
        <body>
          <div
            id={this.utils.$Settings.$Page.$Render.masterElementId}
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
