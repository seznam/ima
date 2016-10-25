import Router from 'ima/router/Router';
import RouteNames from 'ima/router/RouteNames';
import ErrorController from '../page/error/ErrorController';
import ErrorView from '../page/error/ErrorView';
import HomeController from '../page/home/HomeController';
import HomeView from '../page/home/HomeView';
import NotFoundController from '../page/notFound/NotFoundController';
import NotFoundView from '../page/notFound/NotFoundView';

export let init = (ns, oc, config) => {
	let router = oc.get(Router);

	router
		.add('home', '/', HomeController, HomeView)
		.add('filtered', '/:filter', HomeController, HomeView)
		.add(RouteNames.ERROR, '/error', ErrorController, ErrorView)
		.add(RouteNames.NOT_FOUND, '/not-found', NotFoundController, NotFoundView);

};
