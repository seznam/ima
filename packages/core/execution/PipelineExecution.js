import AbstractExecution from './AbstractExecution';

/**
 * The PipelineExecution class executes jobs in a true pipeline fashion.
 * Arguments passed to the {@code execute} method are passed to the first job
 * in the queue. Result of the first job is then used as an input for the next 
 * job and so on...
 * 
 * {@code Error} thrown in one of the jobs breaks the execution chain. This 
 * error can be caught by specifying {@code catch} function on the 
 * {@code Promise} returned by the {@code execute} method.
 *
 * @extends AbstractExecution
 */
export default class PipelineExecution extends AbstractExecution {

	/**
	 * @inheritDoc
	 */
	execute(args) {
		const zeroStage = Promise.resolve(args);

		return this._jobs.reduce(
			(lastStage, currentStage) => lastStage.then(
				(result) => currentStage(result)
			),
			zeroStage
		);
	}
}