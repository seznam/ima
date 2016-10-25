import Dictionary from 'ima/dictionary/Dictionary';
import Dispatcher from 'ima/event/Dispatcher';
import EventBus from 'ima/event/EventBus';
import Router from 'ima/router/Router';
import Window from 'ima/window/Window';

export let init = (ns, oc, config) => {

	oc.constant('$Utils', {
		get $Router() { return oc.get(Router); },
		get $Dispatcher() { return oc.get(Dispatcher); },
		get $EventBus() { return oc.get(EventBus); },
		get $Dictionary() { return oc.get(Dictionary); },
		get $Settings() { return oc.get('$Settings'); },
		get $Window() { return oc.get(Window); }
	});
};
