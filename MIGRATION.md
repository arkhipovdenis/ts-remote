# Migration Guide: v1.x → v2.0

This guide helps you migrate from ts-remote v1.x to v2.0.

## Overview

v2.0 is a complete rewrite focused on:
- **Performance**: 3-5x faster builds
- **Tree-shaking**: Smaller output bundles
- **Better API**: More intuitive and type-safe
- **More features**: Advanced TypeScript constructs support

## Breaking Changes

### 1. Import Path Changed

```diff
- import { compiler } from 'ts-remote/compiler';
+ import build from 'ts-remote/builder';
```

### 2. Function Name Changed

```diff
- compiler({ ... });
+ await build({ ... });
```

Note: `build()` is now async and returns a Promise.

### 3. API Structure Changed

**v1.x API:**
```typescript
compiler({
  moduleList: {
    'my-app': './src/index.ts',
    'utils': './src/utils.ts',
  },
  outDir: './dist',
  outFileName: 'types.d.ts',
  tsConfigPath: './tsconfig.json',
});
```

**v2.0 API:**
```typescript
await build({
  entries: [
    { name: 'my-app', filename: './src/index.ts' },
    { name: 'utils', filename: './src/utils.ts' },
  ],
  output: {
    filename: './dist/types.d.ts',
  },
  tsconfig: './tsconfig.json',
});
```

### 4. Configuration Changes

| v1.x | v2.0 | Notes |
|------|------|-------|
| `moduleList` | `entries` | Now an array of objects |
| `outDir` + `outFileName` | `output.filename` | Combined into single path |
| `tsConfigPath` | `tsconfig` | Renamed for consistency |
| N/A | `output.format` | New: custom formatting function |
| N/A | `additionalDeclarations` | New: include global `.d.ts` files |
| N/A | `variant` | New: namespace vs module declarations |

## Step-by-Step Migration

### Step 1: Update Dependencies

```bash
npm install ts-remote@^2.0.0
```

### Step 2: Update Imports

```typescript
// Before
import { compiler } from 'ts-remote/compiler';

// After
import build from 'ts-remote/builder';
```

### Step 3: Transform Configuration

```typescript
// Before
compiler({
  moduleList: {
    'app': './src/app.ts',
    'shared': './src/shared.ts',
  },
  outDir: './types',
  outFileName: 'remote.d.ts',
  tsConfigPath: './tsconfig.json',
});

// After
await build({
  entries: [
    { name: 'app', filename: './src/app.ts' },
    { name: 'shared', filename: './src/shared.ts' },
  ],
  output: {
    filename: './types/remote.d.ts',
  },
  tsconfig: './tsconfig.json',
});
```

### Step 4: Make Function Async

Since `build()` is async, wrap it in an async function or use `.then()`:

```typescript
// Option 1: Async function
async function generateTypes() {
  await build({ ... });
}

// Option 2: Top-level await (Node 14.8+)
await build({ ... });

// Option 3: Promise chain
build({ ... }).then(() => {
  console.log('Types generated!');
});
```

## New Features in v2.0

### 1. Namespace Declarations

```typescript
import { DeclarationVariant } from 'ts-remote/builder';

await build({
  entries: [
    {
      name: 'MyLib',
      filename: './src/index.ts',
      variant: DeclarationVariant.Namespace, // Creates: declare namespace MyLib { ... }
    },
  ],
});
```

### 2. Custom Output Formatting

```typescript
await build({
  entries: [...],
  output: {
    filename: './dist/types.d.ts',
    format: (result) => {
      // Format with Prettier
      const prettier = require('prettier');
      return prettier.format(result, { parser: 'typescript' });
    },
  },
});
```

### 3. Additional Declarations

```typescript
await build({
  entries: [...],
  additionalDeclarations: [
    './src/global.d.ts',
    './src/env.d.ts',
  ],
});
```

## Removed Features

### Loader Package

The `loader` package has been removed from ts-remote v2.0. If you were using it:

```typescript
// This is removed
import { loader } from 'ts-remote/loader';
```

**Alternative**: Use standard HTTP fetch or file system operations to load the generated `.d.ts` files.

## Performance Improvements

No action needed - your builds should automatically be 3-5x faster due to:
- Shared TypeScript compiler host
- Optimized module resolution cache
- Single-pass AST transformation

## Troubleshooting

### "Cannot find module 'ts-remote/builder'"

Make sure you:
1. Installed v2.0: `npm install ts-remote@^2.0.0`
2. Updated import path: `import build from 'ts-remote/builder'`

### "entries is not defined"

You're still using v1.x API. Update `moduleList` to `entries` with object format:

```typescript
// Wrong (v1.x)
{ moduleList: { 'name': 'path' } }

// Correct (v2.0)
{ entries: [{ name: 'name', filename: 'path' }] }
```

### Build errors with complex types

v2.0 supports more TypeScript constructs. If you encounter issues:
1. Check [GitHub Issues](https://github.com/arkhipovdenis/ts-remote/issues)
2. Report with a minimal reproduction

## Questions?

- 📖 [Full Documentation](./README.md)
- 🐛 [Report Issues](https://github.com/arkhipovdenis/ts-remote/issues)
- 💬 [Discussions](https://github.com/arkhipovdenis/ts-remote/discussions)
