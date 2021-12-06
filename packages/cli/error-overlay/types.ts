declare global {
  interface WindowEventMap {
    [OverlayEventName.Ready]: CustomEvent;
    [ClientEventName.RuntimeErrors]: CustomEvent<{ error: Error }>;
    [ClientEventName.CompileErrors]: CustomEvent<{ error: string }>;
    [ClientEventName.ClearErrors]: CustomEvent;
  }
}

export enum OverlayEventName {
  Ready = 'ima.error.overlay.overlay:ready'
}

export enum ClientEventName {
  RuntimeErrors = 'ima.error.overlay.client:runtime.error',
  CompileErrors = 'ima.error.overlay.client:compile.error',
  ClearErrors = 'ima.error.overlay.client:clear.errors'
}
