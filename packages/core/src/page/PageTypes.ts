import { Controller, IController } from '../controller/Controller';
import { ControllerDecorator } from '../controller/ControllerDecorator';
import { AbstractRoute } from '../router/AbstractRoute';
import { RouteOptions } from '../router/Router';
import { UnknownParameters } from '../types';

export type ManagedPage = {
  controller?: IController;
  controllerInstance?: Controller;
  decoratedController?: ControllerDecorator;
  options?: RouteOptions;
  params?: UnknownParameters;
  route?: AbstractRoute;
  view?: unknown;
  viewInstance?: unknown;
  state?: {
    activated: boolean;
  };
};

export type PageAction = {
  action?: string;
  event?: Event & {
    state: {
      scroll: {
        x: number;
        y: number;
      };
    };
  };
  type?: string;
  url?: string;
};

export type PageData = {
  status: number;
} & UnknownParameters;
