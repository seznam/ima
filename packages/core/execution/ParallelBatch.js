import AbstractExecution from './AbstractExecution';

/**
 *
 *
 * @extends ParallelBatch
 */
export default class ParallelBatch extends AbstractExecution {
  /**
   * @inheritDoc
   */
  execute(...args) {
    return Promise.all(this._jobs.map(job => job(...args)));
  }
}
