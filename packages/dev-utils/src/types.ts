export interface CompileError {
  name: string;
  message: string;
  fileUri?: string;
  lineNumber?: number;
  columnNumber?: number;
}

export type TraceLine = {
  functionName?: string | null;
  fileUri?: string;
  lineNumber?: number;
  columnNumber?: number;
};
