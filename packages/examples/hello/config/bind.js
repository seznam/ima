import HomeController from 'app/page/home/HomeController';
import ErrorController from 'app/page/error/ErrorController';
import NotFoundController from 'app/page/notFound/NotFoundController';

export let init = (ns, oc, config) => {

	// Page Home
	oc.inject(HomeController, []);

	// Page Error
	oc.inject(ErrorController, []);

	// Page Not Found
	oc.inject(NotFoundController, []);

	//COMPONENT Utils
	oc.constant('$Utils', {
		$Router: oc.get('$Router'),
		$Dispatcher: oc.get('$Dispatcher'),
		$EventBus: oc.get('$EventBus'),
		$Dictionary: oc.get('$Dictionary'),
		$Settings: oc.get('$Settings'),
		$Window: oc.get('$Window')
	});
};
