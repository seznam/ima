import { AbstractRoute, Controller } from '@ima/core';
import { ComponentType, ReactElement } from 'react';

import RouteOptions from './RouteOptions';

type State = {
  activated: boolean;
  [key: string]: any;
}

/**
 * An object representing a page that's currently managed by PageManager
 */
type ManagedPage = {
  controller?: string | Function;
  controllerInstance?: Controller;
  decoratedController?: Controller;
  options?: RouteOptions;
  params?: { [key: string]: string };
  route?: AbstractRoute;
  state: State;
  view?: ComponentType;
  viewInstance?: ReactElement;
}

export default ManagedPage;
