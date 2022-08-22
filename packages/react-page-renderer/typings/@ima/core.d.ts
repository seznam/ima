import { Utils } from '../../src/types';

declare module '@ima/core' {
  export class Cache {
    serialize(): void;
  }

  export class ComponentUtils {
    getUtils(): Utils;
  }

  export class Controller {
    beginStateTransaction(): void;
    commitStateTransaction(): void;
    getHttpStatus(): number;
    getState(): { [key: string]: unknown };
    setMetaParams(
      loadedResources: { [key: string]: unknown },
      metaManager: MetaManager,
      router: Router,
      dictionary: Dictionary,
      settings: { [key: string]: unknown }
    ): void;
    setState(statePatch: { [key: string]: unknown }): void;
    update(prevParams: { [key: string]: string }): {
      [key: string]: Promise<unknown> | unknown;
    };
  }

  export class ControllerDecorator extends Controller {
    getMetaManager(): MetaManager;
    setMetaParams(loadedResources: { [key: string]: unknown }): void;
  }

  export class Dictionary {
    get(
      key: string,
      parameters: { [key: string]: boolean | number | string | Date }
    ): string;
  }

  export class Dispatcher {
    fire(
      event: string,
      data: { [key: string]: unknown },
      imaInternalEvent: boolean = false
    ): void;
  }

  export class EventBus {
    fire(
      eventTarget: EventTarget,
      eventName: string,
      data: unknown,
      options?: { bubbles: boolean; cancelable: boolean }
    ): EventBus;
    listen(
      eventTarget: EventTarget,
      eventName: string,
      listener: (event: Event) => void
    ): EventBus;
    unlisten(
      eventTarget: EventTarget,
      eventName: string,
      listener: (event: Event) => void
    ): EventBus;
  }

  export class GenericError extends Error {
    constructor(
      message: string,
      params: { [key: string]: unknown } = {},
      dropInternalStackFrames: boolean = true
    );
    getHttpStatus(): number;
    getParams(): { [key: string]: unknown };
  }

  export class MetaManager {
    getLink(relation: string): string;
    getLinks(): string[];
    getMetaName(name: string): string;
    getMetaNames(): string[];
    getMetaProperties(): string[];
    getMetaProperty(name: string): string;
    getTitle(): string;
  }

  export class PageRenderer {
    mount(
      controller: Controller,
      view: ComponentType,
      pageResources: { [key: string]: unknown | Promise<unknown> },
      routeOptions: RouteOptions
    ): Promise<{
      content?: string;
      pageState: { [key: string]: unknown };
      status: number;
    }>;
    update(
      controller: Controller,
      view: ComponentType,
      pageResources: { [key: string]: unknown | Promise<unknown> },
      routeOptions: RouteOptions
    ): Promise<{
      content?: string;
      pageState: { [key: string]: unknown };
      status: number;
    }>;
    unmount(): void;
    setState(state: { [key: string]: unknown }): void;
  }

  export enum RendererEvents {
    MOUNTED = '$IMA.$PageRenderer.mounted',
    UPDATED = '$IMA.$PageRenderer.updated',
    UNMOUNTED = '$IMA.$PageRenderer.unmounted',
    ERROR = '$IMA.$PageRenderer.error',
  }

  export enum RendererTypes {
    RENDER = '$IMA.$PageRenderer.type.render',
    HYDRATE = '$IMA.$PageRenderer.type.hydrate',
    UNMOUNT = '$IMA.$PageRenderer.type.unmount',
  }

  export class Response {
    isResponseSent(): boolean;
    getResponseParams(): {
      status: number;
      content: string;
      pageState: { [key: string]: unknown };
    };
    send(content: string): Response;
    setPageState(pageState: { [key: string]: unknown }): Response;
    status(httpStatus: number): Response;
  }

  export class Router {
    link(name: string, params: { [key: string]: string | number }): string;
  }

  export class Window {
    getElementById(id: string): Element;
    getHistoryState(): { [key: string]: unknown };
    querySelector(selector: string): Element;
    getScrollX(): number;
    getScrollY(): number;
    getUrl(): string;
    getWindow(): undefined | globalThis.Window;
    pushState(
      state: { [key: string]: unknown },
      title: string | null,
      url: string
    ): void;
    replaceState(
      state: { [key: string]: unknown },
      title: string | null,
      url: string = null
    ): void;
    scrollTo(x: number, y: number): void;
    setTitle(title: string): void;
  }
}
