import ParallelBatch from 'execution/ParallelBatch';

describe('ima.execution.ParallelBatch', () => {
  let parallelBatch = null;

  const asyncFunction = argument => {
    return new Promise(resolve => setTimeout(() => resolve(argument), 200));
  };

  const syncFunction = argument => {
    return argument;
  };

  beforeEach(() => {
    parallelBatch = new ParallelBatch([asyncFunction, syncFunction]);
  });

  describe('execute() method', () => {
    it('should return array of results from each job', () => {
      expect.assertions(1);
      const argument = 'fluid';

      return parallelBatch.execute(argument).then(result => {
        expect(result).toEqual([argument, argument]);
      });
    });

    it('should pass argument to each job without mutation', () => {
      expect.assertions(1);

      const mutatingFunction = argument => {
        argument.newProp = 'value';
        return Promise.resolve(argument);
      };

      const argument = { oldProp: 'value' };

      parallelBatch.append(mutatingFunction);

      return parallelBatch.execute(argument).then(result => {
        expect(result).toEqual([argument, argument, argument]);
      });
    });

    it('should return rejected Promise when one of the jobs fails', () => {
      expect.assertions(1);

      const error = new Error('Test failed');
      const rejectingFunction = () => {
        return Promise.reject(error);
      };

      parallelBatch.append(rejectingFunction);

      return parallelBatch.execute().catch(error => {
        expect(error).toEqual(error);
      });
    });
  });
});
