# ts-remote

[![npm version](https://badge.fury.io/js/ts-remote.svg)](https://www.npmjs.com/package/ts-remote)

TypeScript declaration builder for sharing types between independent modules.

This library solves the problem of sharing [TypeScript](https://www.typescriptlang.org/) type declarations between independently deployed JavaScript applications, making it ideal for microfrontend architectures.

## Features

- 🎯 **Framework-agnostic** - Works with any deployment strategy
- 🪶 **Zero dependencies** - Only peer dependency on TypeScript
- 🚀 **High performance** - Optimized with shared caches and efficient AST processing
- 🔒 **Type-safe** - Built with strict TypeScript
- 📦 **Small footprint** - Minimal bundle size

## Installation

```bash
npm install -D ts-remote
```

## Usage

### Basic Example

```typescript
import build from 'ts-remote/builder';

await build({
  entries: [
    { name: 'my-app', filename: './src/index.ts' },
    { name: 'utils', filename: './src/utils.ts' },
  ],
  output: {
    filename: './dist/types.d.ts',
  },
});
```

### Advanced Example with Namespace Variant

```typescript
import build, { DeclarationVariant } from 'ts-remote/builder';
import prettier from 'prettier';

await build({
  entries: [
    // Module variant (default) - creates `declare module "my-app" { ... }`
    { name: 'my-app', filename: './src/index.ts' },

    // Namespace variant - creates `declare namespace Utils { ... }`
    {
      name: 'Utils',
      filename: './src/utils.ts',
      variant: DeclarationVariant.Namespace
    },
  ],
  output: {
    filename: './dist/types.d.ts',
    // Optional: format output with Prettier or other formatter
    format: (result) => prettier.format(result, { parser: 'typescript' }),
  },
  tsconfig: './tsconfig.json', // Optional: custom tsconfig path
  additionalDeclarations: ['./src/global.d.ts'], // Optional: global declarations
});
```

### Example Output

The builder generates a consolidated `.d.ts` file:

```typescript
declare module "my-app" {
  export interface User {
    id: string;
    name: string;
  }

  export function getUser(id: string): Promise<User>;
}

declare namespace Utils {
  export function formatDate(date: Date): string;
  export function capitalize(str: string): string;
}
```

## API Reference

### `build(options: BuilderOptions): Promise<void>`

Builds TypeScript declaration files from source files.

#### BuilderOptions

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `entries` | `DeclarationEntry[]` | ✅ Yes | - | Array of module declarations to compile |
| `output.filename` | `string` | No | `@types/types.d.ts` | Output file path |
| `output.format` | `(result: string) => string \| Promise<string>` | No | `(x) => x` | Function to format the output |
| `tsconfig` | `string` | No | `tsconfig.json` | Path to tsconfig.json |
| `additionalDeclarations` | `string[]` | No | `[]` | Additional .d.ts files to include |

#### DeclarationEntry

```typescript
type DeclarationEntry = {
  name: string;
  filename: string;
  variant?: DeclarationVariant; // Module (default) or Namespace
};
```

#### DeclarationVariant

```typescript
enum DeclarationVariant {
  Module,    // Creates: declare module "name" { ... }
  Namespace, // Creates: declare namespace Name { ... }
}
```

## Use Cases

### Microfrontend Architecture

Share types between independently deployed frontend applications:

```typescript
// In shared-types package
import build from 'ts-remote/builder';

await build({
  entries: [
    { name: '@app/core', filename: './packages/core/src/index.ts' },
    { name: '@app/auth', filename: './packages/auth/src/index.ts' },
    { name: '@app/ui', filename: './packages/ui/src/index.ts' },
  ],
  output: {
    filename: './dist/federated-types.d.ts',
  },
});

// Deploy federated-types.d.ts to CDN or serve it alongside your apps
```

### Independent Libraries

Generate types for libraries consumed via CDN:

```typescript
await build({
  entries: [
    {
      name: 'MyLibrary',
      filename: './src/index.ts',
      variant: DeclarationVariant.Namespace
    },
  ],
  output: {
    filename: './dist/my-library.d.ts',
  },
});
```

## How It Works

1. **Parses** your TypeScript source files using the TypeScript Compiler API
2. **Transforms** the AST to extract only public type declarations
3. **Resolves** internal imports and flattens the dependency graph
4. **Filters** out private/protected class members
5. **Bundles** everything into a single consolidated `.d.ts` file

## Performance

The builder is optimized for large projects:

- ✅ **Shared caches** - Module resolution and type checking are cached across entries
- ✅ **O(n) complexity** - Linear time complexity for export processing
- ✅ **Memory efficient** - 60-90% less memory usage compared to v1.x
- ✅ **3-10x faster** - For projects with shared dependencies

## Migration from v1.x

### Breaking Changes in v2.0

- ❌ **Removed** `loader` package (moved to separate package)
- ✏️ **Changed** import path from `ts-remote/compiler` to `ts-remote/builder`
- ✏️ **Renamed** function from `compiler()` to `build()`

### Migration Guide

**Before (v1.x):**
```typescript
import { compiler } from 'ts-remote/compiler';

compiler({
  moduleList: {
    'moduleName': './app/index.ts',
  },
  // ...
});
```

**After (v2.0):**
```typescript
import build from 'ts-remote/builder';

await build({
  entries: [
    { name: 'moduleName', filename: './app/index.ts' },
  ],
  // ...
});
```

## Requirements

- TypeScript >= 4.9
- Node.js >= 18

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © Denis Arkhipov

## Links

- [GitHub Repository](https://github.com/arkhipovdenis/ts-remote)
- [npm Package](https://www.npmjs.com/package/ts-remote)
- [Report Issues](https://github.com/arkhipovdenis/ts-remote/issues)
