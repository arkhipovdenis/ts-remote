'use strict';
// Runtime half of `./typescript.d.ts`: resolves the Compiler API once, with a
// fallback to `@typescript/typescript6` under TypeScript 7. Kept as plain JS so
// the module can carry both the value and the `ts.*` type namespace.
module.exports = require('./load-typescript').loadTypeScript();
