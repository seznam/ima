class Deferred<T> {
  readonly promise: Promise<T>;
  // @ts-expect-error I don't even know anymore...
  resolve: (value?: T | PromiseLike<T>) => void;
  // @ts-expect-error I don't even know anymore...
  reject: (reason?: any) => void;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      // @ts-expect-error I don't even know anymore...
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

export { Deferred };
