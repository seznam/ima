declare global {
  interface Window {
    __ima_hmr: {
      handleRuntimeError(error: Error): void;
      clearRuntimeErrors(): void;
      showCompileError(webpackErrorMessage: string): void;
      clearCompileError(): void;
    };
  }
}

export {};
