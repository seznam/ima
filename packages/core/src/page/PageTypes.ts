import { Controller } from '../controller/Controller';
import { ControllerDecorator } from '../controller/ControllerDecorator';
import {
  AbstractRoute,
  RouteController,
  RouteParams,
} from '../router/AbstractRoute';
import { RouteAction, RouteOptions } from '../router/Router';
import { UnknownParameters } from '../types';

export type ManagedPage = {
  controller: RouteController;
  controllerInstance: Controller;
  decoratedController: ControllerDecorator;
  options: RouteOptions;
  params: RouteParams;
  route: InstanceType<typeof AbstractRoute>;
  view: unknown;
  viewInstance: unknown;
  state: {
    activated: boolean;
    initialized: boolean;
    cancelled: boolean;
    executed: boolean;
    mounted: boolean;
    abort?: {
      promise: Promise<void>;
      resolve: () => void;
      reject: () => void;
    };
    page: {
      promise: Promise<void>;
      resolve: () => void;
      reject: () => void;
    };
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
