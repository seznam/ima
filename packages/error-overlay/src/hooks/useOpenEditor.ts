import { useCallback, useState } from 'react';

import { FrameWrapper } from '#/reducers/errorsReducer';
import { getDevServerBaseUrl } from '#/utils';

function useOpenEditor() {
  const [isLoading, setIsLoading] = useState(false);
  const openEditor = useCallback(async (frameWrapper: FrameWrapper) => {
    setIsLoading(true);

    const { frame } = frameWrapper;
    let fileUri, line, column;

    if (frameWrapper.showOriginal) {
      fileUri = frame.getPrettyOriginalFileUri();
      line = frame.originalLineNumber;
      column = frame.originalColumnNumber;
    } else {
      fileUri = frame.fileName;
      line = frame.lineNumber;
      column = frame.columnNumber;
    }

    if (!fileUri) {
      return;
    }

    // Build query params
    const queryParams = [
      `fileName=${encodeURIComponent(fileUri)}`,
      line && `line=${line}`,
      column && `column=${column}`,
    ].filter(Boolean);

    fetch(
      `${getDevServerBaseUrl()}/__open-editor?${queryParams.join('&')}`
    ).finally(() => {
      setIsLoading(false);
    });
  }, []);

  return {
    openEditor,
    isLoading,
  };
}

export { useOpenEditor };
