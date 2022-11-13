import { HMROptions } from './utils';

export const INFO_LEVELS = ['info', 'log'];

export class Logger {
  #options: HMROptions;

  constructor(options: HMROptions) {
    this.#options = options;
  }

  #log(level: keyof Console, ...data: any[]) {
    // Skip if logging disable
    if (this.#options.noInfo && INFO_LEVELS.includes(level)) {
      return;
    }

    console[level](
      '%cHMR',
      'background: #f03e3e; color: black; padding: 2px 4px; margin: 2px 0; font-weight: bold; font-size: 80%; border-radius: 3px;',
      // @ts-expect-error wrong type
      ...data
    );
  }

  info(...data: any[]) {
    this.#log('info', ...data);
  }

  error(...data: any[]) {
    this.#log('error', ...data);
  }

  warn(...data: any[]) {
    this.#log('warn', ...data);
  }

  group(...data: any[]) {
    this.#log('group', ...data);
  }
}
