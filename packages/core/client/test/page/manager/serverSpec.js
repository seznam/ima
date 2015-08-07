describe('Core.Abstract.PageManager', function() {
	var pageFactory = {
		createController: function(Controller) {return new Controller();},
		decorateController: function(controller) {return controller;},
		createView: function(view) { return view;}
	};
	var pageRender = oc.create('Core.Interface.PageRender');
	var stateManager = oc.create('Core.Interface.PageStateManager');
	var pageManager = null;

	var controller = ns.Core.Interface.Controller;
	var view = function (){};
	var options = {
		onlyUpdate: false,
		autoScroll: true
	};

	beforeEach(function() {
		pageManager =
			oc.create('Core.Page.Manager.Server',
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