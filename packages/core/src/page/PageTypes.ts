import { Controller } from '../controller/Controller';
import { ControllerDecorator } from '../controller/ControllerDecorator';
import { AbstractRoute } from '../router/AbstractRoute';
import { RouteAction, RouteOptions } from '../router/Router';
import { UnknownParameters } from '../types';

// FIXME most of these types are probably always defined
export type ManagedPage = {
  controller?: Controller;
  controllerInstance?: Controller;
  decoratedController?: ControllerDecorator;
  options?: RouteOptions;
  params?: UnknownParameters;
  route?: InstanceType<typeof AbstractRoute>;
  view?: unknown;
  viewInstance?: unknown;
  state?: {
    activated: boolean;
  };
};

export interface PageAction extends RouteAction {
  event?: Event & {
    state?: {
      scroll?: {
        x: number;
        y: number;
      };
    };
  };
}

export type PageData = {
  status: number;
} & UnknownParameters;
