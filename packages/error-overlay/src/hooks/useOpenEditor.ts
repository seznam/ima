import { useCallback, useContext, useState } from 'react';

import { OverlayContext } from '#/components';
import { StackFrame } from '#/entities';

function useOpenEditor() {
  const { publicUrl } = useContext(OverlayContext);
  const [isLoading, setIsLoading] = useState(false);

  const openEditor = useCallback(
    async (frame: StackFrame, showOriginal = true) => {
      setIsLoading(true);
      let fileUri, line, column;

      if (showOriginal) {
        fileUri = frame.getPrettyOriginalFileUri();
        line = frame.orgLine;
        column = frame.orgColumn;
      } else {
        fileUri = frame.fileName;
        line = frame.line;
        column = frame.column;
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

      fetch(`${publicUrl}/__open-editor?${queryParams.join('&')}`).finally(
        () => {
          setIsLoading(false);
        }
      );
    },
    []
  );

  return {
    openEditor,
    isLoading,
  };
}

export { useOpenEditor };
