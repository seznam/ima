import { HMROptions } from './utils';

export type Icon = 'check' | 'cross' | 'warn' | 'update' | false;

export const INFO_LEVELS = ['info', 'log'];

export class Logger {
  #options: HMROptions;

  constructor(options: HMROptions) {
    this.#options = options;
  }

  #log(icon: Icon, level: keyof Console, ...data: any[]) {
    // Skip if logging disable
    if (this.#options.noInfo && INFO_LEVELS.includes(level)) {
      return;
    }

    const iconStr = this.#getIcon(icon);
    const logArgs = [
      '%cHMR' + (iconStr ? `%c${iconStr.char}` : ''),
      `background: #f03e3e; color: black; padding: 2px 4px; margin: 2px 0; font-weight: bold; font-size: 80%; border-radius: 3px; ${
        iconStr ? 'margin-right: 4px' : ''
      }`,
      iconStr &&
        `background: ${iconStr.color}; color: black; padding: 2px 4px; margin: 2px 0; font-weight: bold; font-size: 80%; border-radius: 3px;`,
      ...data,
    ].filter(Boolean);

    // @ts-expect-error wrong types
    console[level](...logArgs);
  }

  #getIcon(icon: Icon): { char: string; color: string } | null {
    switch (icon) {
      case 'check':
        return { char: '✔', color: '#22c55e' };

      case 'cross':
        return { char: '✕', color: '#f03e3e' };

      case 'warn':
        return { char: '▲', color: '#eab308' };

      case 'update':
        return { char: '●', color: '#7c3aed' };

      default:
        return null;
    }
  }

  info(icon: Icon, ...data: any[]) {
    this.#log(icon, 'info', ...data);
  }

  error(icon: Icon, ...data: any[]) {
    this.#log(icon, 'error', ...data);
  }

  warn(icon: Icon, ...data: any[]) {
    this.#log(icon, 'warn', ...data);
  }

  group(icon: Icon, ...data: any[]) {
    this.#log(icon, 'group', ...data);
  }
}
