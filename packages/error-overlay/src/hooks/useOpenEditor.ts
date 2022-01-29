import { useCallback, useState } from 'react';

import { FrameWrapper } from '#/reducers/errorsReducer';

function useOpenEditor() {
  const [isLoading, setIsLoading] = useState(false);
  const openEditor = useCallback(async (frameWrapper: FrameWrapper) => {
    setIsLoading(true);
    let fileUri, line, column;

    if (frameWrapper.showOriginal) {
      fileUri = frameWrapper.frame.getPrettyOriginalFileUri();
      line = frameWrapper.frame.originalLineNumber;
      column = frameWrapper.frame.originalColumnNumber;
    } else {
      fileUri = frameWrapper.frame.fileName;
      line = frameWrapper.frame.lineNumber;
      column = frameWrapper.frame.columnNumber;
    }

    if (!fileUri) {
      return;
    }

    const queryParams = [`fileName=${encodeURIComponent(fileUri)}`];

    if (line) {
      queryParams.push(`line=${line}`);
    }

    if (column) {
      queryParams.push(`column=${column}`);
    }

    fetch(
      `http://localhost:5001/__open-editor?${queryParams.join('&')}`
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
