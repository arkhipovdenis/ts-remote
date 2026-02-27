/**
 * Utility module with types to be imported as namespace
 */
export type Status = "loading" | "ready" | "error";
export type Config = {
  timeout: number;
  retries: number;
};

export function createStatus(): Status {
  return "ready";
}

export function createConfig(): Config {
  return { timeout: 1000, retries: 3 };
}
