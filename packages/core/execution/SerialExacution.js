import AbstractExecution from './AbstractExecution';

/**
 * 
 * 
 * @extends AbstractExecution
 */
export default class SerialExecution extends AbstractExecution {

	/**
	 * @inheritDoc
	 */
	execute(args) {
		const zeroStage = Promise.resolve([]);

		return this._jobs.reduce((lastStage, currentStage) => 
			lastStage.then((results) => 
				currentStage(...args).then(
					Array.prototype.concat.bind(results)
				)
			),
			zeroStage
		);
	}
}