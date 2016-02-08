import HomeController from 'app/page/home/controller';
import ErrorController from 'app/page/error/controller';
import NotFoundController from 'app/page/notFound/controller';

export var init = (ns, oc, config) => {

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
