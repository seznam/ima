declare global {
  interface Window {
    __ima_server_error: {
      name: string;
      message: string;
      callStack: StackFrameObj[];
    };
  }
}

export interface StackFrameObj {
  columnNumber: number;
  content: string;
  fileName: string;
  functionName: string;
  id: string;
  lineNumber: number;
  methodName: string;
  startLine: number;
  typeName: string;
}
