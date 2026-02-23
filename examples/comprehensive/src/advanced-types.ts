/**
 * Advanced type expressions: Conditional, Mapped, Template Literal types
 */

// Conditional types (ConditionalType)
export type IsString<T> = T extends string ? true : false;
export type IsNumber<T> = T extends number ? true : false;

export type TypeName<T> = T extends string
  ? 'string'
  : T extends number
    ? 'number'
    : T extends boolean
      ? 'boolean'
      : T extends undefined
        ? 'undefined'
        : T extends Function
          ? 'function'
          : 'object';

// Distributive conditional types
export type ToArray<T> = T extends any ? T[] : never;
export type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;

// infer keyword
export type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
export type Parameters<T> = T extends (...args: infer P) => any ? P : never;
export type ConstructorParameters<T> = T extends new (...args: infer P) => any ? P : never;
export type InstanceType<T> = T extends new (...args: any[]) => infer R ? R : never;

// Nested infer
export type UnpackPromise<T> = T extends Promise<infer U> ? U : T;
export type UnpackArray<T> = T extends (infer U)[] ? U : T;
export type DeepUnpack<T> = T extends Promise<infer U>
  ? DeepUnpack<U>
  : T extends (infer U)[]
    ? DeepUnpack<U>
    : T;

// Mapped types (MappedType)
export type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export type Required<T> = {
  [P in keyof T]-?: T[P];
};

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

export type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

export type Record<K extends keyof any, T> = {
  [P in K]: T;
};

// Mapped types with key remapping
export type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

export type RemovePrefixed<T, Prefix extends string> = {
  [K in keyof T as K extends `${Prefix}${infer Rest}` ? Rest : K]: T[K];
};

// Template literal types (TemplateLiteralType)
export type EmailLocaleIDs = 'welcome_email' | 'email_heading';
export type FooterLocaleIDs = 'footer_title' | 'footer_sendoff';
export type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;

export type PropEventSource<Type> = {
  on<Key extends string & keyof Type>(
    eventName: `${Key}Changed`,
    callback: (newValue: Type[Key]) => void
  ): void;
};

// Template literal with unions
export type HorizontalPosition = 'left' | 'center' | 'right';
export type VerticalPosition = 'top' | 'middle' | 'bottom';
export type Position = `${VerticalPosition}-${HorizontalPosition}`;

// Intrinsic string manipulation types
export type Uppercase<S extends string> = intrinsic;
export type Lowercase<S extends string> = intrinsic;
export type Capitalize<S extends string> = intrinsic;
export type Uncapitalize<S extends string> = intrinsic;

// Using intrinsic types
export type UppercaseGreeting = Uppercase<'hello'>;
export type LowercaseGreeting = Lowercase<'HELLO'>;
export type CapitalizedGreeting = Capitalize<'hello'>;
export type UncapitalizedGreeting = Uncapitalize<'Hello'>;

// Recursive types
export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type DeepReadonly<T> = T extends object
  ? {
      readonly [P in keyof T]: DeepReadonly<T[P]>;
    }
  : T;

// Type assertion (TypeAssertion, AsExpression)
export const value = 'hello' as string;
export const value2 = <string>'hello';
export const value3 = 'hello' as const;
export const value4 = { x: 10, y: 20 } as const;

// Satisfies operator (SatisfiesExpression)
export const config = {
  width: 100,
  height: 200,
} satisfies Record<string, number>;

// Utility types combining multiple features
export type DeepRequired<T> = T extends object
  ? {
      [P in keyof T]-?: DeepRequired<T[P]>;
    }
  : T;

export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type NonNullableProps<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

// Variance annotations (TypeScript 5.0+)
export type ReadonlyBox<out T> = {
  readonly value: T;
};

export type WritableBox<in T> = {
  set(value: T): void;
};

export type Box<in out T> = {
  get(): T;
  set(value: T): void;
};
