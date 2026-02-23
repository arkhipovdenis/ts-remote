declare module "declarations" {
/**
 * Basic declarations: VariableDeclaration, FunctionDeclaration, ClassDeclaration
 */
const stringConst = "hello";
const numberConst = 42;
const booleanConst = true;
const nullConst: null;
const undefinedConst: undefined;
const typedVariable: string;
const a = 1;
let mutableVar: string;
const immutableVar = "cannot change";
function simpleFunction(): string;
function functionWithParams(a: number, b: string): string;
function functionWithOptionalParams(a: number, b?: string): string;
function functionWithDefaultParams(a: number, b?: string): string;
function functionWithRestParams(...args: number[]): number;
const functionExpression: (x: number) => number;
const namedFunctionExpression: (x: number, y: number) => number;
const arrowFunction: (x: number) => number;
const arrowFunctionWithBlock: (x: number) => number;
const arrowFunctionAsync: (x: number) => Promise<number>;
class SimpleClass {
    value: number;
    constructor(value: number);
}
class ClassWithMethods {
    publicField: boolean;
    constructor(value: number);
    getPrivate(): number;
    static staticMethod(): string;
    static staticField: string;
}
class ClassWithGetterSetter {
    get value(): number;
    set value(v: number);
}
abstract class AbstractClass {
    abstract abstractMethod(): void;
    concreteMethod(): string;
}
class DerivedClass extends AbstractClass {
    abstractMethod(): void;
}
class ParameterProperties {
    publicParam: string;
    readonly readonlyParam: Date;
    constructor(publicParam: string, privateParam: number, protectedParam: boolean, readonlyParam: Date);
}
export { stringConst, numberConst, booleanConst, nullConst, undefinedConst, typedVariable, a, mutableVar, immutableVar, simpleFunction, functionWithParams, functionWithOptionalParams, functionWithDefaultParams, functionWithRestParams, functionExpression, namedFunctionExpression, arrowFunction, arrowFunctionWithBlock, arrowFunctionAsync, SimpleClass, ClassWithMethods, ClassWithGetterSetter, AbstractClass, DerivedClass, ParameterProperties };
}

declare module "types" {
/**
 * Type declarations: InterfaceDeclaration, TypeAliasDeclaration, EnumDeclaration
 */
interface SimpleInterface {
    name: string;
    age: number;
}
interface InterfaceWithOptional {
    required: string;
    optional?: number;
}
interface InterfaceWithReadonly {
    readonly id: string;
    mutable: number;
}
interface InterfaceWithMethods {
    method(): void;
    methodWithParams(a: number, b: string): string;
    methodWithOptional(a: number, b?: string): string;
}
interface InterfaceWithCallSignature {
    (x: number): string;
}
interface InterfaceWithConstructSignature {
    new (x: number): SimpleInterface;
}
interface InterfaceWithIndexSignature {
    [key: string]: number;
}
interface InterfaceWithNumericIndexSignature {
    [index: number]: string;
}
interface ExtendedInterface extends SimpleInterface {
    email: string;
}
interface MultipleExtends extends SimpleInterface, InterfaceWithOptional {
    extra: boolean;
}
type StringAlias = string;
type NumberAlias = number;
type BooleanAlias = boolean;
type UnionType = string | number | boolean;
type IntersectionType = SimpleInterface & InterfaceWithOptional;
type ObjectType = {
    name: string;
    age: number;
};
type FunctionType = (x: number) => string;
type ArrayType = string[];
type TupleType = [string, number, boolean];
type LiteralType = 'a' | 'b' | 'c';
type NumericLiteralType = 1 | 2 | 3;
type NullableType = string | null;
type UndefinableType = string | undefined;
type NullishType = string | null | undefined;
enum NumericEnum {
    First = 0,
    Second = 1,
    Third = 2
}
enum NumericEnumWithValues {
    First = 1,
    Second = 2,
    Third = 3
}
enum StringEnum {
    First = "FIRST",
    Second = "SECOND",
    Third = "THIRD"
}
enum MixedEnum {
    First = 0,
    Second = "SECOND",
    Third = 3
}
const enum ConstEnum {
    First = 0,
    Second = 1,
    Third = 2
}
enum ComputedEnum {
    A = 1,
    B = 2,
    C = 4,
    D = 3
}
namespace MyNamespace {
    interface NestedInterface {
        value: string;
    }
    class NestedClass {
        value: number;
        constructor(value: number);
    }
    function nestedFunction(): string;
    const nestedConst = 42;
}
const myObject: {
    x: number;
    y: string;
};
type TypeOfObject = typeof myObject;
type KeysOfSimpleInterface = keyof SimpleInterface;
type NameType = SimpleInterface['name'];
type NonNullable<T> = T extends null | undefined ? never : T;
type ExtractStrings<T> = T extends string ? T : never;
export { SimpleInterface, InterfaceWithOptional, InterfaceWithReadonly, InterfaceWithMethods, InterfaceWithCallSignature, InterfaceWithConstructSignature, InterfaceWithIndexSignature, InterfaceWithNumericIndexSignature, ExtendedInterface, MultipleExtends, StringAlias, NumberAlias, BooleanAlias, UnionType, IntersectionType, ObjectType, FunctionType, ArrayType, TupleType, LiteralType, NumericLiteralType, NullableType, UndefinableType, NullishType, NumericEnum, NumericEnumWithValues, StringEnum, MixedEnum, ConstEnum, ComputedEnum, MyNamespace, myObject, TypeOfObject, KeysOfSimpleInterface, NameType, NonNullable, ExtractStrings };
}

