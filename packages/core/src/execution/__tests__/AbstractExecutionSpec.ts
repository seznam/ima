/* eslint-disable @typescript-eslint/ban-ts-comment */

import { SerialBatch } from '../SerialBatch';

describe('ima.core.execution.AbstractExecution', () => {
  let execution: SerialBatch;

  const asyncFunction = (argument: unknown) => {
    return new Promise(resolve => setTimeout(() => resolve(argument), 200));
  };

  const syncFunction = (argument: unknown) => {
    return argument;
  };

  beforeEach(() => {
    execution = new SerialBatch();
  });

  describe('append() method', () => {
    it('should append a job to the list of jobs', () => {
      execution.append([asyncFunction, syncFunction]);

      expect(execution['_jobs']).toHaveLength(2);
    });

    it("should not append a job if it's invalid", () => {
      // @ts-ignore
      execution.append({});

      expect(execution['_jobs']).toHaveLength(0);
    });
  });

  describe('_validateJob() method', () => {
    it("should validate a job before it's appended", () => {
      const jobValidationSpy = jest.spyOn(execution, '_validateJob');

      execution.append(asyncFunction);

      expect(jobValidationSpy).toHaveBeenCalled();
    });
  });
});
