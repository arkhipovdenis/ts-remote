/**
 * Main module that exports both User and Role
 * Role here conflicts with internal Role from user.ts
 */
import { User } from "./user";

// This Role type conflicts with the internal Role in user.ts
export type Role = "admin" | "default" | "moderator";

export function createApp() {
  const user = new User("admin");
  return { user };
}

// Re-export User
export { User };