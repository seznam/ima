import Execution from './Execution';
import Job from './Job';

const CLASS_REGEX = /^\s*class\b/;

/**
 * Basic implementation of the {@link Execution} interface. Provides the basic
 * functionality for appending and validating jobs.
 */
export default abstract class AbstractExecution extends Execution {
  protected _jobs: Job[];

  constructor(jobs: Job[] = []) {
    super();

    this._jobs = jobs.filter(this._validateJob);
  }

  /**
   * @inheritDoc
   */
  append(jobs: Job[] | Job) {
    if (!Array.isArray(jobs)) {
      jobs = [jobs];
    }

    this._jobs = this._jobs.concat(jobs.filter(this._validateJob));
  }

  /**
   * Return `true` if the given job can be executed
   *
   * @protected
   * @param {function(): Promise} job
   * @returns {boolean}
   */
  _validateJob(job: Job): boolean {
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
