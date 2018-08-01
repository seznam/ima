import AbstractExecution from './AbstractExecution';

/**
 * 
 * 
 * @extends AbstractExecution
 */
export default class ParalelExecution extends AbstractExecution {

	/**
	 * @inheritDoc
	 * @param {Promise.all|Promise.race} resolveMethod
	 */
	execute(args, resolveMethod = Promise.all) {
		if (![Promise.all, Promise.race].includes(resolveMethod)) {
			console.warn(
				'ima.execution.ParalelExecution.execute(): resolveMethod ' + 
				'argument has to be either `Promise.all` or `Promise.race`. ' +
				'Falling back to `Promise.all`'
			);
			resolveMethod = Promise.all;
		}

		return resolveMethod(
			this._jobs.map(job => job(...args))
		);
	}
}