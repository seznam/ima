import { AbstractPureComponent } from '@ima/react-page-renderer';

export default class DocumentView extends AbstractPureComponent {
  render() {
    const { metaManager } = this.props;

    /**
     * #{...} Represents variables that are injected before sending the response
     * to client from server. These are defined in event.response.content.contentVariables.
     *
     * You can use Event.CreateContentVariables server hook to customize/extend set of these variables.
     */

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

          {/* Inject styles from $Source.styles from */}
          {'#{styles}'}
          {/* Inject scripts from $Source.scripts from */}
          {'#{revivalSettings}'}
          {'#{runner}'}

          <title>{this.props.metaManager.getTitle()}</title>
        </head>
        <body>
          <div
            id={this.utils.$Settings.$Page.$Render.masterElementId}
            dangerouslySetInnerHTML={{ __html: this.props.page }}
          />
          {/* Inject http cache from */}
          {'#{revivalCache}'}
        </body>
      </html>
    );
  }
}
