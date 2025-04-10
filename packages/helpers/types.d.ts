export function allPromiseHash(hash: {
  [key: string]: any | Promise<any>;
}): Promise<any>;

export function clone<T>(
  val: T,
  circular?: boolean,
  depth?: number,
  prototype?: any,
  includeNonEnumerable?: boolean
): T;

export function deepFreeze(object: any);
export function assignRecursively(target, ...sources);
export function assignRecursivelyWithTracking(referrer);
export function resolveEnvironmentSetting(setting, currentEnv: string);
export function escapeRegExp(string: string): string;
export function assignTransformation(callbackFunction: (value) => [...value]);
