/* eslint-disable no-console */
const { performance } = require('perf_hooks');

const chalk = require('chalk');

/**
 * Default configuration options
 */
const DEFAULT_OPTIONS = {
  enabled: true,
  slowThreshold: 50, // ms
  memoryThreshold: 10, // MB
  trackMemory: true,
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
 * through the event context to track timing and memory usage throughout the
 * request lifecycle.
 */
class PerformanceTracker {
  /**
   * @param {Object} options - Configuration options
   * @param {boolean} [options.enabled=true] - Enable/disable tracking
   * @param {number} [options.slowThreshold=50] - Threshold in ms for slow events
   * @param {number} [options.memoryThreshold=10] - Threshold in MB for memory spikes
   * @param {boolean} [options.trackMemory=true] - Track memory usage
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
    this.startMemory = this.options.trackMemory ? process.memoryUsage() : null;
    this.events = [];
    this.lastTimestamp = this.startTime;
    this.lastMemory = this.startMemory;
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

    let memoryData = null;

    if (this.options.trackMemory && this.startMemory) {
      const currentMemory = process.memoryUsage();

      memoryData = {
        heapUsed: this.#bytesToMB(
          currentMemory.heapUsed - this.startMemory.heapUsed
        ),
        heapDelta: this.#bytesToMB(
          currentMemory.heapUsed -
            (this.lastMemory?.heapUsed || this.startMemory.heapUsed)
        ),
        external: this.#bytesToMB(currentMemory.external),
        rss: this.#bytesToMB(currentMemory.rss),
      };

      this.lastMemory = currentMemory;
    }

    this.events.push({
      name,
      timestamp: now,
      duration: parseFloat(duration.toFixed(this.options.timestampPrecision)),
      gap: parseFloat(gap.toFixed(this.options.timestampPrecision)),
      metadata: this.options.includeMetadata ? metadata : null,
      memory: memoryData,
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
    const totalMemoryDelta =
      this.options.trackMemory && this.events.length > 0
        ? this.events[this.events.length - 1].memory?.heapUsed || 0
        : 0;

    const slowEvents = this.events.filter(
      event =>
        event.duration > this.options.slowThreshold ||
        event.gap > this.options.slowThreshold
    );

    const memorySpikes = this.options.trackMemory
      ? this.events.filter(
          event =>
            event.memory &&
            Math.abs(event.memory.heapDelta) > this.options.memoryThreshold
        )
      : [];

    return {
      enabled: this.enabled,
      totalDuration: parseFloat(
        totalDuration.toFixed(this.options.timestampPrecision)
      ),
      totalMemoryDelta: parseFloat(
        totalMemoryDelta.toFixed(this.options.timestampPrecision)
      ),
      eventCount: this.events.length,
      events: this.events,
      slowEvents: slowEvents.map(e => ({
        name: e.name,
        duration: e.duration,
        gap: e.gap,
      })),
      memorySpikes: memorySpikes.map(e => ({
        name: e.name,
        heapDelta: e.memory.heapDelta,
      })),
      thresholds: {
        slow: this.options.slowThreshold,
        memory: this.options.memoryThreshold,
      },
    };
  }

  /**
   * Log formatted performance report to console
   * @param {Object} [requestInfo={}] - Optional request information for the header
   */
  logReport(requestInfo = {}) {
    if (!this.enabled || this.events.length === 0) {
      return;
    }

    const report = this.getReport();
    const { method = 'UNKNOWN', url = 'unknown' } = requestInfo;

    // Header
    console.log('\n' + chalk.cyan('━'.repeat(80)));
    console.log(chalk.bold.cyan(`🔍 Performance Timeline (${method} ${url})`));
    console.log(chalk.cyan('━'.repeat(80)));

    // Summary
    console.log(chalk.bold('Summary:'));
    console.log(
      `  Total Duration: ${this.#formatDuration(report.totalDuration)}`
    );

    if (this.options.trackMemory) {
      console.log(
        `  Total Memory Delta: ${this.#formatMemory(report.totalMemoryDelta)}`
      );
    }

    console.log(`  Events Tracked: ${chalk.yellow(report.eventCount)}`);

    if (report.slowEvents.length > 0) {
      console.log(`  Slow Events: ${chalk.red(report.slowEvents.length)} ⚠️`);
    }

    if (report.memorySpikes.length > 0) {
      console.log(
        `  Memory Spikes: ${chalk.red(report.memorySpikes.length)} 💾`
      );
    }

    // Event timeline (showing operation duration, not cumulative)
    console.log(
      '\n' +
        chalk.bold('Timeline:') +
        chalk.dim(' (showing time each operation took)')
    );

    this.events.forEach((event, index) => {
      const isLast = index === this.events.length - 1;
      const prefix = isLast ? '└─' : '├─';
      const isSlow = event.gap > this.options.slowThreshold;
      const hasMemorySpike =
        event.memory &&
        Math.abs(event.memory.heapDelta) > this.options.memoryThreshold;

      // Show gap (actual operation time) as the primary metric
      let line = `${prefix} ${chalk.bold(event.name)}: `;
      line += `${this.#formatDuration(event.gap, isSlow)}`;

      // Show cumulative time as secondary info in gray
      line += chalk.dim(
        ` [@${event.duration.toFixed(this.options.timestampPrecision)}ms]`
      );

      if (this.options.trackMemory && event.memory) {
        const heapDelta = event.memory.heapDelta;
        line += ` ${this.#formatMemory(heapDelta, hasMemorySpike)}`;

        if (hasMemorySpike) {
          line += ' 💾';
        }
      }

      if (isSlow) {
        line += ' ⚠️';
      }

      console.log(line);

      // Metadata (if present and enabled)
      if (
        this.options.includeMetadata &&
        event.metadata &&
        Object.keys(event.metadata).length > 0
      ) {
        const metadataStr = JSON.stringify(event.metadata);
        const indent = isLast ? '   ' : '│  ';
        console.log(indent + chalk.dim(`[${metadataStr}]`));
      }
    });

    // Footer
    console.log(chalk.cyan('━'.repeat(80)) + '\n');

    // Warnings for slow events
    if (report.slowEvents.length > 0) {
      console.log(chalk.yellow.bold('⚠️  Slow Operations Detected:'));
      report.slowEvents.forEach(event => {
        console.log(
          chalk.yellow(`  • ${event.name}: took ${event.gap.toFixed(2)}ms`)
        );
      });
      console.log();
    }

    // Warnings for memory spikes
    if (report.memorySpikes.length > 0) {
      console.log(chalk.yellow.bold('💾 Memory Spikes Detected:'));
      report.memorySpikes.forEach(event => {
        const delta =
          event.heapDelta > 0 ? `+${event.heapDelta}` : event.heapDelta;
        console.log(chalk.yellow(`  • ${event.name}: ${delta}MB`));
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
    const startMemory = this.options.trackMemory ? process.memoryUsage() : null;

    this._pendingOperations.set(name, {
      startTime,
      startMemory,
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
  async measure(name, fn, metadata = {}) {
    if (!this.enabled) {
      return await fn();
    }

    this.start(name, metadata);

    try {
      const result = await fn();
      this.end(name, { success: true });
      return result;
    } catch (error) {
      this.end(name, { success: false, error: error.message });
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

    const tracker = this;
    let callCount = 0;

    // Return wrapped function that handles both sync and async
    return function wrapped(...args) {
      callCount++;
      const callMetadata = { ...metadata, callCount };

      tracker.start(name, callMetadata);

      try {
        const result = fn.apply(this, args);

        // Handle promises (async functions)
        if (result && typeof result.then === 'function') {
          return result
            .then(value => {
              tracker.end(name, { success: true });
              return value;
            })
            .catch(error => {
              tracker.end(name, {
                success: false,
                error: error.message,
              });
              throw error;
            });
        }

        // Synchronous function completed successfully
        tracker.end(name, { success: true });

        return result;
      } catch (error) {
        // Synchronous function threw
        tracker.end(name, {
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

    if (this.options.trackMemory) {
      this.startMemory = process.memoryUsage();
      this.lastMemory = this.startMemory;
    }

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
   * Convert bytes to megabytes
   */
  #bytesToMB(bytes) {
    return bytes / 1024 / 1024;
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
   * Format memory with color coding
   */
  #formatMemory(mb, isSpike = false) {
    const sign = mb > 0 ? '+' : '';
    const formatted = `${sign}${mb.toFixed(2)}MB`;

    if (isSpike || Math.abs(mb) > this.options.memoryThreshold) {
      return chalk.red(formatted);
    } else if (Math.abs(mb) > this.options.memoryThreshold / 2) {
      return chalk.yellow(formatted);
    } else if (mb > 0) {
      return chalk.cyan(formatted);
    } else {
      return chalk.gray(formatted);
    }
  }
}

module.exports = {
  PerformanceTracker,
  DEFAULT_OPTIONS,
};
