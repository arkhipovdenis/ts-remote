/**
 * Build script demonstrating namespace variant
 */
import build from '../../packages/builder/build';
import { DeclarationVariant } from '../../packages/builder/contract-public';
import path from 'path';
import prettier from 'prettier';

async function main() {
  await build({
    entries: [
      {
        name: 'MyLibrary',
        filename: path.resolve(__dirname, 'src/library.ts'),
        variant: DeclarationVariant.Namespace, // Creates: declare namespace MyLibrary { ... }
      },
    ],
    output: {
      filename: path.resolve(__dirname, 'dist/library.d.ts'),
      format: (result) => prettier.format(result, { parser: 'typescript' }),
    },
    tsconfig: path.resolve(__dirname, '../../tsconfig.json'),
  });

  console.log('✅ Namespace declarations generated successfully!');
  console.log('📄 Output: examples/namespace/dist/library.d.ts');
}

main().catch((error) => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});
