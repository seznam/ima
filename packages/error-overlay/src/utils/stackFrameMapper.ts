import { TraceLine } from '@ima/dev-utils';

import { StackFrame, SourceStorage } from '#/entities';

const IgnoredFunctionNames = ['processTicksAndRejections'];

/**
 * Maps parsed stacked frames into their original code positions
 * with the use of available source maps. Additionally it generates
 * source code fragments around errored lines in the original source
 * code files.
 *
 * @param {TraceLine[]} frames Parsed stack frames.
 * @returns {Promise<StackFrame[]>} Array of mapped StackFrame entity instances.
 */
async function mapStackFramesToOriginal(
  frames: TraceLine[]
): Promise<StackFrame[]> {
  const sourceStorage = new SourceStorage();
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
      .map(async (frame, index) => {
        // Get file source
        const fileSource = await sourceStorage.get(frame.fileUri as string);

        // Create parsed stack frame
        const stackFrame = new StackFrame({
          rootDir: fileSource?.rootDir,
          fileName: frame.fileUri as string,
          functionName: frame.functionName,
          sourceFragment:
            (frame.line &&
              fileSource?.fileContents &&
              StackFrame.createSourceFragment(
                frame.line,
                fileSource?.fileContents,
                index === 0 ? 8 : 4
              )) ||
            null,
          lineNumber: frame.line,
          columnNumber: frame.column,
        });

        // Generate original source code references if source map exists
        if (fileSource && fileSource.sourceMap && frame.line && frame.column) {
          const {
            column,
            line,
            source: sourceFileUri,
          } = fileSource.sourceMap.getOriginalPosition(
            frame.line,
            frame.column
          ) || {};

          const originalSource =
            sourceFileUri && fileSource.sourceMap.getSource(sourceFileUri);

          stackFrame.originalFileName = sourceFileUri;
          stackFrame.originalLineNumber = line;
          stackFrame.originalColumnNumber = column;
          stackFrame.originalSourceFragment =
            (line &&
              originalSource &&
              StackFrame.createSourceFragment(
                line,
                originalSource,
                index === 0 ? 8 : 4
              )) ||
            null;
        }

        return stackFrame;
      })
  );

  // Cleanup wasm allocated sourcemaps
  sourceStorage.cleanup();

  return mappedFrames;
}

/**
 * Maps error location frames into their original code. Unlike
 * mapStackFramesToOriginal function, this function doesn't work
 * with source maps, but rather assumes that provided frames
 * already point to the original file location.
 *
 * This also means that resulted StackFrames contain only original
 * source fragments.
 *
 * @param {TraceLine[]} frames Parsed stack frames (with original file locations).
 * @returns {Promise<StackFrame[]>} Array of mapped StackFrame entity instances.
 */
async function mapCompileStackFrames(
  frames: TraceLine[]
): Promise<StackFrame[]> {
  const sourceStorage = new SourceStorage();
  const mappedFrames: StackFrame[] = await Promise.all(
    frames
      .filter(frame => {
        if (!frame.fileUri) {
          return false;
        }

        return true;
      })
      .map(async (frame, index) => {
        // Get file source
        const fileSource = await sourceStorage.get(frame.fileUri as string);

        // Generate original source code references if source map exists
        if (fileSource && fileSource.sourceMap && frame.line && frame.column) {
          const {
            column,
            line,
            source: sourceFileUri,
          } = fileSource.sourceMap.getOriginalPosition(
            frame.line,
            frame.column
          ) || {};

          if (sourceFileUri) {
            const originalSource =
              fileSource.sourceMap.getSource(sourceFileUri);

            return new StackFrame({
              rootDir: fileSource.rootDir,
              originalFileName: sourceFileUri,
              originalLineNumber: line,
              originalColumnNumber: column,
              originalSourceFragment:
                (line &&
                  originalSource &&
                  StackFrame.createSourceFragment(
                    line,
                    originalSource,
                    index === 0 ? 8 : 4
                  )) ||
                null,
            });
          }
        }

        // Fallback to original fragment if source maps are not available
        return new StackFrame({
          rootDir: fileSource?.rootDir,
          originalFileName: frame.fileUri as string,
          originalSourceFragment:
            (frame.line &&
              fileSource?.fileContents &&
              StackFrame.createSourceFragment(
                frame.line,
                fileSource?.fileContents,
                index === 0 ? 8 : 4
              )) ||
            null,
          originalLineNumber: frame.line,
          originalColumnNumber: frame.column,
        });
      })
  );

  // Cleanup wasm allocated sourcemaps
  sourceStorage.cleanup();

  return mappedFrames;
}

export { mapStackFramesToOriginal, mapCompileStackFrames };
