import { StackFrameObj } from '../../types';
import { StackFrame, sourceStorage } from '#/entities';

/**
 * Maps parsed stacked frames into their original code positions
 * with the use of available source maps. Additionally it generates
 * source code fragments around errored lines in the original source
 * code files.
 *
 * @param {StackFrameObj[]} frames Parsed stack frames.
 * @returns {Promise<StackFrame[]>} Array of mapped StackFrame entity instances.
 */
async function mapStackFramesToOriginal(
  frames: StackFrameObj[]
): Promise<StackFrame[]> {
  const mappedFrames: StackFrame[] = await Promise.all(
    frames.map(async frame => {
      // Get file source
      const fileSource = await sourceStorage.get(frame.fileName);


      // Create parsed stack frame
      const stackFrame = new StackFrame({
        id: frame.id,
        fileName: frame.fileName,
        functionName: frame.functionName,
        methodName: frame.methodName,
        typeName: frame.typeName,
        sourceFragment:
          (frame.lineNumber &&
            fileSource?.fileContents &&
            StackFrame.createSourceFragment(
              frame.lineNumber,
              fileSource?.fileContents
            )) ||
          null,
        startLine: frame.startLine,
        lineNumber: frame.lineNumber,
        columnNumber: frame.columnNumber
      });

      // Generate original source code references if source map exists
      if (fileSource && fileSource.sourceMap) {
        const { column, line, source: sourceFileUri } =
          fileSource.sourceMap.getOriginalPosition(
            frame.lineNumber,
            frame.columnNumber
          ) || {};

        const originalSource =
          sourceFileUri && fileSource.sourceMap.getSource(sourceFileUri);

        stackFrame.originalFileName = sourceFileUri;
        stackFrame.originalLineNumber = line;
        stackFrame.originalColumnNumber = column;
        stackFrame.originalSourceFragment =
          (line &&
            originalSource &&
            StackFrame.createSourceFragment(line, originalSource)) ||
          null;
        null;
      }

      return stackFrame;
    })
  );

  return mappedFrames;
}

export { mapStackFramesToOriginal };
