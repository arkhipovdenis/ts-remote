import ts from 'typescript';
import { canHaveName } from './helpers';

export class Emitter {
  static #program: ts.Program;
  static #typeChecker: ts.TypeChecker;
  static #compilerHost: ts.CompilerHost;
  static #printer: ts.Printer;

  #aliasImportMap = new Map<string, string>();
  #importedProperties = new Set<string>();
  #emittedFiles = new Set<string>();

  #moduleResolutionCache = ts.createModuleResolutionCache(
    Emitter.#compilerHost.getCurrentDirectory(),
    Emitter.#compilerHost.getCanonicalFileName,
    Emitter.#program.getCompilerOptions(),
  );

  readonly #transformerCache = new WeakMap<ts.Node, ts.SourceFile>();
  readonly #visitedCache = new WeakSet<ts.Node>();

  constructor(private rootFile: ts.SourceFile) {}

  #declaration = '';
  #imports: string[] = [];
  #exports: string[] = [];

  private get declaration(): ts.TranspileOutput {
    return ts.transpileDeclaration(
      [
        this.#imports.join(ts.sys.newLine),
        this.#declaration,
        this.#exports.join(ts.sys.newLine),
      ].join(ts.sys.newLine),
      { compilerOptions: Emitter.#program.getCompilerOptions() },
    );
  }

  static initialize(program: ts.Program, host: ts.CompilerHost) {
    this.#program = program;
    this.#printer = ts.createPrinter();
    this.#typeChecker = program.getTypeChecker();
    this.#compilerHost = host;
  }

  private collectAliases(node: ts.ImportDeclaration) {
    const importClause = node.importClause;
    if (!importClause) return;

    if (importClause.namedBindings && ts.isNamedImports(importClause.namedBindings)) {
      importClause.namedBindings.elements.forEach((element) => {
        if (element.propertyName && element.name) {
          this.#aliasImportMap.set(element.name.text, element.propertyName.text);
        }
      });
    }

    if (importClause.namedBindings && ts.isNamespaceImport(importClause.namedBindings)) {
      const moduleName = (node.moduleSpecifier as ts.StringLiteral).text;
      this.#aliasImportMap.set(importClause.namedBindings.name.text, moduleName);
    }
  }

  private updateStatements = (
    statements: ts.Statement[] | ts.NodeArray<ts.Statement>,
    context: ts.TransformationContext,
  ): ts.Statement[] => {
    const visitor = (node: ts.Node): ts.Node => {
      if (ts.isLiteralTypeNode(node) && ts.isStringLiteral(node.literal)) {
        return context.factory.createLiteralTypeNode(
          context.factory.createStringLiteral(node.literal.text),
        );
      }

      if (ts.isLiteralTypeNode(node) && ts.isNumericLiteral(node.literal)) {
        return context.factory.createLiteralTypeNode(
          context.factory.createNumericLiteral(node.literal.text),
        );
      }

      if (
        ts.isLiteralTypeNode(node) &&
        (node.literal.kind === ts.SyntaxKind.TrueKeyword ||
          node.literal.kind === ts.SyntaxKind.FalseKeyword)
      ) {
        return context.factory.createLiteralTypeNode(
          node.literal.kind === ts.SyntaxKind.TrueKeyword
            ? context.factory.createTrue()
            : context.factory.createFalse(),
        );
      }

      return ts.visitEachChild(node, visitor, context);
    };

    return statements.map((statement) => ts.visitNode(statement, visitor)) as ts.Statement[];
  };

  private transformer: ts.TransformerFactory<ts.SourceFile | ts.Bundle> = (context) => {
    return (sourceFile) => {
      if (!ts.isSourceFile(sourceFile)) {
        return sourceFile;
      }

      if (this.#transformerCache.has(sourceFile)) {
        return this.#transformerCache.get(sourceFile)!;
      }

      this.#transformerCache.set(sourceFile, sourceFile);

      const isRootFile = sourceFile.fileName === this.rootFile.fileName;

      const exportsSpecifiers: ts.ExportSpecifier[] = [];

      const hasSpecifier = (name: string) => {
        return exportsSpecifiers.some((specifier) => specifier.name.text === name);
      };

      const visit = (rootNode: ts.Node): ts.Node | undefined => {
        if (this.#visitedCache.has(rootNode)) {
          return rootNode;
        }

        this.#visitedCache.add(rootNode);

        if (ts.isExportAssignment(rootNode)) {
          if (isRootFile) {
            this.#exports.push(
              Emitter.#printer.printNode(ts.EmitHint.Unspecified, rootNode, sourceFile),
            );
          }

          return;
        }

        if (ts.isImportDeclaration(rootNode) || ts.isExportDeclaration(rootNode)) {
          if (rootNode.moduleSpecifier) {
            const resolvedModuleName = ts.resolveModuleName(
              rootNode.moduleSpecifier.getText().replace(/['"]/g, ''),
              sourceFile.fileName,
              Emitter.#program.getCompilerOptions(),
              Emitter.#compilerHost,
              this.#moduleResolutionCache,
            ).resolvedModule;

            if (ts.isImportDeclaration(rootNode)) {
              this.collectAliases(rootNode);
            }

            if (!resolvedModuleName || resolvedModuleName.isExternalLibraryImport) {
              if (ts.isImportDeclaration(rootNode)) {
                this.#imports.push(
                  Emitter.#printer.printNode(ts.EmitHint.Unspecified, rootNode, sourceFile),
                );
              }

              if (ts.isExportDeclaration(rootNode)) {
                this.#exports.unshift(
                  Emitter.#printer.printNode(ts.EmitHint.Unspecified, rootNode, sourceFile),
                );
              }

              return;
            }

            const symbolAtLocation = Emitter.#typeChecker.getSymbolAtLocation(
              rootNode.moduleSpecifier,
            );

            if (symbolAtLocation?.declarations) {
              const [declaration] = symbolAtLocation.declarations;
              const module = declaration.getSourceFile();

              if (ts.isExportDeclaration(rootNode) && isRootFile) {
                if (rootNode.exportClause) {
                  if (
                    ts.isNamespaceExport(rootNode.exportClause) &&
                    !hasSpecifier(rootNode.exportClause.name.text)
                  ) {
                    exportsSpecifiers.push(
                      context.factory.createExportSpecifier(
                        rootNode.isTypeOnly,
                        undefined,
                        rootNode.exportClause.name.text,
                      ),
                    );

                    return context.factory.createModuleDeclaration(
                      undefined,
                      context.factory.createIdentifier(rootNode.exportClause.name.text),
                      context.factory.createModuleBlock(
                        this.updateStatements(module.statements, context),
                      ),
                      ts.NodeFlags.Namespace,
                    );
                  }

                  rootNode.exportClause.forEachChild((node) => {
                    if (ts.isExportSpecifier(node) && !hasSpecifier(node.name.text)) {
                      const symbolAtLocation = Emitter.#typeChecker.getSymbolAtLocation(node.name);

                      if (symbolAtLocation) {
                        const aliasedSymbol =
                          Emitter.#typeChecker.getAliasedSymbol(symbolAtLocation);

                        if (aliasedSymbol) {
                          const isDifferentName = node.name.text !== aliasedSymbol.name;

                          if (isDifferentName) {
                            exportsSpecifiers.push(
                              context.factory.createExportSpecifier(
                                node.isTypeOnly,
                                aliasedSymbol.name,
                                node.name.text,
                              ),
                            );
                          } else {
                            exportsSpecifiers.push(node);
                          }
                        }
                      }
                    }
                  });
                } else {
                  const symbol = Emitter.#typeChecker.getSymbolAtLocation(module);

                  if (symbol) {
                    const exportsOfModule = Emitter.#typeChecker.getExportsOfModule(symbol);

                    for (const exportSymbol of exportsOfModule) {
                      if (!hasSpecifier(exportSymbol.name)) {
                        exportsSpecifiers.push(
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

            rootNode.exportClause.forEachChild((node) => {
              if (ts.isExportSpecifier(node) && !hasSpecifier(node.name.text)) {
                const symbolAtLocation = Emitter.#typeChecker.getSymbolAtLocation(node.name);

                if (symbolAtLocation) {
                  const aliasedSymbol = Emitter.#typeChecker.getAliasedSymbol(symbolAtLocation);

                  if (aliasedSymbol) {
                    const isDifferentName = node.name.text !== aliasedSymbol.name;

                    if (isDifferentName) {
                      exportsSpecifiers.push(
                        context.factory.createExportSpecifier(
                          node.isTypeOnly,
                          aliasedSymbol.name,
                          node.name.text,
                        ),
                      );
                    } else {
                      exportsSpecifiers.push(node);
                    }
                  }
                }
              }
            });
          }

          return;
        }

        if (ts.isClassDeclaration(rootNode)) {
          const members = context.factory.createNodeArray(
            rootNode.members.filter((member) => {
              if (ts.canHaveModifiers(member) && member.modifiers) {
                return !member.modifiers.some(
                  (modifier) =>
                    modifier.kind === ts.SyntaxKind.PrivateKeyword ||
                    ts.SyntaxKind.ProtectedKeyword,
                );
              }

              return member;
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
          const importPath =
            ts.isLiteralTypeNode(rootNode.argument) && ts.isStringLiteral(rootNode.argument.literal)
              ? rootNode.argument.literal.text
              : rootNode.argument.getText();

          const resolvedModuleName = ts.resolveModuleName(
            importPath.replace(/['"]/g, ''),
            sourceFile.fileName,
            Emitter.#program.getCompilerOptions(),
            Emitter.#compilerHost,
            this.#moduleResolutionCache,
          ).resolvedModule;

          if (resolvedModuleName?.isExternalLibraryImport) {
            return rootNode;
          }

          if (resolvedModuleName?.resolvedFileName) {
            const importedSourceFile = Emitter.#program.getSourceFile(
              resolvedModuleName.resolvedFileName,
            );

            if (importedSourceFile) {
              this.emit(importedSourceFile);

              if (rootNode.isTypeOf && !rootNode.qualifier) {
                const moduleSymbol = Emitter.#typeChecker.getSymbolAtLocation(importedSourceFile);

                if (moduleSymbol) {
                  const type = Emitter.#typeChecker.getTypeAtLocation(rootNode);
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

                return !isExport;
              }) as ts.Modifier[],
            ),
          );

          if (hasExport) {
            const _node = ts.isVariableStatement(rootNode)
              ? rootNode.declarationList.declarations[0]
              : rootNode;

            if (isRootFile && canHaveName(_node)) {
              const symbol = Emitter.#typeChecker.getSymbolAtLocation(_node.name);

              if (symbol) {
                const aliasedSymbol =
                  symbol.flags & ts.SymbolFlags.Alias
                    ? Emitter.#typeChecker.getAliasedSymbol(symbol)
                    : symbol;

                const isDifferentName = symbol.name !== aliasedSymbol?.name;

                exportsSpecifiers.push(
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
          const original = this.#aliasImportMap.get(alias);

          if (original) {
            return ts.factory.updateTypeReferenceNode(
              rootNode,
              ts.factory.createIdentifier(original),
              rootNode.typeArguments,
            );
          }
        }

        if (ts.isIdentifier(rootNode)) {
          const alias = rootNode.text;
          const original = this.#aliasImportMap.get(alias);

          if (original) {
            return ts.factory.createIdentifier(original);
          }
        }

        // TypeAlias.NamespaceType
        if (ts.isQualifiedName(rootNode) && ts.isIdentifier(rootNode.left)) {
          const alias = rootNode.left.text;
          const property = rootNode.right.text;

          if (this.#aliasImportMap.has(alias)) {
            this.#importedProperties.add(property);
            return ts.factory.createIdentifier(property);
          }
        }

        return ts.visitEachChild(rootNode, visit, context);
      };

      const visitedFile = ts.visitNode(sourceFile, visit) as ts.SourceFile;

      if (isRootFile && exportsSpecifiers.length > 0) {
        const exportDeclaration = context.factory.createExportDeclaration(
          context.factory.createNodeArray([]),
          false,
          context.factory.createNamedExports(exportsSpecifiers),
        );

        this.#exports.unshift(
          Emitter.#printer.printNode(ts.EmitHint.Unspecified, exportDeclaration, visitedFile),
        );
      }

      return visitedFile;
    };
  };

  emit(sourceFile: ts.SourceFile) {
    if (this.#emittedFiles.has(sourceFile.fileName)) {
      return;
    }

    this.#emittedFiles.add(sourceFile.fileName);

    Emitter.#program.emit(
      sourceFile,
      (_, text) => {
        this.#declaration += text;
      },
      undefined,
      true,
      { afterDeclarations: [this.transformer] },
    );

    return this.declaration;
  }

  dispose() {
    this.#imports = [];
    this.#exports = [];
    this.#importedProperties.clear();
    this.#aliasImportMap.clear();
  }
}
