import { StackFrameObj } from '../../types';
import { StackFrame } from './StackFrame';
import { getSourceMap } from './getSourceMap';
import { SourceFragment } from './SourceFragment';
import SourceMap from './SourceMap';
import { sourceStorage } from './SourceStorage';

function getFileNames(frames: StackFrameObj[]): string[] {
  const uniqueFileNames = new Set<string>();
  frames.forEach(frame => {
    uniqueFileNames.add(frame.fileName);
  });

  return Array.from(uniqueFileNames);
}

async function mapStackFramesToOriginal(
  frames: StackFrameObj[]
): Promise<StackFrame[]> {
  const fileNames = getFileNames(frames);
  const fileSources: Map<
    string,
    { fileSource: string; sourceMap: SourceMap }
  > = new Map();

  await Promise.allSettled(
    fileNames.map(async fileUri => {
      const fileSource = await sourceStorage.getSource(fileUri);
      const sourceMap = await getSourceMap(fileUri, fileSource);

      fileSources.set(fileUri, { fileSource, sourceMap });
    })
  );

  const mappedFrames: StackFrame[] = await Promise.all(
    frames.map(async frame => {
      const { column, name, line, source } =
        fileSources
          ?.get(frame.fileName)
          ?.sourceMap.getOriginalPosition(
            frame.lineNumber,
            frame.columnNumber
          ) || {};

      // TODO reduce to minimum we'll use
      return new StackFrame({
        id: frame.id,
        fileName: frame.fileName,
        functionName: frame.functionName,
        methodName: frame.methodName,
        typeName: frame.typeName,
        sourceFragment: SourceFragment.createFragment(
          frame.lineNumber,
          frame.content
        ),
        startLine: frame.startLine,
        lineNumber: frame.lineNumber,
        columnNumber: frame.columnNumber,
        errLine: frame.errLine,
        native: frame.native,
        originalIdentifier: name,
        originalFileName: source,
        originalLineNumber: line,
        originalColumnNumber: column,
        originalSourceFragment:
          (line &&
            source &&
            SourceFragment.createFragment(
              line,
              await sourceStorage.getSource(source)
            )) ||
          null
      });
    })
  );

  return mappedFrames;
}

export { mapStackFramesToOriginal };
