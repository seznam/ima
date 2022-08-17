import { RouteNames } from '@ima/core';
import HomeController from 'app/page/home/HomeController';
import HomeController2 from 'app/page/home/HomeController2';
import HomeView from 'app/page/home/HomeView';
import ErrorController from 'app/page/error/ErrorController';
import ErrorView from 'app/page/error/ErrorView';
import NotFoundController from 'app/page/notFound/NotFoundController';
import NotFoundView from 'app/page/notFound/NotFoundView';
import TestExtension from 'app/page/home/TestExtension2';

export default (ns, oc, routesConfig, router) =>
  router
    .add('home', '/', HomeController, HomeView)
    .add('home2', '/h2', HomeController2, HomeView, {
      extensions: [TestExtension],
    })
    .add('home3', '/h3', HomeController, HomeView, {
      extensions: [TestExtension],
    })
    .add(RouteNames.ERROR, '/error', ErrorController, ErrorView)
    .add(RouteNames.NOT_FOUND, '/not-found', NotFoundController, NotFoundView);