declare module "advanced-types" {
/**
 * Advanced type expressions: Conditional, Mapped, Template Literal types
 */
type IsString<T> = T extends string ? true : false;
type IsNumber<T> = T extends number ? true : false;
type TypeName<T> = T extends string ? 'string' : T extends number ? 'number' : T extends boolean ? 'boolean' : T extends undefined ? 'undefined' : T extends Function ? 'function' : 'object';
type ToArray<T> = T extends any ? T[] : never;
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type Parameters<T> = T extends (...args: infer P) => any ? P : never;
type ConstructorParameters<T> = T extends new (...args: infer P) => any ? P : never;
type InstanceType<T> = T extends new (...args: any[]) => infer R ? R : never;
type UnpackPromise<T> = T extends Promise<infer U> ? U : T;
type UnpackArray<T> = T extends (infer U)[] ? U : T;
type DeepUnpack<T> = T extends Promise<infer U> ? DeepUnpack<U> : T extends (infer U)[] ? DeepUnpack<U> : T;
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};
type Partial<T> = {
    [P in keyof T]?: T[P];
};
type Required<T> = {
    [P in keyof T]-?: T[P];
};
type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
type Getters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
type RemovePrefixed<T, Prefix extends string> = {
    [K in keyof T as K extends `${Prefix}${infer Rest}` ? Rest : K]: T[K];
};
type EmailLocaleIDs = 'welcome_email' | 'email_heading';
type FooterLocaleIDs = 'footer_title' | 'footer_sendoff';
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
type PropEventSource<Type> = {
    on<Key extends string & keyof Type>(eventName: `${Key}Changed`, callback: (newValue: Type[Key]) => void): void;
};
type HorizontalPosition = 'left' | 'center' | 'right';
type VerticalPosition = 'top' | 'middle' | 'bottom';
type Position = `${VerticalPosition}-${HorizontalPosition}`;
type Uppercase<S extends string> = intrinsic;
type Lowercase<S extends string> = intrinsic;
type Capitalize<S extends string> = intrinsic;
type Uncapitalize<S extends string> = intrinsic;
type UppercaseGreeting = Uppercase<'hello'>;
type LowercaseGreeting = Lowercase<'HELLO'>;
type CapitalizedGreeting = Capitalize<'hello'>;
type UncapitalizedGreeting = Uncapitalize<'Hello'>;
type Json = string | number | boolean | null | Json[] | {
    [key: string]: Json;
};
type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;
type DeepReadonly<T> = T extends object ? {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
} : T;
const value: string;
const value2: string;
const value3: "hello";
const value4: {
    readonly x: 10;
    readonly y: 20;
};
const config: {
    width: number;
    height: number;
};
type DeepRequired<T> = T extends object ? {
    [P in keyof T]-?: DeepRequired<T[P]>;
} : T;
type Nullable<T> = {
    [P in keyof T]: T[P] | null;
};
type NonNullableProps<T> = {
    [P in keyof T]: NonNullable<T[P]>;
};
type ReadonlyBox<out T> = {
    readonly value: T;
};
type WritableBox<in T> = {
    set(value: T): void;
};
type Box<in out T> = {
    get(): T;
    set(value: T): void;
};
export { IsString, IsNumber, TypeName, ToArray, ToArrayNonDist, ReturnType, Parameters, ConstructorParameters, InstanceType, UnpackPromise, UnpackArray, DeepUnpack, Readonly, Partial, Required, Mutable, Pick, Omit, Record, Getters, RemovePrefixed, EmailLocaleIDs, FooterLocaleIDs, AllLocaleIDs, PropEventSource, HorizontalPosition, VerticalPosition, Position, Uppercase, Lowercase, Capitalize, Uncapitalize, UppercaseGreeting, LowercaseGreeting, CapitalizedGreeting, UncapitalizedGreeting, Json, DeepPartial, DeepReadonly, value, value2, value3, value4, config, DeepRequired, Nullable, NonNullableProps, ReadonlyBox, WritableBox, Box };
}

