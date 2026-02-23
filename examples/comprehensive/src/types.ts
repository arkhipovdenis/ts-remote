/**
 * Type declarations: InterfaceDeclaration, TypeAliasDeclaration, EnumDeclaration
 */

// InterfaceDeclaration
export interface SimpleInterface {
  name: string;
  age: number;
}

export interface InterfaceWithOptional {
  required: string;
  optional?: number;
}

export interface InterfaceWithReadonly {
  readonly id: string;
  mutable: number;
}

export interface InterfaceWithMethods {
  method(): void;
  methodWithParams(a: number, b: string): string;
  methodWithOptional(a: number, b?: string): string;
}

export interface InterfaceWithCallSignature {
  (x: number): string;
}

export interface InterfaceWithConstructSignature {
  new (x: number): SimpleInterface;
}

export interface InterfaceWithIndexSignature {
  [key: string]: number;
}

export interface InterfaceWithNumericIndexSignature {
  [index: number]: string;
}

// Interface extension
export interface ExtendedInterface extends SimpleInterface {
  email: string;
}

export interface MultipleExtends extends SimpleInterface, InterfaceWithOptional {
  extra: boolean;
}

// TypeAliasDeclaration
export type StringAlias = string;
export type NumberAlias = number;
export type BooleanAlias = boolean;

export type UnionType = string | number | boolean;
export type IntersectionType = SimpleInterface & InterfaceWithOptional;

export type ObjectType = {
  name: string;
  age: number;
};

export type FunctionType = (x: number) => string;

export type ArrayType = string[];
export type TupleType = [string, number, boolean];

export type LiteralType = 'a' | 'b' | 'c';
export type NumericLiteralType = 1 | 2 | 3;

export type NullableType = string | null;
export type UndefinableType = string | undefined;
export type NullishType = string | null | undefined;

// EnumDeclaration
export enum NumericEnum {
  First,
  Second,
  Third,
}

export enum NumericEnumWithValues {
  First = 1,
  Second = 2,
  Third = 3,
}

export enum StringEnum {
  First = 'FIRST',
  Second = 'SECOND',
  Third = 'THIRD',
}

export enum MixedEnum {
  First = 0,
  Second = 'SECOND',
  Third = 3,
}

export const enum ConstEnum {
  First,
  Second,
  Third,
}

// Computed enum members
export enum ComputedEnum {
  A = 1 << 0,
  B = 1 << 1,
  C = 1 << 2,
  D = A | B,
}

// Namespace (legacy module syntax)
export namespace MyNamespace {
  export interface NestedInterface {
    value: string;
  }

  export class NestedClass {
    constructor(public value: number) {}
  }

  export function nestedFunction(): string {
    return 'nested';
  }

  export const nestedConst = 42;
}

// Type with typeof
export const myObject = {
  x: 10,
  y: 'hello',
};

export type TypeOfObject = typeof myObject;

// Type with keyof
export type KeysOfSimpleInterface = keyof SimpleInterface;

// Index access type
export type NameType = SimpleInterface['name'];

// Type guards
export type NonNullable<T> = T extends null | undefined ? never : T;
export type ExtractStrings<T> = T extends string ? T : never;
