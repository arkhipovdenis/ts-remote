export type ImportPath = string;
export type ModuleName = string;
export enum DeclarationVariant {
  Module,
  Namespace,
}

/**
 * Represents a single module declaration entry.
 *
 * A declaration entry defines a module name and its source file,
 * along with an optional variant (Module or Namespace).
 *
 * @example
 * ```typescript
 * // Module variant (default)
 * const moduleEntry: DeclarationEntry = {
 *   name: 'my-app',
 *   filename: './src/index.ts'
 * };
 *
 * // Namespace variant
 * const namespaceEntry: DeclarationEntry = {
 *   name: 'Utils',
 *   filename: './src/utils.ts',
 *   variant: DeclarationVariant.Namespace
 * };
 * ```
 */
export type DeclarationEntry = {
  name: ModuleName;
  filename: ImportPath;
  variant?: DeclarationVariant;
};

export type BuilderOptions = {
  /**
   * Array of module declarations to compile.
   *
   * Each entry defines a module name and its source file.
   * The builder will process all entries and generate type declarations for each.
   *
   * @example
   * ```typescript
   * entries: [
   *   { name: 'app', filename: './src/app.ts' },
   *   { name: 'utils', filename: './src/utils.ts', variant: DeclarationVariant.Namespace },
   * ]
   * ```
   */
  entries: DeclarationEntry[];
  /**
   * d.ts files required for environment and concatenation with output.filename
   * */
  additionalDeclarations?: string[];
  output?: {
    /**
     * The path to the compiled file
     * @default path.resolve(process.cwd(), '@types', 'types.d.ts')
     * */
    filename?: string;
    /**
     * A method for processing the contents of a compiled file
     * */
    format?: (result: string) => string | Promise<string>;
  };
  /**
   * The path to tsconfig
   * @default path.resolve(process.cwd(), 'tsconfig.json')
   * */
  tsconfig?: string;
};
