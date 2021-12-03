import { SourceFragment } from './SourceFragment';

class StackFrame {
  id: string;

  fileName: string;
  functionName: string;
  methodName: string;
  typeName: string;
  sourceFragment: SourceFragment;

  startLine: number;
  lineNumber: number;
  columnNumber: number;
  errLine: number;

  native: boolean;

  originalIdentifier?: string | null;
  originalFileName?: string | null;
  originalLineNumber?: number | null;
  originalColumnNumber?: number | null;
  originalSourceFragment?: SourceFragment | null;

  constructor({
    id,
    fileName,
    functionName,
    methodName,
    typeName,
    sourceFragment,
    startLine,
    lineNumber,
    columnNumber,
    errLine,
    native,
    originalIdentifier,
    originalFileName,
    originalLineNumber,
    originalColumnNumber,
    originalSourceFragment
  }: {
    id: string;
    fileName: string;
    functionName: string;
    methodName: string;
    typeName: string;
    sourceFragment: SourceFragment;
    startLine: number;
    lineNumber: number;
    columnNumber: number;
    errLine: number;
    native: boolean;
    originalIdentifier?: string | null;
    originalFileName?: string | null;
    originalLineNumber?: number | null;
    originalColumnNumber?: number | null;
    originalSourceFragment?: SourceFragment | null;
  }) {
    this.id = id;

    this.fileName = fileName;
    this.functionName = functionName;
    this.methodName = methodName;
    this.sourceFragment = sourceFragment;

    this.startLine = startLine;
    this.lineNumber = lineNumber;
    this.columnNumber = columnNumber;
    this.errLine = errLine;

    this.native = native;
    this.typeName = typeName;

    this.originalIdentifier = originalIdentifier;
    this.originalFileName = originalFileName;
    this.originalLineNumber = originalLineNumber;
    this.originalColumnNumber = originalColumnNumber;
    this.originalSourceFragment = originalSourceFragment;
  }

  getPrettyFileUri(): string | undefined {
    const strippedUri = this.originalFileName?.replaceAll(
      /^(webpack:\/\/|webpack-internal:\/\/\/)/gi,
      ''
    );

    const indexOfFirstSlash = strippedUri?.indexOf('/');

    return indexOfFirstSlash
      ? `.${strippedUri?.substring(indexOfFirstSlash)}`
      : strippedUri;
  }
}

export { StackFrame };
