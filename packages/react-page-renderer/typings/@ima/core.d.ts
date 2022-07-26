declare module '@ima/core' {
  export class EventBus {
    fire(eventTarget: EventTarget, eventName: string, data: any, options?: object): EventBus;
    listen(eventTarget: EventTarget, eventName: string, listener: Function): EventBus;
    unlisten(eventTarget: EventTarget, eventName: string, listener: Function): EventBus;
  };

  export class Dictionary {
    get(key: string, parameters: object): string;
  };

  export class Dispatcher {
    fire(event: string, data: object, imaInternalEvent: boolean = false): void;
  };

  export class GenericError extends Error {
    constructor(message: string, params: object = {}, dropInternalStackFrames: boolean = true);
    getHttpStatus(): number;
    getParams(): object;
  }

  export class Router {
    link(name: string, params: object): string;
  };
}
