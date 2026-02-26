import ts from 'typescript';
import { canHaveName } from './helpers';

type EmitterOptions = {
  rootFile: ts.SourceFile;
  program: ts.Program;
  compilerHost: ts.CompilerHost;
  moduleResolutionCache?: ts.ModuleResolutionCache;
};

export class Emitter {
  #program: ts.Program;
  #typeChecker: ts.TypeChecker;
  #compilerOptions: ts.CompilerOptions;
  #compilerHost: ts.CompilerHost;
  #printer: ts.Printer;
  #moduleResolutionCache: ts.ModuleResolutionCache;
  #rootFile: ts.SourceFile;
  #aliasImportMap = new Map<string, string>();
  #emittedFiles = new Set<string>();
  #visitedCache = new WeakSet<ts.Node>();
  #declarationParts: string[] = [];
  #imports: string[] = [];
  #exports: string[] = [];

  constructor({ program, compilerHost, rootFile, moduleResolutionCache }: EmitterOptions) {
    this.#program = program;
    this.#printer = ts.createPrinter();
    this.#typeChecker = program.getTypeChecker();
    this.#compilerOptions = program.getCompilerOptions();
    this.#compilerHost = compilerHost;
    this.#rootFile = rootFile;
    this.#moduleResolutionCache =
      moduleResolutionCache ??
      ts.createModuleResolutionCache(
        compilerHost.getCurrentDirectory(),
        compilerHost.getCanonicalFileName,
        this.#compilerOptions,
      );
  }

  setRootFile(rootFile: ts.SourceFile): void {
    this.#rootFile = rootFile;
  }

  resetBuffers(): void {
    this.#declarationParts = [];
    this.#imports = [];
    this.#exports = [];
  }

  private resolveModule(moduleName: string, containingFile: string) {
    return ts.resolveModuleName(
      moduleName,
      containingFile,
      this.#compilerOptions,
      this.#compilerHost,
      this.#moduleResolutionCache,
    ).resolvedModule;
  }

