import GenericError from '../error/GenericError';
import Execution from './Execution';

const CLASS_REGEX = /^\s*class\b/;

/**
 * Basic implementation of the {@link Execution} interface. Provides the basic
 * functionality for appending and validating jobs.
 *
 * @abstract
 * @extends Execution
 */
export default class AbstractExecution implements Execution {
  protected _jobs: unknown[];

  constructor(jobs = []) {
    this._jobs = jobs.filter(this._validateJob);
  }

  /**
   * @inheritDoc
   */
  append(jobs: unknown[]) {
    if (!Array.isArray(jobs)) {
      jobs = [jobs];
    }

    this._jobs = this._jobs.concat(jobs.filter(this._validateJob));
  }

  /**
   * @inheritDoc
   */
  execute() {
    throw new GenericError(
      'The ima.core.execution.AbstractExecution.execute method is abstract ' +
        'and must be overridden'
    );
  }

  /**
   * Return `true` if the given job can be executed
   *
   * @protected
   * @param {function(): Promise} job
   * @returns {boolean}
   */
  _validateJob(job: () => Promise<undefined>): boolean {
    if (typeof job === 'function') {
      if (!CLASS_REGEX.test(job.toString())) {
        return true;
      }
    }

    if ($Debug) {
      console.warn(
        'ima.core.execution.AbstractExecution: Given job is not a callable ' +
          'function therefore it will be excluded from execution.',
        {
          job,
        }
      );
    }

    return false;
  }
}
