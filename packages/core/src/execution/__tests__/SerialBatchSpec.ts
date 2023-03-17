import { ExecutionJob } from '../Execution';
import { SerialBatch } from '../SerialBatch';

describe('ima.core.execution.SerialBatch', () => {
  let serialBatch: SerialBatch;

  const asyncFunction = (argument: unknown) => {
    return new Promise(resolve => setTimeout(() => resolve(argument), 200));
  };

  const syncFunction = (argument: unknown) => {
    return argument;
  };

  beforeEach(() => {
    serialBatch = new SerialBatch([asyncFunction, syncFunction]);
  });

  describe('execute() method', () => {
    it('should return array of results from each job', async () => {
      expect.assertions(1);
      const argument = 'fluid';

      await serialBatch.execute(argument).then(result => {
        expect(result).toStrictEqual([argument, argument]);
      });
    });

    it('should pass argument to each job without mutation', async () => {
      expect.assertions(1);

      const mutatingFunction = (argument: { newProp: unknown }) => {
        argument.newProp = 'value';
        return Promise.resolve(argument);
      };

      const argument = { oldProp: 'value' };

      serialBatch.append(mutatingFunction as ExecutionJob);

      await serialBatch.execute(argument).then(result => {
        expect(result).toStrictEqual([argument, argument, argument]);
      });
    });

    it('should call each job in the order they were specified', async () => {
      const fnA = jest.fn(asyncFunction);
      const fnB = jest.fn(asyncFunction);

      serialBatch.append([fnA, fnB]);

      await serialBatch.execute('test').then(() => {
        const fnAFirstInvocation = Math.min(...fnA.mock.invocationCallOrder);
        const fnBFirstInvocation = Math.min(...fnB.mock.invocationCallOrder);

        expect(fnAFirstInvocation).toBeLessThan(fnBFirstInvocation);
      });
    });

    it('should return rejected Promise when one of the jobs fails', async () => {
      expect.assertions(1);

      const error = new Error('Test failed');
      const rejectingFunction = () => {
        return Promise.reject(error);
      };

      serialBatch.append(rejectingFunction);

      await serialBatch.execute().catch(error => {
        /* eslint-disable-next-line jest/no-conditional-expect */
        expect(error).toBe(error);
      });
    });
  });
});