  private getModuleNameFromSpecifier(specifier: ts.Expression): string {
    if (ts.isStringLiteral(specifier)) {
      return specifier.text;
    }
    return specifier.getText().replace(/['"]/g, '');
  }

  private get declaration(): ts.TranspileOutput {
    const parts: string[] = [];

    if (this.#imports.length > 0) {
      parts.push(this.#imports.join(ts.sys.newLine), ts.sys.newLine);
    }

    parts.push(...this.#declarationParts);

    if (this.#exports.length > 0) {
      parts.push(ts.sys.newLine, this.#exports.join(ts.sys.newLine));
    }

    const code = parts.join('');
    return ts.transpileDeclaration(code, { compilerOptions: this.#compilerOptions });
  }

  private collectAliases(node: ts.ImportDeclaration) {
    const importClause = node.importClause;
    if (!importClause) return;

    if (importClause.namedBindings && ts.isNamedImports(importClause.namedBindings)) {
      for (let i = 0; i < importClause.namedBindings.elements.length; i++) {
        const element = importClause.namedBindings.elements[i];

        if (element.propertyName && element.name) {
          this.#aliasImportMap.set(element.name.text, element.propertyName.text);
        }
      }
    }

    if (importClause.namedBindings && ts.isNamespaceImport(importClause.namedBindings)) {
      const moduleName = (node.moduleSpecifier as ts.StringLiteral).text;
      this.#aliasImportMap.set(importClause.namedBindings.name.text, moduleName);
    }
  }

  private getStatementVisitor = (context: ts.TransformationContext) => {
    const visitor = (node: ts.Node): ts.Node => {
      if (ts.isLiteralTypeNode(node)) {
        if (ts.isStringLiteral(node.literal)) {
          return context.factory.createLiteralTypeNode(
            context.factory.createStringLiteral(node.literal.text),
          );
        }

        if (ts.isNumericLiteral(node.literal)) {
          return context.factory.createLiteralTypeNode(
            context.factory.createNumericLiteral(node.literal.text),
          );
        }

        if (
          node.literal.kind === ts.SyntaxKind.TrueKeyword ||
          node.literal.kind === ts.SyntaxKind.FalseKeyword
        ) {
          return context.factory.createLiteralTypeNode(
            node.literal.kind === ts.SyntaxKind.TrueKeyword
              ? context.factory.createTrue()
              : context.factory.createFalse(),
          );
        }
      }

      return ts.visitEachChild(node, visitor, context);
    };

    return visitor;
  };

  private updateStatements = (
    statements: ts.Statement[] | ts.NodeArray<ts.Statement>,
    visitor: ts.Visitor,
  ): ts.Statement[] => {
    return statements.map((statement) => ts.visitNode(statement, visitor)) as ts.Statement[];
  };

  private transformFile(
    sourceFile: ts.SourceFile,
    context: ts.TransformationContext,
  ): ts.SourceFile {
    const statementVisitor = this.getStatementVisitor(context);

    const isRootFile = sourceFile.fileName === this.#rootFile.fileName;

    const exportsSpecifiers: ts.ExportSpecifier[] = [];
    const seenSpecifiers = new Set<string>();

    const hasSpecifier = (name: string) => seenSpecifiers.has(name);

    const addSpecifier = (specifier: ts.ExportSpecifier) => {
      seenSpecifiers.add(specifier.name.text);
      exportsSpecifiers.push(specifier);
    };

    const processNamedExportBindings = (exportClause: ts.NamedExportBindings) => {
      exportClause.forEachChild((node) => {
        if (ts.isExportSpecifier(node) && !hasSpecifier(node.name.text)) {
          const symbolAtLocation = this.#typeChecker.getSymbolAtLocation(node.name);

          if (symbolAtLocation) {
            const aliasedSymbol = this.#typeChecker.getAliasedSymbol(symbolAtLocation);

            if (aliasedSymbol) {
              const isDifferentName = node.name.text !== aliasedSymbol.name;

              if (isDifferentName) {
                addSpecifier(
                  context.factory.createExportSpecifier(
                    node.isTypeOnly,
                    aliasedSymbol.name,
                    node.name.text,
                  ),
                );
              } else {
                addSpecifier(node);
              }
            }
          }
        }
      });
    };

    const visitor: ts.Visitor = (rootNode: ts.Node): ts.Node | undefined => {
      if (this.#visitedCache.has(rootNode)) {
        return rootNode;
      }

      this.#visitedCache.add(rootNode);

      if (ts.isExportAssignment(rootNode)) {
        if (isRootFile) {
          this.#exports.push(
            this.#printer.printNode(ts.EmitHint.Unspecified, rootNode, sourceFile),
          );
        }

        return;
      }

      if (ts.isImportDeclaration(rootNode) || ts.isExportDeclaration(rootNode)) {
        if (rootNode.moduleSpecifier) {
          const moduleName = this.getModuleNameFromSpecifier(rootNode.moduleSpecifier);
          const resolvedModule = this.resolveModule(moduleName, sourceFile.fileName);

          if (!resolvedModule || resolvedModule.isExternalLibraryImport) {
            if (ts.isImportDeclaration(rootNode)) {
              this.#imports.push(
                this.#printer.printNode(ts.EmitHint.Unspecified, rootNode, sourceFile),
              );
            }

            if (ts.isExportDeclaration(rootNode)) {
              this.#exports.unshift(
                this.#printer.printNode(ts.EmitHint.Unspecified, rootNode, sourceFile),
              );
            }

            return;
          }

          if (ts.isImportDeclaration(rootNode)) {
            this.collectAliases(rootNode);
          }

          const symbolAtLocation = this.#typeChecker.getSymbolAtLocation(rootNode.moduleSpecifier);

          if (symbolAtLocation?.declarations) {
            const [declaration] = symbolAtLocation.declarations;
            const module = declaration.getSourceFile();

            if (ts.isExportDeclaration(rootNode) && isRootFile) {
              if (rootNode.exportClause) {
                if (
                  // export * as {namespace} from ...
                  ts.isNamespaceExport(rootNode.exportClause) &&
                  !hasSpecifier(rootNode.exportClause.name.text)
                ) {
                  // export {namespaceName -> rootNode.exportClause.name.text}
                  addSpecifier(
                    context.factory.createExportSpecifier(
                      rootNode.isTypeOnly,
                      undefined,
                      rootNode.exportClause.name.text,
                    ),
                  );

                  // create namespace "rootNode.exportClause.name.text" {...}
                  return context.factory.createModuleDeclaration(
                    undefined,
                    context.factory.createIdentifier(rootNode.exportClause.name.text),
                    context.factory.createModuleBlock(
                      this.updateStatements(module.statements, statementVisitor),
                    ),
                    ts.NodeFlags.Namespace,
                  );
                }

                processNamedExportBindings(rootNode.exportClause);
              } else {
                const symbol = this.#typeChecker.getSymbolAtLocation(module);

                if (symbol) {
                  const exportsOfModule = this.#typeChecker.getExportsOfModule(symbol);

                  for (const exportSymbol of exportsOfModule) {
                    if (!hasSpecifier(exportSymbol.name)) {
                      addSpecifier(
                        context.factory.createExportSpecifier(
                          rootNode.isTypeOnly,
                          undefined,
                          exportSymbol.name,
                        ),
                      );
                    }
                  }
                }
              }
            }

            this.emit(module);
          }
        } else if (ts.isExportDeclaration(rootNode) && isRootFile) {
          if (!rootNode.exportClause) {
            return;
          }

          processNamedExportBindings(rootNode.exportClause);
        }

        return;
      }

      if (ts.isClassDeclaration(rootNode)) {
        const members = context.factory.createNodeArray(
          rootNode.members.filter((member) => {
            // Filter out private/protected modifiers
            if (ts.canHaveModifiers(member) && member.modifiers) {
              const hasPrivateModifier = member.modifiers.some(
                (modifier) =>
                  modifier.kind === ts.SyntaxKind.PrivateKeyword ||
                  modifier.kind === ts.SyntaxKind.ProtectedKeyword,
              );
              if (hasPrivateModifier) {
                return false;
              }
            }

            // Filter out JavaScript private identifiers (#field)
            if ('name' in member && member.name) {
              if (ts.isPrivateIdentifier(member.name)) {
                return false;
              }
            }

            return true;
          }),
        );

        rootNode = context.factory.updateClassDeclaration(
          rootNode,
          rootNode.modifiers,
          rootNode.name,
          rootNode.typeParameters,
          rootNode.heritageClauses,
          members,
        );
      }

      if (ts.isImportTypeNode(rootNode)) {
        let importPath: string;
        if (ts.isLiteralTypeNode(rootNode.argument) && ts.isStringLiteral(rootNode.argument.literal)) {
          importPath = rootNode.argument.literal.text;
        } else {
          importPath = rootNode.argument.getText().replace(/['"]/g, '');
        }

        const resolvedModule = this.resolveModule(importPath, sourceFile.fileName);

        if (resolvedModule?.isExternalLibraryImport) {
          return rootNode;
        }

        if (resolvedModule?.resolvedFileName) {
          const importedSourceFile = this.#program.getSourceFile(resolvedModule.resolvedFileName);

          if (importedSourceFile) {
            this.emit(importedSourceFile);

            if (rootNode.isTypeOf && !rootNode.qualifier) {
              const moduleSymbol = this.#typeChecker.getSymbolAtLocation(importedSourceFile);

              if (moduleSymbol) {
                const type = this.#typeChecker.getTypeAtLocation(rootNode);
                const properties = type.getProperties();

                return context.factory.createTypeLiteralNode(
                  properties.reduce((acc, exportSymbol) => {
                    if (exportSymbol.declarations) {
                      const [declaration] = exportSymbol.declarations;

                      acc.push(
                        context.factory.createPropertySignature(
                          context.factory.createNodeArray([
                            context.factory.createModifier(ts.SyntaxKind.ReadonlyKeyword),
                          ]),
                          exportSymbol.name,
                          undefined,
                          ts.isExportAssignment(declaration)
                            ? context.factory.createTypeQueryNode(
                                context.factory.createIdentifier('_default'),
                              )
                            : context.factory.createTypeReferenceNode(exportSymbol.name),
                        ),
                      );
                    }

                    return acc;
                  }, [] as ts.TypeElement[]),
                );
              }
            }

            if (rootNode.qualifier) {
              return rootNode.isTypeOf
                ? context.factory.createTypeQueryNode(rootNode.qualifier, rootNode.typeArguments)
                : rootNode.qualifier;
            }
          }
        }
      }

      if (ts.canHaveModifiers(rootNode) && rootNode.modifiers) {
        let hasExport = false;

        rootNode = context.factory.replaceModifiers(
          rootNode,
          context.factory.createNodeArray(
            rootNode.modifiers.filter((modifier) => {
              const isExport = modifier.kind === ts.SyntaxKind.ExportKeyword;

              if (isExport) {
                hasExport = true;
              }

              // remove export keyword
              return !isExport;
            }) as ts.Modifier[],
          ),
        );

        if (hasExport) {
          const _node = ts.isVariableStatement(rootNode)
            ? rootNode.declarationList.declarations[0]
            : rootNode;

          if (isRootFile && canHaveName(_node)) {
            const symbol = this.#typeChecker.getSymbolAtLocation(_node.name);

            if (symbol) {
              const aliasedSymbol =
                symbol.flags & ts.SymbolFlags.Alias
                  ? this.#typeChecker.getAliasedSymbol(symbol)
                  : symbol;

              const isDifferentName = symbol.name !== aliasedSymbol?.name;

              addSpecifier(
                context.factory.createExportSpecifier(
                  false,
                  isDifferentName ? aliasedSymbol?.name : undefined,
                  aliasedSymbol.name,
                ),
              );
            }
          }
        }
      }

      if (ts.isTypeReferenceNode(rootNode) && ts.isIdentifier(rootNode.typeName)) {
        const alias = rootNode.typeName.text;
        const originalName = this.#aliasImportMap.get(alias);

        if (originalName) {
          return context.factory.updateTypeReferenceNode(
            rootNode,
            context.factory.createIdentifier(originalName),
            rootNode.typeArguments,
          );
        }
      }

      if (ts.isIdentifier(rootNode)) {
        const alias = rootNode.text;
        const original = this.#aliasImportMap.get(alias);

        if (original) {
          return context.factory.createIdentifier(original);
        }
      }

      // TypeAlias.NamespaceType
      if (ts.isQualifiedName(rootNode) && ts.isIdentifier(rootNode.left)) {
        let currentNode = rootNode;
        let alias = rootNode.left.text;

        // Пытаемся пройтись по всей цепочке qualified names
        while (ts.isQualifiedName(currentNode.right)) {
          currentNode = currentNode.right;
        }

        // Проверка наличия alias в map
        if (this.#aliasImportMap.has(alias)) {
          return context.factory.createIdentifier(currentNode.right.text);
        }
      }

      return ts.visitEachChild(rootNode, visitor, context);
    };

    const visitedFile = ts.visitNode(sourceFile, visitor) as ts.SourceFile;

    if (isRootFile && exportsSpecifiers.length > 0) {
      const exportDeclaration = context.factory.createExportDeclaration(
        context.factory.createNodeArray([]),
        false,
        context.factory.createNamedExports(exportsSpecifiers),
      );

      this.#exports.unshift(
        this.#printer.printNode(ts.EmitHint.Unspecified, exportDeclaration, visitedFile),
      );
    }

    return visitedFile;
  }

  private transformer: ts.TransformerFactory<ts.SourceFile | ts.Bundle> = (context) => {
    return (sourceFile) => {
      if (!ts.isSourceFile(sourceFile)) {
        return sourceFile;
      }

      return this.transformFile(sourceFile, context);
    };
  };

  emit(sourceFile: ts.SourceFile) {
    if (this.#emittedFiles.has(sourceFile.fileName)) {
      return;
    }

    this.#emittedFiles.add(sourceFile.fileName);

    this.#program.emit(
      sourceFile,
      (_, text) => {
        this.#declarationParts.push(text);
      },
      undefined,
      true,
      { afterDeclarations: [this.transformer] },
    );

    return this.declaration;
  }

  dispose() {
    this.#aliasImportMap.clear();
    this.#emittedFiles.clear();
    this.#visitedCache = new WeakSet<ts.Node>();
    this.resetBuffers();
  }
}
