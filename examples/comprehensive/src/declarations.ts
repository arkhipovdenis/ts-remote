/**
 * Basic declarations: VariableDeclaration, FunctionDeclaration, ClassDeclaration
 */

// VariableDeclaration with different types
export const stringConst = 'hello';
export const numberConst = 42;
export const booleanConst = true;
export const nullConst = null;
export const undefinedConst = undefined;

// Variable with explicit type
export const typedVariable: string = 'typed';

// Multiple variables in one declaration
export const a = 1, b = 2, c = 3;

// Let and const
export let mutableVar = 'can change';
export const immutableVar = 'cannot change';

// FunctionDeclaration
export function simpleFunction() {
  return 'simple';
}

export function functionWithParams(a: number, b: string): string {
  return `${a}${b}`;
}

export function functionWithOptionalParams(a: number, b?: string): string {
  return `${a}${b ?? ''}`;
}

export function functionWithDefaultParams(a: number, b: string = 'default'): string {
  return `${a}${b}`;
}

export function functionWithRestParams(...args: number[]): number {
  return args.reduce((a, b) => a + b, 0);
}

// FunctionExpression
export const functionExpression = function (x: number) {
  return x * 2;
};

export const namedFunctionExpression = function multiply(x: number, y: number) {
  return x * y;
};

// ArrowFunction
export const arrowFunction = (x: number) => x * 2;
export const arrowFunctionWithBlock = (x: number) => {
  return x * 2;
};
export const arrowFunctionAsync = async (x: number) => x * 2;

// ClassDeclaration
export class SimpleClass {
  constructor(public value: number) {}
}

export class ClassWithMethods {
  private privateField: number;
  protected protectedField: string;
  public publicField: boolean;

  constructor(value: number) {
    this.privateField = value;
    this.protectedField = 'protected';
    this.publicField = true;
  }

  public getPrivate(): number {
    return this.privateField;
  }

  protected getProtected(): string {
    return this.protectedField;
  }

  private getPrivateMethod(): boolean {
    return this.publicField;
  }

  static staticMethod(): string {
    return 'static';
  }

  static staticField = 'static field';
}

export class ClassWithGetterSetter {
  private _value: number = 0;

  get value(): number {
    return this._value;
  }

  set value(v: number) {
    this._value = v;
  }
}

export abstract class AbstractClass {
  abstract abstractMethod(): void;

  concreteMethod(): string {
    return 'concrete';
  }
}

export class DerivedClass extends AbstractClass {
  abstractMethod(): void {
    console.log('implemented');
  }
}

// Constructor with parameter properties
export class ParameterProperties {
  constructor(
    public publicParam: string,
    private privateParam: number,
    protected protectedParam: boolean,
    readonly readonlyParam: Date
  ) {}
}
