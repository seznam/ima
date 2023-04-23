import { AbstractExecution } from './AbstractExecution';
import { ExecutionJob } from './Execution';

export class SerialBatch extends AbstractExecution {
  /**
   * @inheritDoc
   */
  execute(...args: unknown[]): Promise<unknown> {
    const zeroStage = Promise.resolve([]);

    return this._jobs.reduce(
      (lastStage: Promise<unknown>, currentStage: ExecutionJob) =>
        lastStage.then((results: unknown) =>
          this._executeJob(currentStage, args).then(
            Array.prototype.concat.bind(results)
          )
        ),
      zeroStage
    );
  }

  _executeJob(stage: ExecutionJob, args: unknown[]): Promise<unknown> {
    const result = stage(...args);

    return result instanceof Promise ? result : Promise.resolve(result);
  }
}
