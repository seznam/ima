/* eslint-disable no-console */
const { performance } = require('perf_hooks');

const chalk = require('chalk');

/**
 * Default configuration options
 */
const DEFAULT_OPTIONS = {
  enabled: true,
  slowThreshold: 50, // ms
  includeMetadata: true,
  maxEvents: 1000,
  timestampPrecision: 2, // decimal places
  useNativeMarks: false, // Create native performance.mark() entries
  useNativeMeasures: false, // Create native performance.measure() entries
};

/**
 * PerformanceTracker - Context-based performance tracking for IMA.js server
 *
 * This class provides a flexible performance tracking system that can be passed
 * through the event context to track timing throughout the request lifecycle.
 */
class PerformanceTracker {
  /**
   * @param {Object} options - Configuration options
   * @param {boolean} [options.enabled=true] - Enable/disable tracking
   * @param {number} [options.slowThreshold=50] - Threshold in ms for slow events
   * @param {boolean} [options.includeMetadata=true] - Include metadata in reports
   * @param {number} [options.maxEvents=1000] - Maximum number of events to track
   * @param {number} [options.timestampPrecision=2] - Decimal places for timestamps
   * @param {boolean} [options.useNativeMarks=false] - Create native performance.mark() entries
   * @param {boolean} [options.useNativeMeasures=false] - Create native performance.measure() entries
   */
  constructor(options = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.enabled = this.options.enabled;

    if (!this.enabled) {
      return; // Fast bailout for disabled tracker
    }

    this.startTime = performance.now();
    this.events = [];
    this.lastTimestamp = this.startTime;
    this._pendingOperations = new Map(); // Track operations with start/end
    this._markPrefix = `ima-perf-${Date.now()}`; // Unique prefix for marks

    // Create initial mark if using native marks
    if (this.options.useNativeMarks) {
      performance.mark(`${this._markPrefix}-init`);
    }
  }

  /**
   * Track a performance event
   * @param {string} name - Event name
   * @param {Object} [metadata={}] - Optional metadata for the event
   */
  track(name, metadata = {}) {
    if (!this.enabled) {
      return;
    }

    if (this.events.length >= this.options.maxEvents) {
      return;
    }

    const now = performance.now();
    const duration = now - this.startTime;
    const gap = now - this.lastTimestamp;

    // Create native performance mark if enabled
    if (this.options.useNativeMarks) {
      const markName = `${this._markPrefix}-${name}`;
      performance.mark(markName, {
        detail: this.options.includeMetadata ? metadata : undefined,
      });

      // Create native measure from last event if enabled
      if (this.options.useNativeMeasures && this.events.length > 0) {
        const lastMarkName = `${this._markPrefix}-${this.events[this.events.length - 1].name}`;
        try {
          performance.measure(
            `${lastMarkName} -> ${markName}`,
            lastMarkName,
            markName
          );
        } catch (e) {
          // Mark might not exist, skip measure
        }
      }
    }

    this.events.push({
      name,
      timestamp: now,
      duration: parseFloat(duration.toFixed(this.options.timestampPrecision)),
      gap: parseFloat(gap.toFixed(this.options.timestampPrecision)),
      metadata: this.options.includeMetadata ? metadata : null,
    });

    this.lastTimestamp = now;
  }

  /**
   * Get structured performance report
   */
  getReport() {
    if (!this.enabled || this.events.length === 0) {
      return null;
    }

    const totalDuration =
      this.events.length > 0 ? this.events[this.events.length - 1].duration : 0;

    const slowEvents = this.events.filter(event => {
      // Get actual event duration (from start/end) or fall back to gap (from track)
      const eventDuration = event.metadata?.duration || event.gap;
      return eventDuration > this.options.slowThreshold;
    });

    return {
      enabled: this.enabled,
      totalDuration: parseFloat(
        totalDuration.toFixed(this.options.timestampPrecision)
      ),
      eventCount: this.events.length,
      events: this.events,
      slowEvents: slowEvents.map(e => ({
        name: e.name,
        // Use actual event duration from metadata, or fall back to gap
        eventDuration: e.metadata?.duration || e.gap,
        cumulativeDuration: e.duration,
      })),
      thresholds: {
        slow: this.options.slowThreshold,
      },
    };
  }

