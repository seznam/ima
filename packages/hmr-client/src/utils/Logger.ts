export class Logger {
  #log(level: 'log' | 'info' | 'warn' | 'error' | 'group', ...data: any) {
    console[level](
      '%cHMR',
      'background: #f03e3e; color: black; padding: 2px 4px; margin: 2px 0; font-weight: bold; font-size: 80%; border-radius: 3px;',
      ...data
    );
  }

  info(...data: any) {
    this.#log('info', ...data);
  }

  error(...data: any) {
    this.#log('error', ...data);
  }

  warn(...data: any) {
    this.#log('warn', ...data);
  }

  group(...data: any) {
    this.#log('group', ...data);
  }
}

const logger = new Logger();

export { logger };
