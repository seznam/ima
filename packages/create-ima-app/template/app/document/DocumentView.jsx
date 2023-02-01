export default function DocumentView({ metaManager, page, $Utils }) {
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
        {'#{metaTags}'}
        {'#{styles}'}
        {'#{revivalSettings}'}
        {'#{runner}'}
        <title>{metaManager.getTitle()}</title>
      </head>
      <body>
        <div
          id={$Utils.$Settings.$Page.$Render.masterElementId}
          dangerouslySetInnerHTML={{ __html: page }}
        />
        {'#{revivalCache}'}
      </body>
    </html>
  );
}