  /**
   * Log formatted performance report to console
   */
  logReport() {
    if (!this.enabled || this.events.length === 0) {
      return;
    }

    const report = this.getReport();

    // Header
    console.log('\n' + chalk.cyan('━'.repeat(80)));
    console.log(chalk.bold.cyan(`🔍 Performance Timeline`));
    console.log(chalk.cyan('━'.repeat(80)));

    // Summary
    console.log(chalk.bold('Summary:'));
    console.log(
      `  Total Duration: ${this.#formatDuration(report.totalDuration)}`
    );

    console.log(`  Events Tracked: ${chalk.yellow(report.eventCount)}`);

    if (report.slowEvents.length > 0) {
      console.log(`  Slow Events: ${chalk.red(report.slowEvents.length)} ⚠️`);
    }

    // Event timeline showing start/end boundaries
    console.log(
      '\n' +
        chalk.bold('Timeline:') +
        chalk.dim(' (showing event boundaries and nesting)')
    );

    // Build timeline entries with start/end markers
    const timelineEntries = [];
    this.events.forEach(event => {
      const eventDuration = event.metadata?.duration;
      const isImaEvent = event.name.startsWith('ima.server.');

      // Determine if this is a duration event (has metadata.duration from start/end)
      // or an instant event (just track())
      if (eventDuration !== undefined) {
        // Duration event: create start/end pairs
        const isDurationSlow = eventDuration > this.options.slowThreshold;
        const endTime = event.duration;
        const startTime = endTime - eventDuration;

        // Add START entry
        timelineEntries.push({
          timestamp: startTime,
          type: 'start',
          name: event.name,
          isImaEvent,
          metadata: event.metadata,
        });

        // Add END entry
        timelineEntries.push({
          timestamp: endTime,
          type: 'end',
          name: event.name,
          duration: eventDuration,
          isDurationSlow,
          isImaEvent,
        });
      } else {
        // Instant event: single point in time
        timelineEntries.push({
          timestamp: event.duration,
          type: 'instant',
          name: event.name,
          isImaEvent,
          metadata: event.metadata,
        });
      }
    });

    // Calculate column widths
    const maxTimestampLength = Math.max(
      ...timelineEntries.map(
        entry => this.#formatTimestamp(entry.timestamp).length
      )
    );

    // Track active events for indentation
    const activeEvents = [];

    // Print timeline
    timelineEntries.forEach(entry => {
      const timestamp = this.#formatTimestamp(entry.timestamp).padStart(
        maxTimestampLength
      );

      if (entry.type === 'start') {
        // Add to active events stack
        activeEvents.push(entry.name);
        const indent = '  '.repeat(Math.max(0, activeEvents.length - 1));

        // Format event name with special color for IMA events
        const eventName = entry.isImaEvent
          ? chalk.magenta.bold(entry.name)
          : chalk.bold(entry.name);

        const marker = entry.isImaEvent
          ? chalk.magenta('▶')
          : chalk.green('▶');
        console.log(
          `${chalk.cyan(timestamp)} ${chalk.dim('│')} ${marker} ${indent}${eventName}`
        );

        // Show metadata for start events
        if (
          this.options.includeMetadata &&
          entry.metadata &&
          Object.keys(entry.metadata).length > 0
        ) {
          const { duration: _, ...displayMetadata } = entry.metadata;
          if (Object.keys(displayMetadata).length > 0) {
            const metadataStr = JSON.stringify(displayMetadata);
            const timestampCol = ' '.repeat(maxTimestampLength);
            console.log(
              `${timestampCol} ${chalk.dim('│')}   ${indent}${chalk.dim(`└─ ${metadataStr}`)}`
            );
          }
        }
      } else if (entry.type === 'end') {
        // Remove from active events stack
        const stackIndex = activeEvents.indexOf(entry.name);
        if (stackIndex !== -1) {
          activeEvents.splice(stackIndex, 1);
        }

        const indent = '  '.repeat(Math.max(0, activeEvents.length));

        // Format event name and duration
        const eventName = entry.isImaEvent
          ? chalk.magenta(entry.name)
          : entry.name;

        const durationColored = this.#formatDuration(
          entry.duration,
          entry.isDurationSlow
        );

        const marker = entry.isImaEvent
          ? chalk.magenta('◼')
          : chalk.blue('◼');
        let line = `${chalk.cyan(timestamp)} ${chalk.dim('│')} ${marker} ${indent}${eventName} ${chalk.dim('→')} ${durationColored}`;

        if (entry.isDurationSlow) {
          line += ' ⚠️';
        }

        console.log(line);
      } else {
        // Instant event - single point in time
        const indent = '  '.repeat(Math.max(0, activeEvents.length));

        const eventName = entry.isImaEvent
          ? chalk.magenta(entry.name)
          : entry.name;

        const marker = chalk.gray('◆');
        console.log(
          `${chalk.cyan(timestamp)} ${chalk.dim('│')} ${marker} ${indent}${eventName}`
        );

        // Show metadata for instant events
        if (
          this.options.includeMetadata &&
          entry.metadata &&
          Object.keys(entry.metadata).length > 0
        ) {
          const metadataStr = JSON.stringify(entry.metadata);
          const timestampCol = ' '.repeat(maxTimestampLength);
          console.log(
            `${timestampCol} ${chalk.dim('│')}   ${indent}${chalk.dim(`└─ ${metadataStr}`)}`
          );
        }
      }
    });

    // Footer
    console.log(chalk.cyan('━'.repeat(80)) + '\n');

    // Warnings for slow events
    if (report.slowEvents.length > 0) {
      console.log(chalk.yellow.bold('⚠️  Slow Operations Detected:'));
      report.slowEvents.forEach(event => {
        console.log(
          chalk.yellow(
            `  • ${event.name}: took ${event.eventDuration.toFixed(2)}ms`
          )
        );
      });
      console.log();
    }
  }

  /**
   * Start timing an operation
   * @param {string} name - Operation name
   * @param {Object} [metadata={}] - Optional metadata for the start event
   */
  start(name, metadata = {}) {
    if (!this.enabled) {
      return;
    }

    const startTime = performance.now();

    this._pendingOperations.set(name, {
      startTime,
      startMetadata: metadata,
    });
  }

  /**
   * End timing an operation and track the duration
   * @param {string} name - Operation name (must match start() call)
   * @param {Object} [metadata={}] - Optional metadata for the end event
   * @returns {number|null} Duration in ms, or null if no matching start
   */
  end(name, metadata = {}) {
    if (!this.enabled) {
      return null;
    }

    const pending = this._pendingOperations.get(name);

    if (!pending) {
      // No matching start() call - just track as regular event
      this.track(`${name}.end`, { ...metadata, warning: 'no-matching-start' });
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - pending.startTime;

    // Merge start and end metadata
    const combinedMetadata = {
      ...pending.startMetadata,
      ...metadata,
      duration: parseFloat(duration.toFixed(this.options.timestampPrecision)),
    };

    // Track the end event with duration info
    this.track(`${name}`, combinedMetadata);

    // Clean up
    this._pendingOperations.delete(name);

    return duration;
  }

  /**
   * Measure the duration of a synchronous or async function
   * @param {string} name - Operation name
   * @param {Function} fn - Function to measure
   * @param {Object} [metadata={}] - Optional metadata
   * @returns {*} Result of the function
   */
  measure(name, fn, metadata = {}) {
    if (!this.enabled) {
      return fn();
    }

    this.start(name, metadata);

    try {
      // Handle promises (async functions)
      if (fn && typeof fn.then === 'function') {
        return fn
          .then(value => {
            this.end(name, { success: true });
            return value;
          })
          .catch(error => {
            this.end(name, {
              success: false,
              error: error.message,
            });

            throw error;
          });
      }

      const result = fn();

      // Synchronous function completed successfully
      this.end(name, { success: true });

      return result;
    } catch (error) {
      // Synchronous function threw
      this.end(name, {
        success: false,
        error: error.message,
      });

      throw error;
    }
  }

  /**
   * Wrap a function to automatically track its performance on each call
   * Returns a new function that tracks start/end automatically
   *
   * This provides rich tracking with metadata, memory usage, and timeline integration.
   * Each call creates a .start and .end event in the timeline.
   *
   * @param {string} name - Operation name for tracking
   * @param {Function} fn - Function to wrap
   * @param {Object} [metadata={}] - Optional static metadata (included in every call)
   * @returns {Function} Wrapped function that tracks performance
   *
   * @example
   * const trackedFn = tracker.wrap('myOperation', originalFunction);
   * trackedFn(); // Automatically tracked as myOperation.start -> myOperation.end
   *
   * @example
   * // With metadata
   * const trackedFn = tracker.wrap('dbQuery', queryFn, { category: 'database' });
   *
   * @example
   * class MyClass {
   *   constructor(tracker) {
   *     this.heavyComputation = tracker.wrap('heavyComputation', this.heavyComputation.bind(this));
   *   }
   *   heavyComputation() { ... }
   * }
   */
  wrap(name, fn, metadata = {}) {
    if (!this.enabled) {
      return fn; // Return original function when disabled
    }

    let callCount = 0;

    // Return wrapped function that handles both sync and async
    return (...args) => {
      callCount++;
      const callMetadata = { ...metadata, callCount };

      this.start(name, callMetadata);

      try {
        const result = fn.apply(this, args);

        // Handle promises (async functions)
        if (result && typeof result.then === 'function') {
          return result
            .then(value => {
              this.end(name, { success: true });
              return value;
            })
            .catch(error => {
              this.end(name, {
                success: false,
                error: error.message,
              });
              throw error;
            });
        }

        // Synchronous function completed successfully
        this.end(name, { success: true });

        return result;
      } catch (error) {
        // Synchronous function threw
        this.end(name, {
          success: false,
          error: error.message,
        });

        throw error;
      }
    };
  }

  /**
   * Get all native performance entries (marks and measures)
   * Useful for querying marks/measures created by the tracker or manually
   *
   * @param {string} [type] - Optional type filter ('mark', 'measure')
   * @returns {Array} Array of PerformanceEntry objects
   *
   * @example
   * const marks = tracker.getNativeEntries('mark');
   * const measures = tracker.getNativeEntries('measure');
   * const all = tracker.getNativeEntries(); // All entries
   */
  getNativeEntries(type = null) {
    if (!this.enabled) {
      return [];
    }

    if (type) {
      return performance.getEntriesByType(type);
    }

    return performance.getEntries();
  }

  /**
   * Clear all native performance entries (marks and measures)
   */
  clearNativeEntries() {
    if (!this.enabled) {
      return;
    }

    performance.clearMarks();
    performance.clearMeasures();
  }

  /**
   * Clear all tracked events (useful for recycling tracker instances)
   * @param {boolean} [clearNative=false] - Also clear native performance marks/measures
   */
  clear(clearNative = false) {
    if (!this.enabled) {
      return;
    }

    this.events = [];
    this.startTime = performance.now();
    this.lastTimestamp = this.startTime;
    this._pendingOperations.clear();

    // Optionally clear native marks/measures
    if (clearNative) {
      this.clearNativeEntries();
    }

    // Recreate initial mark if using native marks
    if (this.options.useNativeMarks) {
      this._markPrefix = `ima-perf-${Date.now()}`;
      performance.mark(`${this._markPrefix}-start`);
    }
  }

  /**
   * Get summary statistics
   */
  getSummary() {
    if (!this.enabled || this.events.length === 0) {
      return null;
    }

    const durations = this.events.map(e => e.gap);
    const totalDuration = this.events[this.events.length - 1]?.duration || 0;

    return {
      totalDuration,
      eventCount: this.events.length,
      averageGap: durations.reduce((a, b) => a + b, 0) / durations.length,
      maxGap: Math.max(...durations),
      minGap: Math.min(...durations),
      slowEventCount: this.events.filter(
        e => e.gap > this.options.slowThreshold
      ).length,
    };
  }

  /**
   * Format duration with color coding
   */
  #formatDuration(ms, isSlow = false) {
    const formatted = `${ms.toFixed(this.options.timestampPrecision)}ms`;

    if (isSlow || ms > this.options.slowThreshold) {
      return chalk.red(formatted);
    } else if (ms > this.options.slowThreshold / 2) {
      return chalk.yellow(formatted);
    } else {
      return chalk.green(formatted);
    }
  }

  /**
   * Format timestamp as ss:mmm.nn (seconds:milliseconds.decimals)
   * Examples: "00:005.12", "01:234.56", "12:345.67"
   */
  #formatTimestamp(ms) {
    const seconds = Math.floor(ms / 1000);
    const remainingMs = ms % 1000;
    const milliseconds = Math.floor(remainingMs);
    const decimals = Math.floor((remainingMs - milliseconds) * 100);

    const ss = String(seconds).padStart(2, '0');
    const mmm = String(milliseconds).padStart(3, '0');
    const nn = String(decimals).padStart(2, '0');

    return `${ss}:${mmm}.${nn}`;
  }
}

module.exports = {
  PerformanceTracker,
  DEFAULT_OPTIONS,
};
