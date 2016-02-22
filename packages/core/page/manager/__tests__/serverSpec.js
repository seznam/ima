describe('Ima.Abstract.PageManager', function() {
	var pageFactory = {
		createController: function(Controller) {return new Controller();},
		decorateController: function(controller) {return controller;},
		createView: function(view) { return view;}
	};
	var pageRenderer = oc.create('Ima.Page.Renderer.PageRenderer');
	var stateManager = oc.create('Ima.Page.State.PageStateManager');
	var pageManager = null;

	var controller = ns.Ima.Controller.Controller;
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
