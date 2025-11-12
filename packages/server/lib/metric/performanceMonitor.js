const { Event } = require('../emitter');
const { PerformanceTracker } = require('./PerformanceTracker');

/**
 * Default IMA server events to track
 */
const DEFAULT_IMA_EVENTS = Object.values(Event);

/**
 * Default configuration options
 */
const DEFAULT_OPTIONS = {
  enabled: true,
  samplingRate: 1.0, // 1.0 = 100%, 0.01 = 1%

  // Output configuration
  logToConsole: true, // Log timeline to console
  logEvent: Event.AfterResponseSend, // Event that triggers console output

  // PerformanceTracker options
  slowThreshold: 50, // ms
  includeMetadata: true,
  useNativeMarks: false, // Use native performance marks
  useNativeMeasures: false,

  // Auto-tracking
  autoTrackEvents: true, // Automatically track all configured events

  // Callbacks
  onComplete: null, // Callback(report) when tracking completes
};

const START_EVENT = Event.BeforeRequest;
const END_EVENT = Event.AfterResponseSend;

/**
 * Instrument emitter with timing tracking
 *
 * Injects PerformanceTracker into event.context.perf on the first event,
 * making it available throughout the request lifecycle.
 *
 * @param {Object} emitter - Event emitter instance
 * @param {Object} userOptions - Configuration options
 * @returns {Object} Instrumented emitter
 *
 * @example
 * const emitter = new Emitter();
 * instrumentEmitter(emitter, {
 *   enabled: true,
 *   logToConsole: true,
 *   slowThreshold: 50,
 *   onComplete: (report) => {
 *     sendToDatadog(report);
 *   }
 * });
 *
 * @example
 * // Access tracker in your event handlers
 * emitter.listen('ima.server.request', (event) => {
 *   // Tracker is available in context
 *   event.context.perf.track('customEvent', { foo: 'bar' });
 * });
 */
function instrumentEmitter(emitter, userOptions = {}) {
  const options = { ...DEFAULT_OPTIONS, ...userOptions };

  if (!options.enabled) {
    return emitter;
  }

  // Apply sampling rate
  if (options.samplingRate < 1.0 && Math.random() > options.samplingRate) {
    return emitter; // Skip this request based on sampling
  }

  // Add tracking listeners to each event
  DEFAULT_IMA_EVENTS.forEach(eventName => {
    const isFirstEvent = eventName === START_EVENT;
    const isLastEvent = eventName === (options.logEvent || END_EVENT);

    // Start listener - runs BEFORE all event handlers
    const startListener = function PerformanceTrackerStartListener(event) {
      // Initialize context if needed
      if (!event.context) {
        event.context = {};
      }

      // First event: Create PerformanceTracker
      if (isFirstEvent) {
        event.context.perf = new PerformanceTracker({
          enabled: options.enabled,
          slowThreshold: options.slowThreshold,
          includeMetadata: options.includeMetadata,
          useNativeMarks: options.useNativeMarks,
          useNativeMeasures: options.useNativeMeasures,
        });

        // Track request start as a point-in-time event
        if (options.autoTrackEvents) {
          event.context.perf.track('request.received', {
            method: event.req?.method,
            url: event.req?.url,
            headers: event.req?.headers
              ? Object.keys(event.req.headers).length
              : 0,
          });
        }
      }

      // Start timing this event's handlers
      if (options.autoTrackEvents && event.context.perf) {
        event.context.perf.start(eventName);
      }
    };

    // End listener - runs AFTER all event handlers
    const endListener = function PerformanceTrackerEndListener(event) {
      if (!options.autoTrackEvents || !event.context?.perf) {
        return;
      }

      // End timing this event's handlers
      event.context.perf.end(eventName, {
        hasError: !!event.error,
        statusCode: event.res?.statusCode,
      });

      // Last event: Log report and call completion callback
      if (isLastEvent) {
        // Log to console
        if (options.logToConsole) {
          event.context.perf.logReport();
        }

        // Call completion callback with report
        if (options.onComplete && typeof options.onComplete === 'function') {
          const report = event.context.perf.getReport();

          if (report) {
            // Add request context to report
            report.request = {
              method: event.req?.method,
              url: event.req?.url,
              statusCode: event.res?.statusCode,
              timestamp: new Date().toISOString(),
            };

            options.onComplete(report);
          }
        }
      }
    };

    // Append and prepend start/end listeners to the emitter
    emitter.prependListener(eventName, startListener);
    emitter.on(eventName, endListener);
  });

  return emitter;
}

module.exports = {
  instrumentEmitter,
  PerformanceTracker,
  DEFAULT_OPTIONS,
  DEFAULT_IMA_EVENTS,
};
