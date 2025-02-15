import { TypeWithGeneric } from './TypeAliasDeclarationExample';

export interface TestClassDeclarationExample<T> {}

class ClassDeclarationExample {
  example: number;

  constructor(example: number) {
    this.example = example;
  }
}
class ClassDeclarationExample2 {
  _example: string;

  constructor(example: string) {
    this._example = example;
  }
}
type SomeType = string[];
class ClassDeclarationExample3 {
  private _array: Array<SomeType> = [];

  get array() {
    return this._array;
  }
}

export class TestClassDeclarationExample<T> extends ClassDeclarationExample3 {
  private _field: string = '';

  public get<T>(key: T) {
    return new Map().get(key);
  }

  set field(s: string) {
    this._field = s;
  }

  getData<K extends keyof { d: unknown }>(key: K) {
    const getObserver = () => {
      const observableObject: TypeWithGeneric<K> = this.get(key);
      return observableObject;
    };
    if (getObserver()) {
      return getObserver();
    } else if (this.field) {
      return new ClassDeclarationExample2('1');
    }

    return new ClassDeclarationExample(0);
  }
}
export default new TestClassDeclarationExample<112>();
