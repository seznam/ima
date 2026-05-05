import { aop as nativeAop, hookName, createHook, unAop } from 'to-aop';

export { hookName, createHook };

let aopTargetsContainer: object[] = [];

/**
 * Extends default aop (from to-aop) behavior by saving the targets,
 * which can be cleared later with unAopAll function.
 */
export function aop(
  target: object,
  ...args: unknown[]
): ReturnType<typeof nativeAop> {
  if (!aopTargetsContainer.includes(target)) {
    aopTargetsContainer.push(target);
  }

  return nativeAop(target, ...args);
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
