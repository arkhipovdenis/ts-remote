/**
 * Main module that exports types with same names as internal types from internal-types.ts
 */
import { Service } from "./internal-types";

// Export types with the SAME names as internal types
export type Status = "pending" | "completed" | "failed";
export interface Config {
  name: string;
  version: number;
}
export class Logger {
  constructor(public name: string) {}
  write(text: string) {}
}
export const CONSTANT = "different value";

// Re-export Service which internally uses the internal types
export { Service };
