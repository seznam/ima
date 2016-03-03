describe('ima.page.manager.ServerPageManager', function() {
	var pageFactory = {
		createController: function(Controller) {return new Controller();},
		decorateController: function(controller) {return controller;},
		createView: function(view) { return view;}
	};
	var pageRenderer = oc.create('ima.page.renderer.PageRenderer');
	var stateManager = oc.create('ima.page.state.PageStateManager');
	var pageManager = null;

	var controller = ns.ima.controller.Controller;
	var view = function (){};
	var options = {
		onlyUpdate: false,
		autoScroll: true
	};

	beforeEach(function() {
		pageManager =
			oc.create('ima.page.manager.ServerPageManager',
				[
					pageFactory,
					pageRenderer,
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
