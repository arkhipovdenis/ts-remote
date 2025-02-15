import { default as builder } from '../builder';
import { DeclarationVariant, DeclarationEntry } from '../contract.public';
import path from 'node:path';
import process from 'node:process';
import fs from 'node:fs';

const pathToMocks = path.resolve(process.cwd(), 'packages/builder/__test__/mockDeclarations');
const filesAtDir = ['ExportSpecifierExample.ts'];
// const filesAtDir = fs
//   .readdirSync(pathToMocks, { encoding: 'utf8' })
//   .filter((path) => path.endsWith('.ts') || path.endsWith('.tsx'));

const mapPathFile = filesAtDir.reduce((acc, moduleName) => {
  acc[moduleName.replace(/\.ts(x)?/, '')] = path.join(pathToMocks, moduleName);

  return acc;
}, {} as Record<string, string>);

const moduleEntries: DeclarationEntry[] = Object.entries(mapPathFile).map(
  ([moduleName, filename]): DeclarationEntry => [
    `__module__${moduleName}`,
    {
      filename,
      variant: DeclarationVariant.Module,
    },
  ],
);

builder({
  entries: moduleEntries,
  output: {
    filename: 'packages/builder/__test__/@types.d.ts',
  },
  tsconfig: 'packages/builder/__test__/mockDeclarations/tsconfig.json',
});
