import { StackFrame } from '#/entities/StackFrame';

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

export type IconProps = {
  className?: string;
  style?: Record<string, unknown>;
};

export type FrameWrapper = {
  frame: StackFrame;
  isVisible: boolean;
  showOriginal: boolean;
};
