import { createSourceFragment } from '@ima/dev-utils/dist/sourceFragment';
import * as stackTraceParser from 'stacktrace-parser';

import { StackFrame, SourceStorage } from '#/entities';

const IgnoredFunctionNames = ['processTicksAndRejections'];
const sourceStorage = new SourceStorage();

/**
 * StackFrame initialized helper. Takes care of properly
 * initializing every property of StackFrame that can be
 * parsed from the given data.
 *
 * @param {stackTraceParser.StackFrame} frame Parsed trace line.
 * @param {number} contextLines Number of context lines around source fragment.
 * @returns {StackFrame} parsed  StackFrame entity instance.
 */
async function createStackFrame(
  frame: stackTraceParser.StackFrame,
  contextLines: number
): Promise<StackFrame> {
  // Create basic stack frame from parsed trace line
  const stackFrame = new StackFrame({
    fileName: frame.file as string,
    functionName: frame.methodName,
    line: frame.lineNumber ?? undefined,
    column: frame.column ?? undefined,
  });

  // Get file source
  const { fileContents, sourceMap, rootDir } =
    (await sourceStorage.get(stackFrame.fileName as string)) || {};

  if (!fileContents || !stackFrame.line) {
    return stackFrame;
  }

  // Create file contents
  stackFrame.rootDir = rootDir;
  stackFrame.sourceFragment = createSourceFragment(
    stackFrame.line,
    fileContents,
    contextLines
  );

  if (!sourceMap || !stackFrame.column) {
    return stackFrame;
  }

  // Parse original source
  const orgPosition =
    sourceMap.originalPositionFor({
      line: stackFrame.line,
      column: stackFrame.column,
    }) || {};

  if (!orgPosition.source || !orgPosition.line) {
    return stackFrame;
  }

  const orgSource = sourceMap.sourceContentFor(orgPosition.source);

  if (!orgSource) {
    return stackFrame;
  }

  // Create original source fragment
  stackFrame.orgFileName = orgPosition.source;
  stackFrame.orgLine = orgPosition.line;
  stackFrame.orgColumn = orgPosition.column;
  stackFrame.orgSourceFragment = createSourceFragment(
    stackFrame.orgLine,
    orgSource,
    contextLines
  );

  return stackFrame;
}

/**
 * Maps parsed stacked frames into their original code positions
 * with the use of available source maps. Additionally it generates
 * source code fragments around errored lines in the original source
 * code files.
 *
 * @param {string|undefined} stack Error stack.
 * @returns {Promise<StackFrame[]>} Array of mapped StackFrame entity instances.
 */
async function mapStackFramesToOriginal(
  stack: string | undefined
): Promise<StackFrame[]> {
  if (!stack) {
    return [];
  }

  const parsedStack = stackTraceParser.parse(stack);
  const mappedFrames: StackFrame[] = await Promise.all(
    parsedStack
      .filter(frame => {
        if (!frame.file) {
          return false;
        }

        if (
          frame.methodName &&
          IgnoredFunctionNames.includes(frame.methodName)
        ) {
          return false;
        }

        return true;
      })
      .map(async (frame, index) => createStackFrame(frame, index === 0 ? 8 : 4))
  );

  // Cleanup wasm allocated sourcemaps
  sourceStorage.cleanup();

  return mappedFrames;
}

/**
 * Maps compile error trace line into is original position.
 * Compile errors already work with original positions so we
 * only need to create original source fragment from given data.
 *
  @param {string?} fileUri Compile errored fileUri.
  @param {number?} line Compile errored line.
  @param {number?} colum Compile errored colum.
 * @returns {Promise<StackFrame | null>} Mapped StackFrame instance.
 */
async function mapCompileStackFrame(
  fileUri?: string,
  line?: number,
  column?: number
): Promise<StackFrame | null> {
  if (!fileUri) {
    return null;
  }

  const { rootDir, fileContents } = (await sourceStorage.get(fileUri)) ?? {};

  // Compile errors are parsed directly on original
  const mappedFrame = new StackFrame({
    rootDir,
    orgFileName: fileUri as string,
    orgSourceFragment:
      (line && fileContents && createSourceFragment(line, fileContents, 8)) ||
      null,
    orgLine: line,
    orgColumn: column,
  });

  // Cleanup wasm allocated sourcemaps
  sourceStorage.cleanup();

  return mappedFrame;
}

export { mapStackFramesToOriginal, mapCompileStackFrame };
