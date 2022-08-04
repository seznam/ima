import { Controller } from '@ima/core';
import { ComponentType } from 'react';

/**
 * An Object used to configure a route
 */
type RouteOptions = {
  allowSPA: boolean;
  autoScroll: boolean;
  documentView?: ComponentType;
  managedRootView?: ComponentType;
  onlyUpdate?: (controller: Controller, view: ComponentType) => boolean;
  viewAdapter?: ComponentType;
}

export default RouteOptions;
