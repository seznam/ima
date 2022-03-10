// import { useCallback, useState } from 'react';

// import { getDevServerBaseUrl } from '#/utils';

// function useOpenEditor() {
//   const [isLoading, setIsLoading] = useState(false);
//   const openEditor = useCallback(async (frameWrapper: FrameWrapper) => {
//     setIsLoading(true);

//     const { frame } = frameWrapper;
//     let fileUri, line, column;

//     if (frameWrapper.showOriginal) {
//       fileUri = frame.getPrettyOriginalFileUri();
//       line = frame.orgLine;
//       column = frame.orgColumn;
//     } else {
//       fileUri = frame.fileName;
//       line = frame.line;
//       column = frame.column;
//     }

//     if (!fileUri) {
//       return;
//     }

//     // Build query params
//     const queryParams = [
//       `fileName=${encodeURIComponent(fileUri)}`,
//       line && `line=${line}`,
//       column && `column=${column}`,
//     ].filter(Boolean);

//     fetch(
//       `${getDevServerBaseUrl()}/__open-editor?${queryParams.join('&')}`
//     ).finally(() => {
//       setIsLoading(false);
//     });
//   }, []);

//   return {
//     openEditor,
//     isLoading,
//   };
// }

// export { useOpenEditor };
