/* eslint-disable no-console */
const { Event } = require('../../emitter');
const { instrumentEmitter, DEFAULT_OPTIONS } = require('../performanceMonitor');

describe('performanceMonitor', () => {
  let mockEmitter;
  let mockEvent;

  beforeEach(() => {
    // Create mock emitter with jest spies
    mockEmitter = {
      prependListener: jest.fn(),
      on: jest.fn(),
      listeners: jest.fn().mockReturnValue([]),
    };

    // Mock event context
    mockEvent = {
      context: {},
      req: {
        method: 'GET',
        url: '/test',
        headers: { 'user-agent': 'test' },
      },
      res: {
        statusCode: 200,
      },
    };

    // Mock console methods
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('instrumentEmitter function', () => {
    it('should return emitter unchanged when disabled', () => {
      const result = instrumentEmitter(mockEmitter, { enabled: false });

      expect(result).toBe(mockEmitter);
      // Should not call prependListener or on when disabled
      expect(mockEmitter.prependListener).not.toHaveBeenCalled();
      expect(mockEmitter.on).not.toHaveBeenCalled();
    });

    it('should apply sampling rate and skip when random > rate', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.8); // 0.8 > 0.5

      const result = instrumentEmitter(mockEmitter, { samplingRate: 0.5 });

      expect(result).toBe(mockEmitter);
      expect(Math.random).toHaveBeenCalledTimes(1);
      // Should not call prependListener or on when sampling skips
      expect(mockEmitter.prependListener).not.toHaveBeenCalled();
      expect(mockEmitter.on).not.toHaveBeenCalled();
    });

    it('should apply sampling rate and continue when random <= rate', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.3); // 0.3 <= 0.5

      const result = instrumentEmitter(mockEmitter, { samplingRate: 0.5 });

      expect(result).toBe(mockEmitter);
      expect(Math.random).toHaveBeenCalledTimes(1);
      // Should call prependListener and on when sampling allows
      expect(mockEmitter.prependListener).toHaveBeenCalledTimes(
        Object.keys(Event).length
      );
      expect(mockEmitter.on).toHaveBeenCalledTimes(Object.keys(Event).length);
    });

    it('should add listeners for all DEFAULT_IMA_EVENTS', () => {
      instrumentEmitter(mockEmitter);

      // Should call prependListener and on for each event
      expect(mockEmitter.prependListener).toHaveBeenCalledTimes(
        Object.keys(Event).length
      );
      expect(mockEmitter.on).toHaveBeenCalledTimes(Object.keys(Event).length);
    });

    it('should prepend start listener and append end listener', () => {
      instrumentEmitter(mockEmitter);

      // Check that prependListener is called before on for each event
      const events = Object.values(Event);

      events.forEach(eventName => {
        expect(mockEmitter.prependListener).toHaveBeenCalledWith(
          eventName,
          expect.any(Function)
        );
        expect(mockEmitter.on).toHaveBeenCalledWith(
          eventName,
          expect.any(Function)
        );
      });
    });
  });

  describe('event tracking behavior', () => {
    beforeEach(() => {
      instrumentEmitter(mockEmitter);
    });

    it('should initialize PerformanceTracker on first event (BeforeRequest)', () => {
      // Get the BeforeRequest start listener (first call to prependListener)
      const beforeRequestCalls = mockEmitter.prependListener.mock.calls.filter(
        call => call[0] === Event.BeforeRequest
      );
      expect(beforeRequestCalls).toHaveLength(1);
      const startListener = beforeRequestCalls[0][1];

      startListener(mockEvent);

      expect(mockEvent.context.perf).toBeDefined();
      expect(mockEvent.context.perf.constructor.name).toBe(
        'PerformanceTracker'
      );
    });

    it('should track request.received on first event', () => {
      // Get the BeforeRequest start listener
      const beforeRequestCalls = mockEmitter.prependListener.mock.calls.filter(
        call => call[0] === Event.BeforeRequest
      );
      const startListener = beforeRequestCalls[0][1];

      startListener(mockEvent);

      // Check that an event was tracked with request data
      expect(mockEvent.context.perf.events).toHaveLength(1);
      expect(mockEvent.context.perf.events[0]).toMatchObject({
        name: 'request.received',
        metadata: {
          method: 'GET',
          url: '/test',
          headers: 1, // Object.keys length
        },
      });
    });

    it('should start timing for events when autoTrackEvents is true', () => {
      // Get the Request event start listener (not BeforeRequest)
      const requestCalls = mockEmitter.prependListener.mock.calls.filter(
        call => call[0] === Event.Request
      );
      const startListener = requestCalls[0][1];

      // First initialize tracker with BeforeRequest
      const beforeRequestCalls = mockEmitter.prependListener.mock.calls.filter(
        call => call[0] === Event.BeforeRequest
      );
      const firstStartListener = beforeRequestCalls[0][1];
      firstStartListener(mockEvent);

      // Check initial state
      const initialPendingCount =
        mockEvent.context.perf._pendingOperations.size;

      // Now test other event timing
      startListener(mockEvent);

      // Should have added a pending operation
      expect(mockEvent.context.perf._pendingOperations.size).toBe(
        initialPendingCount + 1
      );
      expect(mockEvent.context.perf._pendingOperations.has(Event.Request)).toBe(
        true
      );
    });

    it('should end timing for events when autoTrackEvents is true', () => {
      // Get the Request event end listener
      const requestEndCalls = mockEmitter.on.mock.calls.filter(
        call => call[0] === Event.Request
      );
      const endListener = requestEndCalls[0][1];

      // First initialize tracker with BeforeRequest
      const beforeRequestCalls = mockEmitter.prependListener.mock.calls.filter(
        call => call[0] === Event.BeforeRequest
      );
      const firstStartListener = beforeRequestCalls[0][1];
      firstStartListener(mockEvent);

      // Start the operation
      const requestStartCalls = mockEmitter.prependListener.mock.calls.filter(
        call => call[0] === Event.Request
      );
      const startListener = requestStartCalls[0][1];
      startListener(mockEvent);

      const initialEventCount = mockEvent.context.perf.events.length;

      endListener(mockEvent);

      // Should have added an event with duration metadata
      expect(mockEvent.context.perf.events).toHaveLength(initialEventCount + 1);
      const lastEvent =
        mockEvent.context.perf.events[mockEvent.context.perf.events.length - 1];
      expect(lastEvent.name).toBe(Event.Request);
      expect(lastEvent.metadata).toHaveProperty('duration');
      expect(lastEvent.metadata).toEqual(
        expect.objectContaining({
          hasError: false,
          statusCode: 200,
          duration: expect.any(Number),
        })
      );
    });

    it('should not track events when autoTrackEvents is false', () => {
      // Create a fresh mock emitter for this test
      const freshMockEmitter = {
        prependListener: jest.fn(),
        on: jest.fn(),
      };

      instrumentEmitter(freshMockEmitter, {
        autoTrackEvents: false,
      });

      // Get the Request event start listener
      const requestCalls = freshMockEmitter.prependListener.mock.calls.filter(
        call => call[0] === Event.Request
      );
      const startListener = requestCalls[0][1];

      // First initialize tracker with BeforeRequest
      const beforeRequestCalls =
        freshMockEmitter.prependListener.mock.calls.filter(
          call => call[0] === Event.BeforeRequest
        );
      const firstStartListener = beforeRequestCalls[0][1];
      firstStartListener(mockEvent);

      // Now test other event timing - should initialize tracker but not auto-track
      startListener(mockEvent);

      expect(mockEvent.context.perf).toBeDefined();
      // Should not have added any pending operations for auto-tracking when disabled
      expect(mockEvent.context.perf._pendingOperations.size).toBe(0);
    });

    it('should log report on last event (AfterResponseSend)', () => {
      const afterResponseSendEndCalls = mockEmitter.on.mock.calls.filter(
        call => call[0] === Event.AfterResponseSend
      );
      const endListener = afterResponseSendEndCalls[0][1];

      // Initialize tracker
      const beforeRequestCalls = mockEmitter.prependListener.mock.calls.filter(
        call => call[0] === Event.BeforeRequest
      );
      const firstStartListener = beforeRequestCalls[0][1];
      firstStartListener(mockEvent);

      // Add some events to the tracker so logReport has something to log
      mockEvent.context.perf.track('testEvent');

      endListener(mockEvent);

      // Check that console.log was called (indicating logReport was executed)
      expect(console.log).toHaveBeenCalled();
      // Should have logged the performance timeline header
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Performance Timeline')
      );
    });

    it('should call onComplete callback with report on last event', () => {
      const mockCallback = jest.fn();

      // Create a fresh mock emitter for this test
      const freshMockEmitter = {
        prependListener: jest.fn(),
        on: jest.fn(),
      };

      instrumentEmitter(freshMockEmitter, {
        onComplete: mockCallback,
      });

      const afterResponseSendEndCalls = freshMockEmitter.on.mock.calls.filter(
        call => call[0] === Event.AfterResponseSend
      );
      const endListener = afterResponseSendEndCalls[0][1];

      // Initialize tracker
      const beforeRequestCalls =
        freshMockEmitter.prependListener.mock.calls.filter(
          call => call[0] === Event.BeforeRequest
        );
      const firstStartListener = beforeRequestCalls[0][1];
      firstStartListener(mockEvent);

      endListener(mockEvent);

      expect(mockCallback).toHaveBeenCalledTimes(1);
      const report = mockCallback.mock.calls[0][0];
      expect(report).toHaveProperty('request');
      expect(report.request).toEqual({
        method: 'GET',
        url: '/test',
        statusCode: 200,
        timestamp: expect.any(String),
      });
    });
  });

  describe('configuration options', () => {
    it('should use DEFAULT_OPTIONS when no user options provided', () => {
      // Create a fresh mock emitter for this test
      const freshMockEmitter = {
        prependListener: jest.fn(),
        on: jest.fn(),
      };

      instrumentEmitter(freshMockEmitter);

      const beforeRequestCalls =
        freshMockEmitter.prependListener.mock.calls.filter(
          call => call[0] === Event.BeforeRequest
        );
      const startListener = beforeRequestCalls[0][1];
      startListener(mockEvent);

      expect(mockEvent.context.perf.options.enabled).toBe(
        DEFAULT_OPTIONS.enabled
      );
      expect(mockEvent.context.perf.options.slowThreshold).toBe(
        DEFAULT_OPTIONS.slowThreshold
      );
    });

    it('should use custom logEvent for triggering output', () => {
      const customLogEvent = Event.AfterRequest;

      // Create a fresh mock emitter for this test
      const freshMockEmitter = {
        prependListener: jest.fn(),
        on: jest.fn(),
      };

      instrumentEmitter(freshMockEmitter, { logEvent: customLogEvent });

      const afterRequestEndCalls = freshMockEmitter.on.mock.calls.filter(
        call => call[0] === customLogEvent
      );
      const endListener = afterRequestEndCalls[0][1];

      // Initialize tracker
      const beforeRequestCalls =
        freshMockEmitter.prependListener.mock.calls.filter(
          call => call[0] === Event.BeforeRequest
        );
      const firstStartListener = beforeRequestCalls[0][1];
      firstStartListener(mockEvent);

      // Add some events to the tracker
      mockEvent.context.perf.track('testEvent');

      endListener(mockEvent);

      // Check that console.log was called (indicating logReport was executed)
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Performance Timeline')
      );
    });

    it('should handle null/undefined onComplete callback', () => {
      instrumentEmitter(mockEmitter, { onComplete: null });

      const endListener = mockEmitter.on.mock.calls.find(
        call => call[0] === Event.AfterResponseSend
      )[1];

      // Initialize tracker
      const firstStartListener = mockEmitter.prependListener.mock.calls[0][1];
      firstStartListener(mockEvent);

      // Should not throw
      expect(() => endListener(mockEvent)).not.toThrow();
    });

    it('should handle invalid onComplete callback type', () => {
      instrumentEmitter(mockEmitter, { onComplete: 'not-a-function' });

      const endListener = mockEmitter.on.mock.calls.find(
        call => call[0] === Event.AfterResponseSend
      )[1];

      // Initialize tracker
      const firstStartListener = mockEmitter.prependListener.mock.calls[0][1];
      firstStartListener(mockEvent);

      // Should not throw
      expect(() => endListener(mockEvent)).not.toThrow();
    });
  });
});
