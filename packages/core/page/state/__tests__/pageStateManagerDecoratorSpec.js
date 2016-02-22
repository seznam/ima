describe('Ima.Page.State.PageStateManagerDecorator', function() {
	var pageStateManager = oc.create('Ima.Page.State.PageStateManagerImpl');
	var allowedStateKeys = ['allow'];
	var decoratedPageStateManager = null;
	var state = {
		allow: 1,
		deny: 0
	};

	beforeEach(function() {
		decoratedPageStateManager =
			oc.create('Ima.Page.State.PageStateManagerDecorator',
				[
					pageStateManager,
					allowedStateKeys
				]
			);
	});

	it('should call method clear', function() {
		spyOn(pageStateManager, 'clear')
			.and
			.stub();

		decoratedPageStateManager.clear();

		expect(pageStateManager.clear).toHaveBeenCalled();
	});

	it('should return current page state', function() {
		spyOn(pageStateManager, 'getState')
			.and
			.returnValue(state);

		decoratedPageStateManager.getState();

		expect(decoratedPageStateManager.getState()).toEqual(state);
	});

	it('should return all history of states', function() {
		spyOn(pageStateManager, 'getAllStates')
			.and
			.returnValue([state]);

		expect(decoratedPageStateManager.getAllStates()).toEqual([state]);
	});

	describe('setState method', function() {

		it('should throw IMAError for at least one deny key', function() {
			expect(function() {
				decoratedPageStateManager.setState({ deny: 1 });
			}).toThrow();
		});

		it('should setState for all allowed keys', function() {
			var patchState = {
				allow: 0
			};

			spyOn(pageStateManager, 'setState')
				.and
				.stub();

			decoratedPageStateManager.setState(patchState);

			expect(pageStateManager.setState).toHaveBeenCalledWith(patchState);
		});

	});

});
