describe('Core.Page.StateManager', function() {

	var stateManager = null;
	var defaultState = { state: 'state', patch: null };
	var patchState = { patch: 'patch' };

	beforeEach(function() {
		stateManager = oc.create('$PageStateManager');

		stateManager._pushToHistory(defaultState);
	});

	it('should clear history', function() {
		stateManager.clear();

		expect(stateManager._states.length).toEqual(0);
	});

	it('should returns default state', function() {
		expect(stateManager.getState()).toEqual(defaultState);
	});

	it('should set smooth copy last state and state patch', function() {
		var newState = Object.assign({}, defaultState, patchState);

		spyOn(stateManager, '_setState')
			.and
			.stub();

		stateManager.setState(patchState);

		expect(stateManager._setState).toHaveBeenCalledWith(newState);
	});

	it('should replace state', function() {
		spyOn(stateManager, '_setState')
			.and
			.stub();

		stateManager.replaceState(patchState);

		expect(stateManager._setState).toHaveBeenCalledWith(patchState, true);
	});

	it('should return history of states', function() {
		expect(stateManager.getAllStates()).toEqual([defaultState]);
	});

	describe('_setState method', function() {

		it('should erase excess history', function() {
			spyOn(stateManager, '_eraseExcessHistory')
				.and
				.stub();

			stateManager._setState(defaultState);

			expect(stateManager._eraseExcessHistory).toHaveBeenCalledWith();
		});

		it('should push state to history', function() {
			spyOn(stateManager, '_pushToHistory')
				.and
				.stub();

			stateManager._setState(defaultState);

			expect(stateManager._pushToHistory).toHaveBeenCalledWith(defaultState);
		});

		it('should call onChange callback', function() {
			spyOn(stateManager, '_callOnChangeCallback')
				.and
				.stub();

			stateManager._setState(defaultState, true);

			expect(stateManager._callOnChangeCallback).toHaveBeenCalledWith(defaultState, true);
		});
	});

});