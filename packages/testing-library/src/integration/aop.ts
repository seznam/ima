import {
  aop as nativeAop,
  createHook as nativeCreateHook,
  hookName as nativeHookName,
  unAop,
} from 'to-aop';

/**
 * Join points supported by to-aop.
 */
export type HookName =
  | 'beforeMethod'
  | 'afterMethod'
  | 'aroundMethod'
  | 'beforeGetter'
  | 'afterGetter'
  | 'aroundGetter'
  | 'beforeSetter'
  | 'afterSetter'
  | 'aroundSetter';

/**
 * Payload passed to a hook callback when the matched join point is reached.
 */
export interface HookMeta<
  TContext = unknown,
  TArgs extends unknown[] = unknown[],
> {
  target: object;
  object: object;
  property: string;
  context: TContext;
  args: TArgs;
  payload?: unknown;
  original?: (...args: TArgs) => unknown;
  meta: Record<string, unknown>;
}

/**
 * Selects the properties a hook is applied to.
 */
export type HookRule = string | RegExp | ((meta: HookMeta) => boolean);

/**
 * Aspect returned by createHook and accepted by aop.
 */
export type HookPattern = Partial<Record<HookName, unknown>>;

// to-aop ships no typings, so its API is re-declared here to keep the built
// declaration files of this package free of an untyped module import.
export const hookName = nativeHookName as Readonly<Record<HookName, HookName>>;

/**
 * Creates a hook invoked for every property matching the rule.
 */
export function createHook<
  TContext = unknown,
  TArgs extends unknown[] = unknown[],
>(
  name: HookName,
  rule: HookRule,
  callback: (meta: HookMeta<TContext, TArgs>) => unknown
): HookPattern {
  return nativeCreateHook(name, rule, callback);
}

let aopTargetsContainer: object[] = [];

/**
 * Extends default aop (from to-aop) behavior by saving the targets,
 * which can be cleared later with unAopAll function.
 */
export function aop<T extends object>(target: T, pattern: HookPattern): T {
  if (!aopTargetsContainer.includes(target)) {
    aopTargetsContainer.push(target);
  }

  return nativeAop(target, pattern);
}

/**
 * Clears aop hooks from all registered targets and resets the container.
 */
export function unAopAll(): void {
  for (const target of aopTargetsContainer) {
    unAop(target);
  }

  aopTargetsContainer = [];
}
