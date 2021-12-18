declare module 'easy-uid' {
  export default function (): string;
}

declare global {
  interface Window {
    __ima_server_error: {
      name: string;
      message: string;
      stack: string;
    };
  }
}

export type ErrorType = 'compile' | 'runtime';

export type ParsedErrorLocation = {
  fileUri: string;
  lineNumber: number;
  columnNumber: number;
};

export type ParsedStack = {
  functionName?: string | null;
  fileUri?: string;
  lineNumber?: number;
  columnNumber?: number;
};

export type ParsedCompileStack = ParsedStack & {
  name: string;
  message: string;
};