declare module "generics" {
/**
 * Generic types and constraints
 */
function identity<T>(arg: T): T;
function firstElement<T>(arr: T[]): T | undefined;
function map<T, U>(arr: T[], fn: (item: T) => U): U[];
function pair<T, U>(first: T, second: U): [T, U];
function merge<T, U>(obj1: T, obj2: U): T & U;
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K];
function longest<T extends {
    length: number;
}>(a: T, b: T): T;
interface GenericInterface<T> {
    value: T;
    getValue(): T;
    setValue(value: T): void;
}
interface Pair<T, U> {
    first: T;
    second: U;
}
class Container<T> {
    constructor(value: T);
    getValue(): T;
    setValue(value: T): void;
}
class Stack<T> {
    push(item: T): void;
    pop(): T | undefined;
    peek(): T | undefined;
}
function merge2<T extends object, U extends object>(obj1: T, obj2: U): T & U;
function copyFields<T extends U, U extends object>(target: T, source: U): T;
type Nullable<T> = T | null;
type Maybe<T> = T | undefined;
type Optional<T> = T | null | undefined;
type ArrayOrSingle<T> = T | T[];
type PromiseOrValue<T> = T | Promise<T>;
interface Response<T = any> {
    data: T;
    status: number;
    message?: string;
}
function createResponse<T = any>(data: T): Response<T>;
interface Lengthwise {
    length: number;
}
function loggingIdentity<T extends Lengthwise>(arg: T): T;
function getPropertySafe<T, K extends keyof T>(obj: T, key: K): T[K];
function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): void;
interface Constructor<T> {
    new (...args: any[]): T;
}
function create<T>(ctor: Constructor<T>, ...args: any[]): T;
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;
type Flatten<T> = T extends Array<infer U> ? U : T;
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type Head<T extends any[]> = T extends [infer H, ...any[]] ? H : never;
type Tail<T extends any[]> = T extends [any, ...infer T] ? T : never;
type Last<T extends any[]> = T extends [...any[], infer L] ? L : never;
type Concat<T extends any[], U extends any[]> = [...T, ...U];
type Prepend<T extends any[], U> = [U, ...T];
type Append<T extends any[], U> = [...T, U];
type Awaited2<T> = T extends null | undefined ? T : T extends object & {
    then(onfulfilled: infer F): any;
} ? F extends (value: infer V, ...args: any) => any ? Awaited2<V> : never : T;
class GenericClass<T> {
    value: T;
    static staticProperty: string;
    static staticMethod<U>(value: U): U;
    constructor(value: T);
}
abstract class AbstractGeneric<T> {
    abstract process(value: T): T;
    log(value: T): void;
}
class ConcreteGeneric<T> extends AbstractGeneric<T> {
    process(value: T): T;
}
interface Builder<T> {
    set<K extends keyof T>(key: K, value: T[K]): this;
    build(): T;
}
class FluentBuilder<T extends object> implements Builder<T> {
    set<K extends keyof T>(key: K, value: T[K]): this;
    build(): T;
}
export { identity, firstElement, map, pair, merge, getProperty, longest, GenericInterface, Pair, Container, Stack, merge2, copyFields, Nullable, Maybe, Optional, ArrayOrSingle, PromiseOrValue, Response, createResponse, Lengthwise, loggingIdentity, getPropertySafe, setProperty, Constructor, create, Awaited, Flatten, GetReturnType, Head, Tail, Last, Concat, Prepend, Append, Awaited2, GenericClass, AbstractGeneric, ConcreteGeneric, Builder, FluentBuilder };
}

