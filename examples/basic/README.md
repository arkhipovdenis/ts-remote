# Basic Example

This example demonstrates the basic usage of ts-remote builder.

## Files

- `src/index.ts` - Main application with User types and functions
- `src/utils.ts` - Utility functions
- `build.ts` - Build script that generates type declarations

## Running the Example

```bash
# From the project root
npm run build

# Run the example
ts-node examples/basic/build.ts
```

## Expected Output

The build script generates `dist/types.d.ts` containing:

```typescript
declare module "my-app" {
  export interface User {
    id: string;
    name: string;
    email: string;
  }

  export function getUser(id: string): Promise<User>;
  export function createUser(name: string, email: string): User;
}

declare module "utils" {
  export function formatDate(date: Date): string;
  export function capitalize(str: string): string;
  export function debounce<T extends (...args: unknown[]) => unknown>(
    fn: T,
    delay: number
  ): (...args: Parameters<T>) => void;
}
```

## Use Case

This pattern is useful when you want to share type definitions from your application
with other independent applications or micro-frontends that consume your module.
