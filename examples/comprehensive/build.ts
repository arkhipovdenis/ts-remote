/**
 * Build script for comprehensive TypeScript syntax example
 */
import build from '../../packages/builder/build';
import path from 'path';
import prettier from 'prettier';

async function main() {
  await build({
    entries: [
      {
        name: 'declarations',
        filename: path.resolve(__dirname, 'src/declarations.ts'),
      },
      {
        name: 'types',
        filename: path.resolve(__dirname, 'src/types.ts'),
      },
      {
        name: 'advanced-types',
        filename: path.resolve(__dirname, 'src/advanced-types.ts'),
      },
      {
        name: 'generics',
        filename: path.resolve(__dirname, 'src/generics.ts'),
      },
      {
        name: 'modifiers',
        filename: path.resolve(__dirname, 'src/modifiers.ts'),
      },
      {
        name: 'private-fields-test',
        filename: path.resolve(__dirname, 'src/private-fields-test.ts'),
      },
      {
        name: 'aliased-reexport',
        filename: path.resolve(__dirname, 'src/aliased-reexport.ts'),
      },
      {
        name: 'cjs-patterns',
        filename: path.resolve(__dirname, 'src/cjs-patterns.ts'),
      },
    ],
    output: {
      filename: path.resolve(__dirname, 'dist/comprehensive.d.ts'),
      format: (result) => prettier.format(result, { parser: 'typescript' }),
    },
    tsconfig: path.resolve(__dirname, '../../tsconfig.json'),
  });

  console.log('✅ Comprehensive type declarations generated successfully!');
  console.log('📄 Output: examples/comprehensive/dist/comprehensive.d.ts');
  console.log('');
  console.log('This example covers:');
  console.log('  - Basic declarations (variables, functions, classes)');
  console.log('  - Type declarations (interfaces, type aliases, enums)');
  console.log('  - Advanced types (conditional, mapped, template literal)');
  console.log('  - Generics (constraints, variance, recursive types)');
  console.log('  - Modifiers (access control, readonly, async, static)');
  console.log('  - Private fields filtering (both TS private and JS #field)');
}

main().catch((error) => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});
