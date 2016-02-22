describe('Ima.Page.State.PageStateManagerImpl', function() {

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
		expect(stateManager._cursor).toEqual(-1);
	});

	describe('getState method', function() {

		it('should returns default state', function() {
			expect(stateManager.getState()).toEqual(defaultState);
		});

		it('should returns empty object for empty history', function() {
			stateManager.clear();

			expect(stateManager.getState()).toEqual({});
		});

	});

	describe('setState method', function() {

		it('should set smooth copy last state and state patch', function() {
			var newState = Object.assign({}, defaultState, patchState);

			spyOn(stateManager, '_eraseExcessHistory')
				.and
				.stub();

			spyOn(stateManager, '_pushToHistory')
				.and
				.stub();

			spyOn(stateManager, '_callOnChangeCallback')
				.and
				.stub();


			stateManager.setState(patchState);

			expect(stateManager._eraseExcessHistory).toHaveBeenCalledWith();
			expect(stateManager._pushToHistory).toHaveBeenCalledWith(newState);
			expect(stateManager._callOnChangeCallback).toHaveBeenCalledWith(newState);
		});
	});

	it('should return history of states', function() {
		expect(stateManager.getAllStates()).toEqual([defaultState]);
	});

});
