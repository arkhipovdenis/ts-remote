/**
 * Build script to demonstrate name collision handling
 */
import build from '../../packages/builder/build';
import path from 'path';

async function main() {
  await build({
    entries: [
      {
        name: 'app',
        filename: path.resolve(__dirname, 'src/app.ts'),
      },
      {
        name: 'complex-collisions',
        filename: path.resolve(__dirname, 'src/complex-collisions.ts'),
      },
      {
        name: 'complex-collisions-v2',
        filename: path.resolve(__dirname, 'src/complex-collisions-v2.ts'),
      },
      {
        name: 'advanced-collisions',
        filename: path.resolve(__dirname, 'src/advanced-collisions.ts'),
      },
      {
        name: 'extreme-collisions',
        filename: path.resolve(__dirname, 'src/extreme-collisions.ts'),
      },
      {
        name: 'multiple-sources',
        filename: path.resolve(__dirname, 'src/multiple-sources-main.ts'),
      },
      {
        name: 'namespace-test',
        filename: path.resolve(__dirname, 'src/namespace-test.ts'),
      },
      {
        name: 'namespace-export-test',
        filename: path.resolve(__dirname, 'src/namespace-export-test.ts'),
      },
    ],
    output: {
      filename: path.resolve(__dirname, 'dist/collisions.d.ts'),
    },
    tsconfig: path.resolve(__dirname, '../../tsconfig.json'),
  });

  console.log('✅ Name collision test declarations generated!');
  console.log('📄 Output: examples/name-collisions/dist/collisions.d.ts');
}

main().catch((error) => {
  console.error('❌ Build failed:', error);
  console.error(error.stack);
  process.exit(1);
});