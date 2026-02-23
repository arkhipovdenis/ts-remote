/**
 * Generic types and constraints
 */

// Generic functions
export function identity<T>(arg: T): T {
  return arg;
}

export function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

export function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

// Multiple type parameters
export function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

export function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

// Generic with constraints
export function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

export function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

// Generic interfaces
export interface GenericInterface<T> {
  value: T;
  getValue(): T;
  setValue(value: T): void;
}

export interface Pair<T, U> {
  first: T;
  second: U;
}

// Generic classes
export class Container<T> {
  constructor(private value: T) {}

  getValue(): T {
    return this.value;
  }

  setValue(value: T): void {
    this.value = value;
  }
}

export class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }
}

// Generic with multiple constraints
export function merge2<T extends object, U extends object>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

export function copyFields<T extends U, U extends object>(target: T, source: U): T {
  for (const key in source) {
    if (key in target) {
      (target as any)[key] = source[key];
    }
  }
  return target;
}

// Generic type aliases
export type Nullable<T> = T | null;
export type Maybe<T> = T | undefined;
export type Optional<T> = T | null | undefined;

export type ArrayOrSingle<T> = T | T[];
export type PromiseOrValue<T> = T | Promise<T>;

// Generic with default type parameters
export interface Response<T = any> {
  data: T;
  status: number;
  message?: string;
}

export function createResponse<T = any>(data: T): Response<T> {
  return {
    data,
    status: 200,
  };
}

// Generic constraints with extends
export interface Lengthwise {
  length: number;
}

export function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// Using type parameters in generic constraints
export function getPropertySafe<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

export function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
  obj[key] = value;
}

// Generic factory pattern
export interface Constructor<T> {
  new (...args: any[]): T;
}

export function create<T>(ctor: Constructor<T>, ...args: any[]): T {
  return new ctor(...args);
}

// Generic with conditional types
export type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;

export type Flatten<T> = T extends Array<infer U> ? U : T;

export type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Generic tuple types
export type Head<T extends any[]> = T extends [infer H, ...any[]] ? H : never;
export type Tail<T extends any[]> = T extends [any, ...infer T] ? T : never;
export type Last<T extends any[]> = T extends [...any[], infer L] ? L : never;

// Generic with variadic tuple types
export type Concat<T extends any[], U extends any[]> = [...T, ...U];
export type Prepend<T extends any[], U> = [U, ...T];
export type Append<T extends any[], U> = [...T, U];

// Generic with recursive types
export type Awaited2<T> = T extends null | undefined
  ? T
  : T extends object & { then(onfulfilled: infer F): any }
    ? F extends (value: infer V, ...args: any) => any
      ? Awaited2<V>
      : never
    : T;

// Generic class with static members
export class GenericClass<T> {
  static staticProperty = 'static';

  static staticMethod<U>(value: U): U {
    return value;
  }

  constructor(public value: T) {}
}

// Generic abstract class
export abstract class AbstractGeneric<T> {
  abstract process(value: T): T;

  log(value: T): void {
    console.log(value);
  }
}

export class ConcreteGeneric<T> extends AbstractGeneric<T> {
  process(value: T): T {
    return value;
  }
}

// Generic with this type
export interface Builder<T> {
  set<K extends keyof T>(key: K, value: T[K]): this;
  build(): T;
}

export class FluentBuilder<T extends object> implements Builder<T> {
  private obj: Partial<T> = {};

  set<K extends keyof T>(key: K, value: T[K]): this {
    this.obj[key] = value;
    return this;
  }

  build(): T {
    return this.obj as T;
  }
}
