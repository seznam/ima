import { Utils } from '@ima/core';

export interface DocumentViewProps {
  page: string;
  $Utils: Utils;
}

export function DocumentView({ page, $Utils }: DocumentViewProps) {
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
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        {'#{meta}'}
        {'#{styles}'}
        {'#{revivalSettings}'}
        {'#{runner}'}
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
