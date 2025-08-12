/* eslint-disable @typescript-eslint/ban-ts-comment */

import { beforeEach, describe, expect, it } from 'vitest';

import { Namespace } from '../Namespace';

describe('namespace', () => {
  let ns: Namespace;
  const path = 'a.b.c.ClassConstructor';
  class ClassConstructor {}

  beforeEach(() => {
    ns = new Namespace();
    ns.namespace(path);
  });

  it('should create defined namespace', () => {
    expect(ns.a.b.c.ClassConstructor).toStrictEqual({});
  });

  it('should return stored value in namespace', () => {
    expect(ns.get(path)).toStrictEqual({});
  });

  it('should return true if namespace exists', () => {
    expect(ns.has(path)).toBeTruthy();
  });

  it('should set value for defined namespace', () => {
    ns.set(path, ClassConstructor);

    expect(ns.a.b.c.ClassConstructor).toStrictEqual(ClassConstructor);
  });

  it('should throw error when creating namespace with wrong path format', () => {
    // @ts-ignore
    expect(() => ns.namespace(false)).toThrow();
    // @ts-ignore
    expect(() => ns.namespace(1)).toThrow();
    // @ts-ignore
    expect(() => ns.namespace(null)).toThrow();
    // @ts-ignore
    expect(() => ns.namespace(undefined)).toThrow();
  });

  it('should throw error when getting wrong path format namespace value', () => {
    // @ts-ignore
    expect(() => ns.get(false)).toThrow();
    // @ts-ignore
    expect(() => ns.get(1)).toThrow();
    // @ts-ignore
    expect(() => ns.get(null)).toThrow();
    // @ts-ignore
    expect(() => ns.get(undefined)).toThrow();
  });

  it('should throw error when setting wrong path format', () => {
    // @ts-ignore
    expect(() => ns.set(false)).toThrow();
    // @ts-ignore
    expect(() => ns.set(1)).toThrow();
    // @ts-ignore
    expect(() => ns.set(null)).toThrow();
    // @ts-ignore
    expect(() => ns.set(undefined)).toThrow();
  });

  it('should return false when calling has wrong path format', () => {
    // @ts-ignore
    expect(() => ns.has(false)).not.toThrow();
    // @ts-ignore
    expect(ns.has(false)).toBeFalsy();

    // @ts-ignore
    expect(() => ns.has(1)).not.toThrow();
    // @ts-ignore
    expect(ns.has(1)).toBeFalsy();

    // @ts-ignore
    expect(() => ns.has(null)).not.toThrow();
    // @ts-ignore
    expect(ns.has(null)).toBeFalsy();

    // @ts-ignore
    expect(() => ns.has(undefined)).not.toThrow();
    // @ts-ignore
    expect(ns.has(undefined)).toBeFalsy();
  });
});
