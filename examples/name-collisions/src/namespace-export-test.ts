/**
 * Test export * as namespace syntax with collision resolution
 */
import { Service } from "./namespace-export-internal";

// Re-export Service
export { Service };

// Export namespace using export * as syntax
export * as Utils from "./namespace-utils";

// Export own Status that collides with internal
export type Status = "success" | "failure";

// Export own Config that collides with namespace
export type Config = {
  apiKey: string;
};
