# ts-remote

[![npm version](https://badge.fury.io/js/ts-remote.svg)](https://www.npmjs.com/package/ts-remote)

TypeScript declaration builder for sharing types between independent modules.

Generates consolidated `.d.ts` files from your TypeScript source, making it ideal for microfrontend architectures where independently deployed applications need to share type contracts.

## Features

- 🎯 **Framework-agnostic** — works with any deployment strategy
- 🪶 **Zero dependencies** — only peer dependency on TypeScript
- 📦 **CLI, fetcher & TS plugin** — full toolchain for producing and consuming remote types

## Installation

```bash
npm install -D ts-remote
```

## Quick Start

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

Generated output:

```typescript
declare module "my-app" {
  export interface User {
    id: string;
    name: string;
  }
  export function getUser(id: string): Promise<User>;
}

declare module "utils" {
  export function formatDate(date: Date): string;
}
```

## API

### `build(options: BuilderOptions): Promise<void>`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `entries` | `DeclarationEntry[]` | — | Modules to compile (required) |
| `output.filename` | `string` | `@types/types.d.ts` | Output file path |
| `output.format` | `(result: string) => string \| Promise<string>` | `(x) => x` | Formatter (e.g. prettier) |
| `tsconfig` | `string` | `tsconfig.json` | Path to tsconfig.json |
| `additionalDeclarations` | `string[]` | `[]` | Extra .d.ts files to include |

Each entry:

```typescript
type DeclarationEntry = {
  name: string;
  filename: string;
  variant?: DeclarationVariant; // Module (default) or Namespace
};
```

## Requirements

- TypeScript >= 4.9
- Node.js >= 18

## Links

- [Examples](./examples/README.md)
- [Migration from v1.x](./MIGRATION.md)
- [Contributing](./CONTRIBUTING.md)
- [Changelog](./CHANGELOG.md)

## License

MIT © Denis Arkhipov
