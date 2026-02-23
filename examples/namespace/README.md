# Namespace Example

This example demonstrates using the namespace variant for library-style type declarations.

## Files

- `src/library.ts` - A library module to be exposed as a namespace
- `build.ts` - Build script that generates namespace declarations

## Running the Example

```bash
# From the project root
npm run build

# Run the example
ts-node examples/namespace/build.ts
```

## Expected Output

The build script generates `dist/library.d.ts` containing:

```typescript
declare namespace MyLibrary {
  export interface Config {
    apiUrl: string;
    timeout: number;
    retries: number;
  }

  export class HttpClient {
    constructor(config: Config);
    get<T>(url: string): Promise<T>;
    post<T>(url: string, data: unknown): Promise<T>;
  }

  export const VERSION = "1.0.0";
}
```

## Use Case

Namespace declarations are useful when:
- You're creating a library consumed via CDN (e.g., `<script src="my-library.js"></script>`)
- You want to expose a global namespace (e.g., `window.MyLibrary`)
- You need jQuery-style plugin patterns

The consumer can then use it like:

```typescript
/// <reference path="./library.d.ts" />

const client = new MyLibrary.HttpClient({
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3,
});
```
