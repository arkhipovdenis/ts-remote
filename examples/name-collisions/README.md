# Name Collision Resolution Examples

This example demonstrates how ts-remote automatically handles name collisions between internal (non-exported) types and exported types.

## What Problem Does This Solve?

When building type declarations, you may have internal types in imported modules that have the same names as types exported from the main module:

```typescript
// user.ts (internal module)
type Role = "admin" | "default";  // Internal type, not exported

export class User {
  role: Role;  // Uses internal Role
}

// app.ts (main module)
export type Role = "admin" | "default" | "moderator";  // Exported type
export { User };
```

Without collision resolution, both `Role` types would appear in the output with the same name, causing conflicts.

## How It Works

ts-remote automatically:

1. **Detects** name conflicts between internal and exported types
2. **Renames** internal types with a `_1`, `_2` suffix
3. **Updates** all references to use the renamed types

This happens transparently - you don't need to configure anything!

## Example Output

**Before (with collision):**
```typescript
type Role = "admin" | "default";           // ❌ Conflict!
type Role = "admin" | "default" | "mod";   // ❌ Conflict!
```

**After (collision resolved):**
```typescript
type Role_1 = "admin" | "default";         // ✅ Internal type renamed
class User { role: Role_1; }               // ✅ Reference updated
type Role = "admin" | "default" | "mod";   // ✅ Exported type unchanged
```

## Multiple Files with Same Type Names

ts-remote correctly handles cases where **multiple different files** have types with the **same name**. Each type maintains the correct binding to its source file:

```typescript
// user.ts
type Status = "active" | "inactive";
export class User { status: Status }  // Uses user.ts's Status

// order.ts
type Status = "pending" | "shipped";
export class Order { status: Status }  // Uses order.ts's Status

// main.ts
import { User, Order } from "...";
export { User, Order };
export type Status = "success" | "error";  // Main module's Status
```

**Generated output:**
```typescript
declare module "main" {
  type Status_1 = "active" | "inactive";     // From user.ts
  class User { status: Status_1; }           // ✅ Correct binding

  type Status_2 = "pending" | "shipped";     // From order.ts
  class Order { status: Status_2; }          // ✅ Correct binding

  type Status = "success" | "error";         // Exported from main.ts

  export { User, Order, Status };
}
```

Each `Status` type is uniquely renamed and all references maintain the correct binding to their original type!

## Running the Examples

```bash
ts-node examples/name-collisions/build.ts
```

View the generated output in `dist/collisions.d.ts`.
