import fs from 'node:fs';
import path from 'node:path';
import ts, { ModuleKind, ModuleResolutionKind, ScriptTarget } from 'typescript';
import { getCompilerOptions } from '../packages/builder/get-compiler-options';

const cwd = process.cwd();

const FILES_TO_COPY = ['package.json', 'LICENSE', 'README.md'] as const;
const OUTPUT_DIR = 'dist';
const OUTPUT_PATH = `${path.resolve(cwd, OUTPUT_DIR)}`;

if (fs.existsSync(OUTPUT_PATH)) {
  fs.rmSync(OUTPUT_PATH, { force: true, recursive: true });
}

const entryFiles = [
  ts.sys.resolvePath(`${cwd}/packages/builder/index.ts`),
  ts.sys.resolvePath(`${cwd}/packages/fetcher/index.ts`),
  ts.sys.resolvePath(`${cwd}/packages/plugin/index.ts`),
  ts.sys.resolvePath(`${cwd}/packages/cli/index.ts`),
];

const program = ts.createProgram(entryFiles, {
  ...getCompilerOptions(path.resolve(cwd, 'tsconfig.json')),
  module: ModuleKind.CommonJS,
  outDir: OUTPUT_PATH,
  target: ScriptTarget.ESNext,
  moduleResolution: ModuleResolutionKind.NodeNext,
});

program.emit();

// Add shebang to CLI entry point and make it executable
const cliBinPath = path.resolve(OUTPUT_PATH, 'cli', 'index.js');
if (fs.existsSync(cliBinPath)) {
  const content = fs.readFileSync(cliBinPath, 'utf-8');
  if (!content.startsWith('#!')) {
    fs.writeFileSync(cliBinPath, '#!/usr/bin/env node\n' + content);
  }
  fs.chmodSync(cliBinPath, 0o755);
}

FILES_TO_COPY.forEach((fileName) => {
  if (fileName === 'package.json') {
    const { scripts, devDependencies, 'lint-staged': _lintStaged, ...pkg } = JSON.parse(
      fs.readFileSync(path.resolve(cwd, fileName), 'utf-8'),
    );
    fs.writeFileSync(
      path.resolve(cwd, OUTPUT_PATH, fileName),
      JSON.stringify(pkg, null, 2) + '\n',
    );
  } else {
    fs.cpSync(path.resolve(cwd, fileName), path.resolve(cwd, OUTPUT_PATH, fileName));
  }
});
