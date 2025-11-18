/* eslint-disable no-console */
// Mock performance API
let mockTimeCounter = 0;
const mockPerformance = {
  now: jest.fn(),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntries: jest.fn(),
  getEntriesByType: jest.fn(),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn(),
};

jest.mock('perf_hooks', () => ({
  performance: mockPerformance,
}));

// Mock chalk for console output tests
const mockChalkFn = jest.fn(text => text);
jest.mock('chalk', () => ({
  cyan: mockChalkFn,
  bold: Object.assign(mockChalkFn, {
    cyan: mockChalkFn,
    yellow: mockChalkFn,
  }),
  yellow: mockChalkFn,
  red: mockChalkFn,
  green: mockChalkFn,
  magenta: mockChalkFn,
  blue: mockChalkFn,
  gray: mockChalkFn,
  dim: mockChalkFn,
}));

const { TimingTracker, DEFAULT_OPTIONS } = require('../TimingTracker');

describe('TimingTracker', () => {
  let tracker;

  beforeEach(() => {
    // Reset mock performance time for each test
    mockTimeCounter = 100;
    mockPerformance.now.mockImplementation(() => {
      mockTimeCounter += 10;
      return mockTimeCounter;
    });

    mockChalkFn.mockImplementation(text => text);

    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with default options', () => {
      tracker = new TimingTracker();

      expect(tracker.options).toEqual(DEFAULT_OPTIONS);
      expect(tracker.enabled).toBe(true);
      expect(tracker.events).toEqual([]);
      expect(tracker._pendingOperations.size).toBe(0);
    });

    it('should merge custom options with defaults', () => {
      const customOptions = {
        enabled: false,
        slowThreshold: 100,
        includeMetadata: false,
      };

      tracker = new TimingTracker(customOptions);

      expect(tracker.options.enabled).toBe(false);
      expect(tracker.options.slowThreshold).toBe(100);
      expect(tracker.options.includeMetadata).toBe(false);
      expect(tracker.options.maxEvents).toBe(DEFAULT_OPTIONS.maxEvents);
    });

    it('should bail early when disabled', () => {
      tracker = new TimingTracker({ enabled: false });
      tracker.track('testEvent');

      expect(tracker.enabled).toBe(false);
      expect(mockPerformance.now).toHaveBeenCalledTimes(0);
    });

    it('should create initial native mark when useNativeMarks is true', () => {
      tracker = new TimingTracker({ useNativeMarks: true });

      expect(mockPerformance.mark).toHaveBeenCalledWith(
        expect.stringContaining('ima-perf-')
      );
    });

    it('should not create native marks when useNativeMarks is false', () => {
      tracker = new TimingTracker({ useNativeMarks: false });

      expect(mockPerformance.mark).not.toHaveBeenCalled();
    });
  });

  describe('track method', () => {
    beforeEach(() => {
      tracker = new TimingTracker();
    });

    it('should add event to events array', () => {
      tracker.track('testEvent', { foo: 'bar' });

      expect(tracker.events).toHaveLength(1);
      expect(tracker.events[0]).toMatchObject({
        name: 'testEvent',
        metadata: { foo: 'bar' },
      });
      expect(tracker.events[0]).toHaveProperty('timestamp');
      expect(tracker.events[0]).toHaveProperty('duration');
      expect(tracker.events[0]).toHaveProperty('gap');
    });

    it('should exclude metadata when includeMetadata is false', () => {
      tracker = new TimingTracker({ includeMetadata: false });

      tracker.track('testEvent', { foo: 'bar' });

      expect(tracker.events[0].metadata).toBeNull();
    });

    it('should create native performance mark when enabled', () => {
      tracker = new TimingTracker({ useNativeMarks: true });

      tracker.track('testEvent');

      expect(mockPerformance.mark).toHaveBeenCalledTimes(2); // init + track
      expect(mockPerformance.mark).toHaveBeenCalledWith(
        expect.stringContaining('ima-perf-'),
        expect.objectContaining({
          detail: {},
        })
      );
    });

    it('should create native measure between marks when enabled', () => {
      tracker = new TimingTracker({
        useNativeMarks: true,
        useNativeMeasures: true,
      });

      tracker.track('first');
      tracker.track('second');

      expect(mockPerformance.measure).toHaveBeenCalledWith(
        expect.stringContaining('ima-perf-'),
        expect.stringContaining('ima-perf-'),
        expect.stringContaining('ima-perf-')
      );
    });

    it('should not add events beyond maxEvents limit', () => {
      tracker = new TimingTracker({ maxEvents: 2 });

      tracker.track('event1');
      tracker.track('event2');
      tracker.track('event3');

      expect(tracker.events).toHaveLength(2);
    });

    it('should do nothing when tracker is disabled', () => {
      tracker = new TimingTracker({ enabled: false });

      tracker.track('testEvent');

      // When disabled, events array is not initialized
      expect(tracker.events).toBeUndefined();
    });
  });

  describe('start and end methods', () => {
    beforeEach(() => {
      tracker = new TimingTracker();
    });

    it('should start timing an operation', () => {
      tracker.start('testOp', { initial: 'data' });

      expect(tracker._pendingOperations.has('testOp')).toBe(true);
      const pending = tracker._pendingOperations.get('testOp');
      expect(pending.startMetadata).toEqual({ initial: 'data' });
    });

    it('should end timing an operation and track duration', () => {
      tracker.start('testOp', { initial: 'data' });
      tracker.end('testOp', { final: 'result' });

      expect(tracker._pendingOperations.has('testOp')).toBe(false);
      expect(tracker.events).toHaveLength(1);
      expect(tracker.events[0]).toEqual({
        name: 'testOp',
        timestamp: expect.any(Number),
        duration: expect.any(Number),
        gap: expect.any(Number),
        metadata: {
          initial: 'data',
          final: 'result',
          duration: expect.any(Number),
        },
      });
    });

    it('should warn and return null when ending without matching start', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const result = tracker.end('nonexistentOp');

      expect(result).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'No matching start() call for nonexistentOp'
      );
      expect(tracker.events).toHaveLength(0);

      consoleWarnSpy.mockRestore();
    });

    it('should do nothing when tracker is disabled', () => {
      tracker = new TimingTracker({ enabled: false });

      tracker.start('testOp');
      const result = tracker.end('testOp');

      expect(result).toBeNull();
      // When disabled, _pendingOperations is not initialized
      expect(tracker._pendingOperations).toBeUndefined();
    });
  });

  describe('measure method', () => {
    beforeEach(() => {
      tracker = new TimingTracker();
    });

    it('should measure synchronous function execution', () => {
      const mockFn = jest.fn(() => 'result');

      const result = tracker.measure('syncOp', mockFn, { category: 'test' });

      expect(result).toBe('result');
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(tracker.events).toHaveLength(1);
      expect(tracker.events[0].name).toBe('syncOp');
      expect(tracker.events[0].metadata).toEqual({
        category: 'test',
        success: true,
        duration: expect.any(Number),
      });
    });

    it('should measure asynchronous function execution', async () => {
      const mockFn = jest.fn(() => Promise.resolve('async result'));

      const result = await tracker.measure('asyncOp', mockFn);

      expect(result).toBe('async result');
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(tracker.events).toHaveLength(1);
      expect(tracker.events[0].name).toBe('asyncOp');
      expect(tracker.events[0].metadata.success).toBe(true);
    });

    it('should handle synchronous function errors', () => {
      const mockFn = jest.fn(() => {
        throw new Error('sync error');
      });

      expect(() => tracker.measure('errorOp', mockFn)).toThrow('sync error');

      expect(tracker.events).toHaveLength(1);
      expect(tracker.events[0].metadata.success).toBe(false);
      expect(tracker.events[0].metadata.error).toBe('sync error');
    });

    it('should return original function when disabled', () => {
      tracker = new TimingTracker({ enabled: false });
      const mockFn = jest.fn(() => 'result');

      const result = tracker.measure('disabledOp', mockFn);

      expect(result).toBe('result');
      // When disabled, events array is not initialized
      expect(tracker.events).toBeUndefined();
    });
  });

  describe('wrap method', () => {
    beforeEach(() => {
      tracker = new TimingTracker();
    });

    it('should return wrapped function that tracks each call', () => {
      const originalFn = jest.fn(() => 'result');
      const wrappedFn = tracker.wrap('wrappedOp', originalFn, {
        static: 'data',
      });

      const result = wrappedFn('arg1', 'arg2');

      expect(result).toBe('result');
      expect(originalFn).toHaveBeenCalledWith('arg1', 'arg2');
      expect(tracker.events).toHaveLength(1);
      expect(tracker.events[0].metadata).toEqual({
        static: 'data',
        callCount: 1,
        success: true,
        duration: expect.any(Number),
      });
    });

    it('should increment call count on each call', () => {
      const originalFn = jest.fn(() => 'result');
      const wrappedFn = tracker.wrap('multiCallOp', originalFn);

      wrappedFn();
      wrappedFn();
      wrappedFn();

      expect(tracker.events).toHaveLength(3);
      expect(tracker.events[0].metadata.callCount).toBe(1);
      expect(tracker.events[1].metadata.callCount).toBe(2);
      expect(tracker.events[2].metadata.callCount).toBe(3);
    });

    it('should handle async wrapped functions', async () => {
      const originalFn = jest.fn(() => Promise.resolve('async result'));
      const wrappedFn = tracker.wrap('asyncWrappedOp', originalFn);

      const result = await wrappedFn();

      expect(result).toBe('async result');
      expect(tracker.events).toHaveLength(1);
      expect(tracker.events[0].metadata.success).toBe(true);
    });

    it('should handle errors in wrapped functions', () => {
      const originalFn = jest.fn(() => {
        throw new Error('wrapped error');
      });
      const wrappedFn = tracker.wrap('errorWrappedOp', originalFn);

      expect(() => wrappedFn()).toThrow('wrapped error');

      expect(tracker.events).toHaveLength(1);
      expect(tracker.events[0].metadata.success).toBe(false);
      expect(tracker.events[0].metadata.error).toBe('wrapped error');
    });

    it('should return original function when disabled', () => {
      tracker = new TimingTracker({ enabled: false });
      const originalFn = jest.fn(() => 'result');

      const wrappedFn = tracker.wrap('disabledWrap', originalFn);

      expect(wrappedFn).toBe(originalFn);
    });
  });

  describe('reporting methods', () => {
    beforeEach(() => {
      tracker = new TimingTracker({ slowThreshold: 50 });
      tracker.track('fastEvent');
      tracker.track('evt', { customData: true });
      tracker.track('anotherEvent');
    });

    describe('getReport', () => {
      it('should return null when disabled', () => {
        tracker = new TimingTracker({ enabled: false });

        const report = tracker.getReport();

        expect(report).toBeNull();
      });

      it('should return null when no events', () => {
        tracker = new TimingTracker();

        const report = tracker.getReport();

        expect(report).toBeNull();
      });

      it('should return comprehensive report with events', () => {
        const report = tracker.getReport();

        expect(report).toEqual({
          enabled: true,
          totalDuration: expect.any(Number),
          eventCount: 3,
          events: expect.any(Array),
          slowEvents: expect.any(Array),
          thresholds: {
            slow: 50,
          },
        });
      });
    });

    describe('logReport', () => {
      it('should do nothing when disabled', () => {
        tracker = new TimingTracker({ enabled: false });

        tracker.logReport();

        expect(console.log).not.toHaveBeenCalled();
      });

      it('should do nothing when no events', () => {
        tracker = new TimingTracker();

        tracker.logReport();

        expect(console.log).not.toHaveBeenCalled();
      });

      it('should log formatted report to console', () => {
        tracker.logReport();

        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('Performance Timeline')
        );
      });
    });

    describe('getSummary', () => {
      it('should return null when disabled', () => {
        tracker = new TimingTracker({ enabled: false });

        const summary = tracker.getSummary();

        expect(summary).toBeNull();
      });

      it('should return statistics summary', () => {
        const summary = tracker.getSummary();

        expect(summary).toEqual({
          totalDuration: expect.any(Number),
          eventCount: 3,
          averageGap: expect.any(Number),
          maxGap: expect.any(Number),
          minGap: expect.any(Number),
          slowEventCount: 0,
        });
      });
    });
  });

  describe('native performance API methods', () => {
    beforeEach(() => {
      tracker = new TimingTracker();
    });

    describe('getNativeEntries', () => {
      it('should return all entries when no type specified', () => {
        const mockEntries = [{ name: 'entry1' }, { name: 'entry2' }];
        mockPerformance.getEntries.mockReturnValue(mockEntries);

        const entries = tracker.getNativeEntries();

        expect(mockPerformance.getEntries).toHaveBeenCalled();
        expect(entries).toEqual(mockEntries);
      });

      it('should return filtered entries by type', () => {
        const mockMarkEntries = [{ name: 'mark1' }];
        mockPerformance.getEntriesByType.mockReturnValue(mockMarkEntries);

        const entries = tracker.getNativeEntries('mark');

        expect(mockPerformance.getEntriesByType).toHaveBeenCalledWith('mark');
        expect(entries).toEqual(mockMarkEntries);
      });

      it('should return empty array when disabled', () => {
        tracker = new TimingTracker({ enabled: false });

        const entries = tracker.getNativeEntries();

        expect(entries).toEqual([]);
      });
    });

    describe('clearNativeEntries', () => {
      it('should clear all native entries', () => {
        tracker.clearNativeEntries();

        expect(mockPerformance.clearMarks).toHaveBeenCalled();
        expect(mockPerformance.clearMeasures).toHaveBeenCalled();
      });

      it('should do nothing when disabled', () => {
        tracker = new TimingTracker({ enabled: false });

        tracker.clearNativeEntries();

        expect(mockPerformance.clearMarks).not.toHaveBeenCalled();
        expect(mockPerformance.clearMeasures).not.toHaveBeenCalled();
      });
    });
  });

  describe('clear method', () => {
    beforeEach(() => {
      tracker = new TimingTracker();
      tracker.track('testEvent');
      tracker.start('pendingOp');
    });

    it('should clear all events and reset state', () => {
      tracker.clear();

      expect(tracker.events).toEqual([]);
      expect(tracker._pendingOperations.size).toBe(0);
      expect(tracker.startTime).toBeGreaterThan(0);
      expect(tracker.lastTimestamp).toBe(tracker.startTime);
    });

    it('should optionally clear native entries', () => {
      tracker.clear(true);

      expect(mockPerformance.clearMarks).toHaveBeenCalled();
      expect(mockPerformance.clearMeasures).toHaveBeenCalled();
    });

    it('should recreate initial mark when useNativeMarks is true', () => {
      tracker = new TimingTracker({ useNativeMarks: true });
      const initialMarkCount = mockPerformance.mark.mock.calls.length;

      tracker.clear();

      expect(mockPerformance.mark).toHaveBeenCalledTimes(initialMarkCount + 1);
    });

    it('should do nothing when disabled', () => {
      tracker = new TimingTracker({ enabled: false });
      tracker.events = ['should not change'];

      tracker.clear();

      expect(tracker.events).toEqual(['should not change']);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle measure with non-promise return value', () => {
      tracker = new TimingTracker();
      const mockFn = jest.fn(() => ({ then: 'not a function' }));

      const result = tracker.measure('edgeCase', mockFn);

      expect(result).toEqual({ then: 'not a function' });
      expect(tracker.events).toHaveLength(1);
    });

    it('should handle wrap with this context correctly', () => {
      tracker = new TimingTracker();

      class TestClass {
        constructor() {
          this.value = 'original';
          this.testMethod = tracker.wrap(
            'testMethod',
            this.testMethod.bind(this)
          );
        }

        testMethod() {
          return this.value;
        }
      }

      const instance = new TestClass();
      const result = instance.testMethod();

      expect(result).toBe('original');
      expect(tracker.events).toHaveLength(1);
    });

    it('should handle native performance measure failures gracefully', () => {
      tracker = new TimingTracker({
        useNativeMarks: true,
        useNativeMeasures: true,
      });

      mockPerformance.measure.mockImplementation(() => {
        throw new Error('Measure failed');
      });

      // Should not throw
      expect(() => {
        tracker.track('first');
        tracker.track('second');
      }).not.toThrow();
    });
  });
});
