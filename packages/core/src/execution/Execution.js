/**
 * Execution is an abstract class that defines a standard for executing jobs.
 * The execution can be either done in serial or in parallel way.
 *
 * When executing jobs in parallel an option should define how to deal with
 * a result of each individual job execution. One option would be to return the
 * result of a job that completes first. Second option is to return result of
 * all jobs once they're all complete.
 *
 * For serial execution you should define an option that affects how arguments
 * passed to the {@code execute} method are distributed. They could be either
 * supplied to each job individually (thus meaning one job's mutation won't
 * affect another job) or they could be supplied to the first job and then
 * piped through other jobs.
 *
 * @interface
 */
export default class Execution {
  /**
   * Adds a new job to be executed. The job is appended at the end of the
   * list of current jobs therefore is executed last.
   *
   * @param {Array<function(): Promise>} jobs The jobs to be executed.
   */
  append() {}

  /**
   * Start executing collected jobs. In the end a {@code Promise} is returned
   * with a resulting value. On the returned {@code Promise} a {@code catch}
   * method can be called to prevent any unwanted interruption.
   *
   * @param {...any} args Arguments to be passed when executing jobs
   * @returns {Promise}
   */
  execute() {}
}
