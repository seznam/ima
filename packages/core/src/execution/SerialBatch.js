import AbstractExecution from './AbstractExecution';

/**
 *
 *
 * @extends AbstractExecution
 */
export default class SerialBatch extends AbstractExecution {
  /**
   * @inheritDoc
   */
  execute(...args) {
    const zeroStage = Promise.resolve([]);

    return this._jobs.reduce(
      (lastStage, currentStage) =>
        lastStage.then(results =>
          this._executeJob(currentStage, args).then(
            Array.prototype.concat.bind(results)
          )
        ),
      zeroStage
    );
  }

  _executeJob(stage, args) {
    let result = stage(...args);

    if (!(result instanceof Promise)) {
      result = Promise.resolve(result);
    }

    return result;
  }
}
