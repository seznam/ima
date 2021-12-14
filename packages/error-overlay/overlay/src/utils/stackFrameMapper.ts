import { StackFrame, sourceStorage } from '#/entities';

import { ParsedStack } from '../../types';

const IgnoredFunctionNames = ['processTicksAndRejections'];

/**
 * Maps parsed stacked frames into their original code positions
 * with the use of available source maps. Additionally it generates
 * source code fragments around errored lines in the original source
 * code files.
 *
 * @param {ParsedStack[]} frames Parsed stack frames.
 * @returns {Promise<StackFrame[]>} Array of mapped StackFrame entity instances.
 */
async function mapStackFramesToOriginal(
  frames: ParsedStack[]
): Promise<StackFrame[]> {
  const mappedFrames: StackFrame[] = await Promise.all(
    frames
      .filter(frame => {
        if (!frame.fileUri) {
          return false;
        }

        if (
          frame?.functionName &&
          IgnoredFunctionNames.includes(frame.functionName)
        ) {
          return false;
        }

        return true;
      })
      .map(async frame => {
        // Get file source
        const fileSource = await sourceStorage.get(frame.fileUri as string);

        // Create parsed stack frame
        const stackFrame = new StackFrame({
          fileName: frame.fileUri as string,
          functionName: frame.functionName,
          sourceFragment:
            (frame.lineNumber &&
              fileSource?.fileContents &&
              StackFrame.createSourceFragment(
                frame.lineNumber,
                fileSource?.fileContents
              )) ||
            null,
          lineNumber: frame.lineNumber,
          columnNumber: frame.columnNumber
        });

        // Generate original source code references if source map exists
        if (
          fileSource &&
          fileSource.sourceMap &&
          frame.lineNumber &&
          frame.columnNumber
        ) {
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
