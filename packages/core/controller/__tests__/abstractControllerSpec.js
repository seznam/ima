describe('Ima.Controller.AbstractController', function() {

	var controller = null;
	var pageStateManager = null;

	beforeEach(function() {
		controller = oc.create('Ima.Controller.AbstractController');
		pageStateManager = oc.create('Ima.Page.State.PageStateManager');

		controller.setPageStateManager(pageStateManager);
	});

	it('shoudl be throw error for load method', function() {
		expect(function() {
			controller.load();
		}).toThrow();
	});

	it('should be set state to PageStateManager', function() {
		var state = { state: 'state' };

		spyOn(pageStateManager, 'setState')
			.and
			.stub();

		controller.setState(state);

		expect(pageStateManager.setState).toHaveBeenCalledWith(state);
	});

	describe('getState method', function() {

		it('should be get state from PageStateManager for setted stateManager', function() {
			spyOn(pageStateManager, 'getState')
				.and
				.stub();

			controller.getState();

			expect(pageStateManager.getState).toHaveBeenCalled();
		});

		it('should be return {} for undefined stateManager', function() {
			controller.setPageStateManager(null);

			expect(controller.getState()).toEqual({});
		});
	});
});
