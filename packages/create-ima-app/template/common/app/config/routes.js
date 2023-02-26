import { RouteNames } from '@ima/core';
import { ErrorController } from 'app/page/error/ErrorController';
import { ErrorView } from 'app/page/error/ErrorView';
import { HomeController } from 'app/page/home/HomeController';
import { HomeView } from 'app/page/home/HomeView';
import { NotFoundController } from 'app/page/notFound/NotFoundController';
import { NotFoundView } from 'app/page/notFound/NotFoundView';

export const initRoutes = (ns, oc, routesConfig, router) =>
  router
    .add('home', '/', HomeController, HomeView)
    .add(RouteNames.ERROR, '/error', ErrorController, ErrorView)
    .add(RouteNames.NOT_FOUND, '/not-found', NotFoundController, NotFoundView);
