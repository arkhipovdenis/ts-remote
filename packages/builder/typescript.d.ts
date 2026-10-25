// Type-level view of `./typescript.js`: the builder imports the Compiler API
// from here instead of from 'typescript' directly, so the runtime can fall
// back to `@typescript/typescript6` when `typescript@7` (no JS API) is installed.
// See `./load-typescript.ts`.
import ts = require('typescript');
export = ts;
