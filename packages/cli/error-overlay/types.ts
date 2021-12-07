declare global {
  interface WindowEventMap {
    [OverlayEventName.Ready]: CustomEvent;
    [ClientEventName.RuntimeErrors]: CustomEvent<{ error: Error }>;
    [ClientEventName.CompileErrors]: CustomEvent<{ error: string }>;
    [ClientEventName.ClearRuntimeErrors]: CustomEvent;
    [ClientEventName.ClearCompileErrors]: CustomEvent;
  }
}

export enum OverlayEventName {
  Ready = 'ima.error.overlay.overlay:ready'
}

export enum ClientEventName {
  RuntimeErrors = 'ima.error.overlay.client:runtime.error',
  CompileErrors = 'ima.error.overlay.client:compile.error',
  ClearRuntimeErrors = 'ima.error.overlay.client:clear.runtime.errors',
  ClearCompileErrors = 'ima.error.overlay.client:clear.compile.errors'
}
