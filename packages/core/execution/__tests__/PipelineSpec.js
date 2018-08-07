import Pipeline from 'execution/Pipeline';

describe('ima.execution.Pipeline', () => {
  let pipeline = null;

  const asyncFunction = argument => {
    return new Promise(resolve => setTimeout(() => resolve(argument), 200));
  };

  const syncFunction = argument => {
    return argument;
  };

  beforeEach(() => {
    pipeline = new Pipeline([asyncFunction, syncFunction]);
  });

  describe('execute() method', () => {
    it('should pass argument through the pipeline and resolve', () => {
      expect.assertions(1);
      const argument = 'fluid';

      return pipeline.execute(argument).then(result => {
        expect(result).toEqual([argument]);
      });
    });

    it('should pass argument through the pipeline with mutation', () => {
      expect.assertions(1);

      const mutatingFunction = ([argument]) => {
        argument.newProp = 'value';
        return Promise.resolve([argument]);
      };

      pipeline.append(mutatingFunction);

      return pipeline.execute({ oldProp: 'value' }).then(result => {
        expect(result).toEqual([{ oldProp: 'value', newProp: 'value' }]);
      });
    });

    it('should return rejected Promise when one job fails', () => {
      expect.assertions(1);

      const error = new Error('Test failed');
      const rejectingFunction = () => {
        return Promise.reject(error);
      };

      pipeline.append(rejectingFunction);

      return pipeline.execute().catch(error => {
        expect(error).toBe(error);
      });
    });
  });
});
