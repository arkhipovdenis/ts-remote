# ts-remote Examples

This directory contains example projects demonstrating different use cases of ts-remote.

## Available Examples

### [basic/](./basic/)
**Basic module declarations**

Demonstrates the most common usage pattern with multiple modules.

- Multiple entry points
- Module variant (default)
- Typical microfrontend setup

```bash
ts-node examples/basic/build.ts
```

### [namespace/](./namespace/)
**Namespace declarations**

Shows how to generate namespace-style declarations for libraries.

- Single entry point
- Namespace variant
- Global/CDN library pattern

```bash
ts-node examples/namespace/build.ts
```

### [comprehensive/](./comprehensive/)
**Comprehensive TypeScript syntax coverage**

Test suite covering all possible TypeScript constructs and SyntaxKind nodes.

- All declaration types (variables, functions, classes)
- All type forms (interfaces, type aliases, enums)
- Advanced types (conditional, mapped, template literal)
- Generics with constraints
- All modifiers (access control, readonly, async, static)
- Perfect for testing and validation

```bash
ts-node examples/comprehensive/build.ts
```

## Running All Examples

```bash
# From project root
npm run build

# Run all examples
ts-node examples/basic/build.ts
ts-node examples/namespace/build.ts
ts-node examples/comprehensive/build.ts
```

## Creating Your Own

To create a new project using ts-remote:

1. Install the package:
```bash
npm install -D ts-remote
```

2. Create a build script:
```typescript
import build from 'ts-remote/builder';

await build({
  entries: [
    ['my-module', { filename: './src/index.ts' }],
  ],
  output: {
    filename: './dist/types.d.ts',
  },
});
```

3. Run the build:
```bash
ts-node build.ts
```

## Common Patterns

### Microfrontend Architecture

```typescript
await build({
  entries: [
    ['@app/core', { filename: './packages/core/src/index.ts' }],
    ['@app/auth', { filename: './packages/auth/src/index.ts' }],
    ['@app/ui', { filename: './packages/ui/src/index.ts' }],
  ],
  output: {
    filename: './dist/federated-types.d.ts',
  },
});
```

### With Prettier Formatting

```typescript
import build from 'ts-remote/builder';
import prettier from 'prettier';

await build({
  entries: [['my-app', { filename: './src/index.ts' }]],
  output: {
    filename: './dist/types.d.ts',
    format: (result) => prettier.format(result, { parser: 'typescript' }),
  },
});
```

### With Custom TypeScript Config

```typescript
await build({
  entries: [['my-app', { filename: './src/index.ts' }]],
  tsconfig: './tsconfig.build.json',
  output: {
    filename: './dist/types.d.ts',
  },
});
```
