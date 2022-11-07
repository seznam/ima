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
          {'#{$MetaTags}'}

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
