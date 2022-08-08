import PageStateManagerInterface from "../../src/state/PageStateManagerInterface";

declare module '@ima/core' {
  export class Cache {
    serialize(): void;
  };

  export class ComponentUtils {
    getUtils(): { [key: string]: any };
  };

  export class Controller {
    beginStateTransaction(): void;
    commitStateTransaction(): void;
    getHttpStatus(): number;
    getState(): { [key: string]: any };
    setMetaParams(loadedResources: { [key: string]: any }, metaManager: MetaManager, router: Router, dictionary: Dictionary, settings: { [key: string]: any }): void;
    setState(statePatch: { [key: string]: any }): void;
    update(prevParams: { [key: string]: string }): { [key: string]: Promise<any> | any };
  };

  export class ControllerDecorator extends Controller {
    getMetaManager(): MetaManager;
    setMetaParams(loadedResources: { [key: string]: any }): void;
  };

  export class Dictionary {
    get(key: string, parameters: { [key: string]: boolean | number | string | Date }): string;
  };

  export class Dispatcher {
    fire(event: string, data: { [key: string]: any }, imaInternalEvent: boolean = false): void;
  };

  export class EventBus {
    fire(eventTarget: EventTarget, eventName: string, data: any, options?: { bubbles: boolean, cancelable: boolean }): EventBus;
    listen(eventTarget: EventTarget, eventName: string, listener: (event: Event) => any): EventBus;
    unlisten(eventTarget: EventTarget, eventName: string, listener: (event: Event) => any): EventBus;
  };

  export class GenericError extends Error {
    constructor(message: string, params: { [key: string]: any } = {}, dropInternalStackFrames: boolean = true);
    getHttpStatus(): number;
    getParams(): { [key: string]: any };
  };

  export class MetaManager {
    getLink(relation: string): string;
    getLinks(): string[];
    getMetaName(name: string): string;
    getMetaNames(): string[];
    getMetaProperties(): string[];
    getMetaProperty(name: string): string;
    getTitle(): string;
  };

  export class PageRenderer {
    mount(controller: Controller, view: ComponentType, pageResources: { [key: string]: any | Promise<any> }, routeOptions: RouteOptions): Promise<{ content?: string; pageState: { [key: string]: any }; status: number; }>;
    update(controller: Controller, view: ComponentType, pageResources: { [key: string]: any | Promise<any> }, routeOptions: RouteOptions): Promise<{ content?: string; pageState: { [key: string]: any }; status: number; }>;
    unmount(): void;
    setState(state: { [key: string]: any }): void;
  }

  export enum RendererEvents {
    MOUNTED = '$IMA.$PageRenderer.mounted',
    UPDATED = '$IMA.$PageRenderer.updated',
    UNMOUNTED = '$IMA.$PageRenderer.unmounted',
    ERROR = '$IMA.$PageRenderer.error'
  }

  export enum RendererTypes {
    RENDER = '$IMA.$PageRenderer.type.render',
    HYDRATE = '$IMA.$PageRenderer.type.hydrate',
    UNMOUNT = '$IMA.$PageRenderer.type.unmount'
  };

  export class Response {
    isResponseSent(): boolean;
    getResponseParams(): { status: number, content: string, pageState: { [key: string]: any } };
    send(content: string): Response;
    setPageState(pageState: { [key: string]: any }): Response;
    status(httpStatus: number): Response;
  };

  export class Router {
    link(name: string, params: { [key: string]: string | number }): string;
  };

  export class Window {
    getElementById(id: string): Element;
    getHistoryState(): { [key: string]: any };
    querySelector(selector: string): Element;
    getScrollX(): number;
    getScrollY(): number;
    getUrl(): string;
    getWindow(): undefined | globalThis.Window;
    pushState(state: { [key: string]: any }, title: string | null, url: string) { }
    replaceState(state: { [key: string]: any }, title: string | null, url: string = null): void;
    scrollTo(x: number, y: number): void;
    setTitle(title: string): void;
  };



  // export class AbstractRoute {
  //   getController(): Controller;
  //   getView(): string;
  // };

  // export enum ActionTypes {
  //   CLICK = 'click',
  //   ERROR = 'error',
  //   POP_STATE = 'popstate',
  //   REDIRECT = 'redirect'
  // };






  // export class Execution {
  //   execute(...args: any): Promise;
  // };

  // export class Extension {
  //   getAllowedStateKeys(): string[];
  //   setPageStateManager(pageStateManager: PageStateManagerInterface): void;
  // };





  // export class ObjectContainer {
  //   create(name: string | Object, dependencies: any[]): Object;
  //   get(name: string | Function): Object;
  //   getConstructorOf(name: string | Object): Function;
  //   has(name: string | Function): boolean;
  // };

  

  // export class Router {
  //   link(name: string, params: { [key: string]: string | number }): string;
  // };

  // export class SerialBatch extends Execution { };


}
