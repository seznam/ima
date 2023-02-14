const { Metric } = require('@esmj/monitor');

class ConcurrentRequestsMetric extends Metric {
  #instanceRecycler;

  constructor(instanceRecycler) {
    super();

    this.#instanceRecycler = instanceRecycler;
  }
  measure() {
    return {
      concurrentRequests: {
        count: this.#instanceRecycler.getConcurrentRequests(),
        hasNextInstance: this.#instanceRecycler.hasNextInstance(),
      },
    };
  }
}

module.exports = function concurrentRequestsMetricFactory({
  instanceRecycler,
}) {
  return new ConcurrentRequestsMetric(instanceRecycler);
};
