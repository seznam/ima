function createEvent($name, data) {
  const event = {
    ...data,
    $name,
    $result: undefined,
    $error: null,
    $__stopped__: false
  };

  event.$stopPropagation = () => {
    event.$__stopped__ = true;
  };

  return event;
}

function catchError(emitter, method) {
  return (...rest) => {
    try {
      let result = method(...rest);

      if (result instanceof Promise) {
        result = result
          .catch($error => {
            emitter.emitUnsafe(Event.Error, {
              ...rest,
              $error
            });
          })
          .catch($criticalError => {
            emitter._logger.error($criticalError);
            return {
              ...rest,
              $error: $criticalError,
              $criticalError: $criticalError
            };
          });
      }

      return result;
    } catch ($error) {
      try {
        return emitter.emitUnsafe(Event.Error, {
          ...rest,
          $error
        });
      } catch ($criticalError) {
        emitter._logger.error($criticalError);
        return {
          ...rest,
          $error: $criticalError,
          $criticalError: $criticalError
        };
      }
    }
  };
}

class Emitter {
  constructor({ logger } = {}) {
    this._logger = logger ?? console;

    this._events = new Map();

    this.emit = catchError(this, this.emitUnsafe.bind(this));
  }

  emitUnsafe(eventName, data) {
    const methods = this.listeners(eventName);
    const event = createEvent(eventName, data);
    let promise = null;
    let result = null;

    for (const method of methods) {
      if (promise) {
        promise = promise.then(result => {
          event.$result = result ?? event.$result;
          if (event.$__stopped__) {
            return;
          }

          return method(event);
        });
      }

      if (!promise) {
        if (event.$__stopped__) {
          return;
        }

        result = method(event);
      }

      if (result instanceof Promise && !promise) {
        promise = result;
      } else {
        event.$result = result ?? event.$result;
      }
    }

    if (promise) {
      return promise.then(result => {
        event.$result = result ?? event.$result;

        return event;
      });
    }

    return event;
  }

  listeners(eventName) {
    if (!this._events.has(eventName)) {
      return [];
    }

    return [...this._events.get(eventName)];
  }

  removeAllListeners(eventName) {
    if (!eventName) {
      return Array.from(this._events.keys()).forEach(eventName =>
        this.removeAllListeners(eventName)
      );
    }

    return this.listeners(eventName).forEach(handler =>
      this.off(eventName, handler)
    );
  }

  on(eventName, method) {
    if (!this._events.has(eventName)) {
      this._events.set(eventName, []);
    }

    const methods = this._events.get(eventName);
    methods.push(method);

    return () => {
      this.off(eventName, method);
    };
  }

  once(eventName, method) {
    let removeMethod = this.on(eventName, () => {
      removeMethod();
      return method();
    });
  }

  off(eventName, method) {
    if (this._events.has(eventName)) {
      const methods = this._events.get(eventName);
      const index = methods.indexOf(method);

      methods.splice(index, 1);
    }
  }
}

const Event = {
  Error: 'hooks.error'
};

module.exports = {
  Event,
  createEvent,
  catchError,
  Emitter
};
