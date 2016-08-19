import RouteNames from 'ima/router/RouteNames';
import ErrorController from 'app/page/error/Controller';
import ErrorView from 'app/page/error/View';
import HomeController from 'app/page/home/Controller';
import HomeView from 'app/page/home/View';
import NotFoundController from 'app/page/notFound/Controller';
import NotFoundView from 'app/page/notFound/View';

export let init = (ns, oc, config) => {
	let router = oc.get('$Router');

	router
		.add('home', '/', HomeController, HomeView)
		.add('filtered', '/:filter', HomeController, HomeView)
		.add(RouteNames.ERROR, '/error', ErrorController, ErrorView)
		.add(RouteNames.NOT_FOUND, '/not-found', NotFoundController, NotFoundView);

};
