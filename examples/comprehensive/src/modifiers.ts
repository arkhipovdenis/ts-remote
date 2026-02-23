/**
 * Modifiers and access control
 */

// Access modifiers: public, private, protected
export class ModifiersDemo {
  public publicField = 'public';
  private privateField = 'private';
  protected protectedField = 'protected';
  readonly readonlyField = 'readonly';

  public static publicStatic = 'public static';
  private static privateStatic = 'private static';
  protected static protectedStatic = 'protected static';

  constructor(
    public publicParam: string,
    private privateParam: number,
    protected protectedParam: boolean,
    readonly readonlyParam: Date
  ) {}

  public publicMethod(): string {
    return this.publicField;
  }

  private privateMethod(): string {
    return this.privateField;
  }

  protected protectedMethod(): string {
    return this.protectedField;
  }

  public static publicStaticMethod(): string {
    return ModifiersDemo.publicStatic;
  }

  private static privateStaticMethod(): string {
    return ModifiersDemo.privateStatic;
  }

  protected static protectedStaticMethod(): string {
    return ModifiersDemo.protectedStatic;
  }
}

// Readonly modifier
export interface ReadonlyInterface {
  readonly id: string;
  readonly createdAt: Date;
  mutable: string;
}

export class ReadonlyClass {
  readonly id: string;
  readonly createdAt: Date;

  constructor(id: string) {
    this.id = id;
    this.createdAt = new Date();
  }
}

// Optional modifier
export interface OptionalInterface {
  required: string;
  optional?: number;
  alsoOptional?: boolean;
}

export class OptionalClass {
  required: string;
  optional?: number;

  constructor(required: string, optional?: number) {
    this.required = required;
    this.optional = optional;
  }
}

// Abstract modifier
export abstract class AbstractModifiersDemo {
  abstract abstractMethod(): void;
  abstract abstractProperty: string;

  concreteMethod(): string {
    return 'concrete';
  }

  concreteProperty = 'concrete';
}

export class ConcreteModifiersDemo extends AbstractModifiersDemo {
  abstractProperty = 'implemented';

  abstractMethod(): void {
    console.log('implemented');
  }
}

// Async modifier
export async function asyncFunction(): Promise<string> {
  return 'async';
}

export async function asyncFunctionWithAwait(): Promise<number> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return 42;
}

export class AsyncMethods {
  async asyncMethod(): Promise<string> {
    return 'async method';
  }

  async asyncMethodWithAwait(): Promise<number> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return 42;
  }
}

// Static modifier
export class StaticDemo {
  static staticField = 'static';
  static readonly staticReadonly = 'static readonly';

  static staticMethod(): string {
    return StaticDemo.staticField;
  }

  static async staticAsyncMethod(): Promise<string> {
    return StaticDemo.staticField;
  }
}

// Combination of modifiers
export class CombinedModifiers {
  private readonly privateReadonly = 'private readonly';
  protected readonly protectedReadonly = 'protected readonly';
  public readonly publicReadonly = 'public readonly';

  private static readonly privateStaticReadonly = 'private static readonly';
  protected static readonly protectedStaticReadonly = 'protected static readonly';
  public static readonly publicStaticReadonly = 'public static readonly';

  private async privateAsyncMethod(): Promise<string> {
    return this.privateReadonly;
  }

  protected async protectedAsyncMethod(): Promise<string> {
    return this.protectedReadonly;
  }

  public async publicAsyncMethod(): Promise<string> {
    return this.publicReadonly;
  }
}

// Override modifier (TypeScript 4.3+)
export class Base {
  method(): string {
    return 'base';
  }
}

export class Derived extends Base {
  override method(): string {
    return 'derived';
  }
}

// Accessor modifiers (TypeScript 4.9+)
export class AccessorDemo {
  #value = 0;

  get value() {
    return this.#value;
  }

  set value(v: number) {
    this.#value = v;
  }

  get readonlyValue() {
    return this.#value;
  }
}

// Parameter property modifiers
export class ParameterPropertyModifiers {
  constructor(
    public readonly publicReadonlyParam: string,
    private readonly privateReadonlyParam: number,
    protected readonly protectedReadonlyParam: boolean
  ) {}
}

// Declare modifier
declare const declaredConst: string;
declare function declaredFunction(): void;
declare class DeclaredClass {
  method(): void;
}
declare namespace DeclaredNamespace {
  function nestedFunction(): void;
}

// Export modifiers
export const exportedConst = 'exported';
export function exportedFunction(): void {}
export class ExportedClass {}
export interface ExportedInterface {}
export type ExportedType = string;
export enum ExportedEnum {
  A,
  B,
}

// Default export
export default class DefaultExport {
  method(): string {
    return 'default export';
  }
}

// Re-exports
export { ModifiersDemo as RenamedExport };
export * from './types';
