declare module '@ima/core' {
  export class Dispatcher {
    fire(event: string, data: object, imaInternalEvent: boolean = false): void;
  };

  export class GenericError extends Error {
    constructor(message: string, params: object = {}, dropInternalStackFrames: boolean = true);
    getHttpStatus(): number;
    getParams(): object;
  }
}
