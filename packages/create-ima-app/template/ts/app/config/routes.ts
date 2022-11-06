import {
  Namespace,
  ObjectContainer,
  RouteNames,
  Router,
  UnknownParameters,
} from '@ima/core';
import { HomeController } from 'app/page/home/HomeController';
import { HomeView } from 'app/page/home/HomeView';
import { ErrorController } from 'app/page/error/ErrorController';
import { ErrorView } from 'app/page/error/ErrorView';
import { NotFoundController } from 'app/page/notFound/NotFoundController';
import { NotFoundView } from 'app/page/notFound/NotFoundView';

// TODO what is routesConfig?
export default (
  ns: Namespace,
  oc: ObjectContainer,
  routesConfig: UnknownParameters,
  router: Router
) =>
  router
    .add('home', '/', HomeController, HomeView)
    .add(RouteNames.ERROR, '/error', ErrorController, ErrorView)
    .add(RouteNames.NOT_FOUND, '/not-found', NotFoundController, NotFoundView);
