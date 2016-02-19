describe('Ima.Abstract.PageManager', function() {
	var pageFactory = {
		createController: function(Controller) {return new Controller();},
		decorateController: function(controller) {return controller;},
		createView: function(view) { return view;}
	};
	var pageRender = oc.create('Ima.Interface.PageRender');
	var stateManager = oc.create('Ima.Interface.PageStateManager');
	var pageManager = null;

	var controller = ns.Ima.Interface.Controller;
	var view = function (){};
	var options = {
		onlyUpdate: false,
		autoScroll: true
	};

	beforeEach(function() {
		pageManager =
			oc.create('Ima.Page.Manager.Server',
				[
					pageFactory,
					pageRender,
					stateManager
				]
			);
	});


	it('scrollTo method should be override', function() {
		expect(function() {
			pageManager.scrollTo(0, 0);
		}).not.toThrow();
	});
});