import path from 'node:path';
import process from 'node:process';
import ts from 'typescript';
import { BuilderOptions, DeclarationVariant, ModuleName } from './contract.public';
import { validateExtension } from '../lib/validateExtension';
import { getCompilerOptions } from '../lib/getCompilerOptions';
import { Emitter } from './emitter';

const cwd = process.cwd();
const baseOutputPath = path.resolve(cwd, '@types', 'types.d.ts');
const baseOutputFormat = (result: string) => result;
const baseTsConfigPath = path.resolve(cwd, 'tsconfig.json');

export default async function main(options: BuilderOptions) {
  console.time('DTS build');

  const { entries, output, tsconfig, additionalDeclarations = [] } = options;
  const config = tsconfig || baseTsConfigPath;
  const outputFormat = output?.format || baseOutputFormat;
  const outputPath = output?.filename || baseOutputPath;

  const compilerOptions: ts.CompilerOptions = getCompilerOptions(config, {
    outDir: undefined,
    outFile: undefined,
    noEmit: undefined,
    allowJs: true,
    declaration: true,
    emitDeclarationOnly: true,
    skipLibCheck: true,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    module: ts.ModuleKind.CommonJS,
  });

  const { entryFiles, moduleByFilename, variantByModule } = entries.reduce(
    (acc, [moduleName, { filename, variant }]) => {
      if (validateExtension(filename)) {
        acc.entryFiles.push(filename);
      }

      acc.moduleByFilename.set(filename, moduleName);
      acc.variantByModule.set(moduleName, variant ?? DeclarationVariant.Module);

      return acc;
    },
    {
      entryFiles: [] as string[],
      moduleByFilename: new Map<string, ModuleName>(),
      variantByModule: new Map<ModuleName, DeclarationVariant>(),
    },
  );

  const compilerHost = ts.createCompilerHost(compilerOptions);
  const program = ts.createProgram(
    [...entryFiles, ...additionalDeclarations],
    compilerOptions,
    compilerHost,
  );

  Emitter.initialize(program, compilerHost);

  const modulesContent: string[] = [];

  entryFiles.forEach((fileName) => {
    const sourceFile = program.getSourceFile(fileName);
    const moduleName = moduleByFilename.get(fileName)!;
    const variant = variantByModule.get(moduleName)!;

    if (sourceFile) {
      const emitter = new Emitter(sourceFile);
      const emitResult = emitter.emit(sourceFile)!;

      switch (variant) {
        case DeclarationVariant.Namespace:
          modulesContent.push(
            `declare namespace ${moduleName} {${ts.sys.newLine}${emitResult.outputText}}${ts.sys.newLine}`,
          );
          break;
        case DeclarationVariant.Module:
        default:
          modulesContent.push(
            `declare module "${moduleName}" {${ts.sys.newLine}${emitResult.outputText}}${ts.sys.newLine}`,
          );
      }

      emitter.dispose();
    }
  });

  ts.sys.writeFile(outputPath, outputFormat(modulesContent.join(ts.sys.newLine)), true);

  console.timeEnd('DTS build');
}
