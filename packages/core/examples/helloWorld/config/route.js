export var init = (ns) => {
	var router = ns.oc.get('$Router');

	router
		.add('home', '/', 'HomeController')
		.add('error', '/error', 'ErrorController')
		.add('notFound', '/not-found', 'NotFoundController')

};
