import AbstractExecution from './AbstractExecution';
import Job from './Job';

export default class SerialBatch extends AbstractExecution {
  /**
   * @inheritDoc
   */
  execute(...args: unknown[]) {
    const zeroStage = Promise.resolve([]);

    return this._jobs.reduce(
      (lastStage: Promise<unknown>, currentStage: Job) =>
        lastStage.then((results: unknown) =>
          this._executeJob(currentStage, args).then(
            Array.prototype.concat.bind(results)
          )
        ),
      zeroStage
    );
  }

  _executeJob(stage: Job, args: unknown[]) {
    let result = stage(...args);

    return (result instanceof Promise) ? result : Promise.resolve(result);
  }
}
