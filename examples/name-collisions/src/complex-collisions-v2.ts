/**
 * Main module that exports types with same names as internal types
 */
import { Service } from "./internal-types-v2";

// Export types with the SAME names as internal types
export type Status = "pending" | "completed" | "failed";
export type Config = {
  name: string;
  version: number;
};
export type Logger = {
  write: (text: string) => void;
};
export type CONSTANT = "different value";

// Re-export Service which internally uses the internal types
export { Service };