declare module "modifiers" {
/**
 * Modifiers and access control
 */
class ModifiersDemo {
    publicParam: string;
    readonly readonlyParam: Date;
    publicField: string;
    readonly readonlyField = "readonly";
    static publicStatic: string;
    constructor(publicParam: string, privateParam: number, protectedParam: boolean, readonlyParam: Date);
    publicMethod(): string;
    static publicStaticMethod(): string;
}
interface ReadonlyInterface {
    readonly id: string;
    readonly createdAt: Date;
    mutable: string;
}
class ReadonlyClass {
    readonly id: string;
    readonly createdAt: Date;
    constructor(id: string);
}
interface OptionalInterface {
    required: string;
    optional?: number;
    alsoOptional?: boolean;
}
class OptionalClass {
    required: string;
    optional?: number;
    constructor(required: string, optional?: number);
}
abstract class AbstractModifiersDemo {
    abstract abstractMethod(): void;
    abstract abstractProperty: string;
    concreteMethod(): string;
    concreteProperty: string;
}
class ConcreteModifiersDemo extends AbstractModifiersDemo {
    abstractProperty: string;
    abstractMethod(): void;
}
function asyncFunction(): Promise<string>;
function asyncFunctionWithAwait(): Promise<number>;
class AsyncMethods {
    asyncMethod(): Promise<string>;
    asyncMethodWithAwait(): Promise<number>;
}
class StaticDemo {
    static staticField: string;
    static readonly staticReadonly = "static readonly";
    static staticMethod(): string;
    static staticAsyncMethod(): Promise<string>;
}
class CombinedModifiers {
    readonly publicReadonly = "public readonly";
    static readonly publicStaticReadonly = "public static readonly";
    publicAsyncMethod(): Promise<string>;
}
class Base {
    method(): string;
}
class Derived extends Base {
    method(): string;
}
class AccessorDemo {
    get value(): number;
    set value(v: number);
    get readonlyValue(): number;
}
class ParameterPropertyModifiers {
    readonly publicReadonlyParam: string;
    constructor(publicReadonlyParam: string, privateReadonlyParam: number, protectedReadonlyParam: boolean);
}
const exportedConst = "exported";
function exportedFunction(): void;
class ExportedClass {
}
interface ExportedInterface {
}
type ExportedType = string;
enum ExportedEnum {
    A = 0,
    B = 1
}
export { ModifiersDemo, ReadonlyInterface, ReadonlyClass, OptionalInterface, OptionalClass, AbstractModifiersDemo, ConcreteModifiersDemo, asyncFunction, asyncFunctionWithAwait, AsyncMethods, StaticDemo, CombinedModifiers, Base, Derived, AccessorDemo, ParameterPropertyModifiers, exportedConst, exportedFunction, ExportedClass, ExportedInterface, ExportedType, ExportedEnum, default, ModifiersDemo as RenamedExport, SimpleInterface, InterfaceWithOptional, InterfaceWithReadonly, InterfaceWithMethods, InterfaceWithCallSignature, InterfaceWithConstructSignature, InterfaceWithIndexSignature, InterfaceWithNumericIndexSignature, ExtendedInterface, MultipleExtends, StringAlias, NumberAlias, BooleanAlias, UnionType, IntersectionType, ObjectType, FunctionType, ArrayType, TupleType, LiteralType, NumericLiteralType, NullableType, UndefinableType, NullishType, NumericEnum, NumericEnumWithValues, StringEnum, MixedEnum, ConstEnum, ComputedEnum, MyNamespace, myObject, TypeOfObject, KeysOfSimpleInterface, NameType, NonNullable, ExtractStrings };
}

declare module "private-fields-test" {
/**
 * Test case for private field filtering
 * This file validates that both TypeScript and JavaScript private members are correctly filtered
 */
class PrivateFieldsTest {
    publicField: string;
    implicitPublic: string;
    constructor();
    getPrivate(): string;
    publicMethod(): string;
    implicitPublicMethod(): string;
    get jsPrivateValue(): string;
    set jsPrivateValue(value: string);
}
/**
 * Expected output in .d.ts:
 *
 * declare class PrivateFieldsTest {
 *   publicField: string;
 *   implicitPublic: string;
 *   constructor();
 *   getPrivate(): string;
 *   publicMethod(): string;
 *   implicitPublicMethod(): string;
 *   get jsPrivateValue(): string;
 *   set jsPrivateValue(value: string);
 * }
 *
 * Should NOT include:
 * - tsPrivate
 * - tsProtected
 * - #jsPrivate
 * - tsPrivateMethod
 * - tsProtectedMethod
 * - #jsPrivateMethod
 */
export { PrivateFieldsTest };
}
