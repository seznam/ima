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
          {metaManager.getMetaNames().map(name => {
            const { value, ...otherAttrs } = metaManager.getMetaName(name);
            return (
              <meta
                key={name}
                name={name}
                content={value}
                {...otherAttrs}
                data-ima-meta
              />
            );
          })}
          {metaManager.getMetaProperties().map(property => {
            const { value, ...otherAttrs } =
              metaManager.getPropertyName(property);
            return (
              <meta
                key={property}
                property={property}
                content={value}
                {...otherAttrs}
                data-ima-meta
              />
            );
          })}
          {metaManager.getLinks().map(rel => {
            const { value, ...otherAttrs } = metaManager.getLink(rel);
            return (
              <link
                key={rel}
                href={value}
                rel={rel}
                {...otherAttrs}
                data-ima-meta
              />
            );
          })}

          {/* Inject styles from $Source.styles */}
          {'#{$Styles}'}
          {/* Inject scripts from $Source.scripts */}
          {'#{$RevivalSettings}'}
          {'#{$Runner}'}

          <title>{metaManager.getTitle()}</title>
        </head>
        <body>
          <div
            id={this.utils.$Settings.$Page.$Render.masterElementId}
            dangerouslySetInnerHTML={{ __html: this.props.page }}
          />
          {/* Inject http cache */}
          {'#{$RevivalCache}'}
        </body>
      </html>
    );
  }
}
