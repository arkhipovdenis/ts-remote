export type ImportPath = string;
export type ModuleName = string;
export enum DeclarationVariant {
  Module,
  Namespace,
}

/**
 * TODO
 * */
export type DeclarationEntry = [
  ModuleName,
  {
    filename: ImportPath;
    variant?: DeclarationVariant;
  },
];

export type BuilderOptions = {
  /**
   * TODO
   * */
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
    format?: (result: string) => string;
  };
  /**
   * The path to tsconfig
   * @default path.resolve(process.cwd(), 'tsconfig.json')
   * */
  tsconfig?: string;
};
