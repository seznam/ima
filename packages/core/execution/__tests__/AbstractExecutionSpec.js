import AbstractExecution from 'execution/AbstractExecution';

describe('ima.execution.AbstractExecution', () => {
  let execution = null;

  const asyncFunction = argument => {
    return new Promise(resolve => setTimeout(() => resolve(argument), 200));
  };

  const syncFunction = argument => {
    return argument;
  };

  beforeEach(() => {
    execution = new AbstractExecution();
  });

  describe('append() method', () => {
    it('should append a job to the list of jobs', () => {
      execution.append([asyncFunction, syncFunction]);

      expect(execution._jobs.length).toBe(2);
    });

    it("should not append a job if it's invalid", () => {
      execution.append({});

      expect(execution._jobs.length).toBe(0);
    });
  });

  describe('_validateJob() method', () => {
    it("should validate a job before it's appended", () => {
      const jobValidationSpy = spyOn(execution, '_validateJob');

      execution.append(asyncFunction);

      expect(jobValidationSpy).toHaveBeenCalled();
    });
  });
});
