/**
 * Internal module with Role type used internally
 */
type Role = "admin" | "default";

export class User {
  role: Role;

  constructor(role: Role) {
    this.role = role;
  }
}