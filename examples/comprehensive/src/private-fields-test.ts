/**
 * Test case for private field filtering
 * This file validates that both TypeScript and JavaScript private members are correctly filtered
 */

export class PrivateFieldsTest {
  // TypeScript private - should be filtered
  private tsPrivate = 'ts private';

  // TypeScript protected - should be filtered
  protected tsProtected = 'ts protected';

  // JavaScript private field - should be filtered
  #jsPrivate = 'js private';

  // Public field - should be included
  public publicField = 'public';

  // Field without modifier (implicitly public) - should be included
  implicitPublic = 'implicit public';

  constructor() {}

  // TypeScript private method - should be filtered
  private tsPrivateMethod(): string {
    return this.tsPrivate;
  }

  // TypeScript protected method - should be filtered
  protected tsProtectedMethod(): string {
    return this.tsProtected;
  }

  // Method using JavaScript private field - should be filtered
  #jsPrivateMethod(): string {
    return this.#jsPrivate;
  }

  // Public method accessing private fields - should be included
  public getPrivate(): string {
    return this.tsPrivate + this.#jsPrivate;
  }

  // Public method - should be included
  public publicMethod(): string {
    return this.publicField;
  }

  // Method without modifier (implicitly public) - should be included
  implicitPublicMethod(): string {
    return this.implicitPublic;
  }

  // Getter for JavaScript private field - should be included
  get jsPrivateValue(): string {
    return this.#jsPrivate;
  }

  // Setter for JavaScript private field - should be included
  set jsPrivateValue(value: string) {
    this.#jsPrivate = value;
  }
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
