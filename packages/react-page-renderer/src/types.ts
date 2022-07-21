import AbstractComponent from '@/AbstractComponent';
import AbstractPureComponent from '@/AbstractPureComponent';

declare global {
  var $Debug: boolean
}

export type CssClasses = {
  link(name: string, params: object): string;
};

export type Dictionary = {
  get(key: string, parameters: object): string;
};

export type EventBus = {
  fire(eventTarget: EventTarget, eventName: string, data: any, options?: object): EventBus;
  listen(eventTarget: EventTarget, eventName: string, listener: Function): EventBus;
  unlisten(eventTarget: EventTarget, eventName: string, listener: Function): EventBus;
};

export type Router = {
  link(name: string, params: object): string;
};

export type Utils = {
  $CssClasses(classRules: string | object, component: AbstractComponent | AbstractPureComponent | ''): string;
  $Dictionary: Dictionary;
  $EventBus: EventBus;
  $Router: Router;
} | null;
