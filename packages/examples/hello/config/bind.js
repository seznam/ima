import Dictionary from 'ima/dictionary/Dictionary';
import Dispatcher from 'ima/event/Dispatcher';
import EventBus from 'ima/event/EventBus';
import Router from 'ima/router/Router';
import Window from 'ima/window/Window';

export let init = (ns, oc, config) => {

	//COMPONENT Utils
	oc.constant('$Utils', {
		$Router: oc.get(Router),
		$Dispatcher: oc.get(Dispatcher),
		$EventBus: oc.get(EventBus),
		$Dictionary: oc.get(Dictionary),
		$Settings: oc.get('$Settings'),
		$Window: oc.get(Window)
	});
};
