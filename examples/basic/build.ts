/**
 * Build script for generating type declarations
 */
import build from '../../packages/builder/build';
import path from 'path';
import prettier from 'prettier';

async function main() {
  await build({
    entries: [
      { name: 'my-app', filename: path.resolve(__dirname, 'src/index.ts') },
      { name: 'utils', filename: path.resolve(__dirname, 'src/utils.ts') },
    ],
    output: {
      filename: path.resolve(__dirname, 'dist/types.d.ts'),
      format: (result) => prettier.format(result, { parser: 'typescript' }),
    },
    tsconfig: path.resolve(__dirname, '../../tsconfig.json'),
  });

  console.log('✅ Type declarations generated successfully!');
  console.log('📄 Output: examples/basic/dist/types.d.ts');
}

main().catch((error) => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});
