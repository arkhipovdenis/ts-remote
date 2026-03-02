import { LogLevel } from '../shared/logger';

/**
 * A map of module names to their remote `.d.ts` URLs.
 *
 * Keys are the module names used in `declare module "name"`.
 * Values are HTTP(S) URLs pointing to `.d.ts` files.
 */
export type RemoteMap = Record<string, string>;

/**
 * Options for the fetcher.
 */
export type FetcherOptions = {
  /**
   * Map of remote module name to URL.
   *
   * @example
   * ```typescript
   * {
   *   "my-app": "https://cdn.example.com/@types/types.d.ts",
   *   "@shared/ui": "https://assets.example.com/shared-ui/types.d.ts"
   * }
   * ```
   */
  remotes: RemoteMap;

  /**
   * Directory for cached `.d.ts` files.
   * @default "node_modules/.ts-remote/"
   */
  cacheDir?: string;

  /**
   * Cache TTL in milliseconds.
   * Cached files older than this will be re-fetched.
   * Set to `0` to always re-fetch. Set to `Infinity` to never re-fetch.
   * @default 300_000 (5 minutes)
   */
  cacheTTL?: number;

  /**
   * Number of retry attempts on HTTP failure.
   * @default 2
   */
  retries?: number;

  /**
   * Timeout for each HTTP request in milliseconds.
   * @default 10_000 (10 seconds)
   */
  timeout?: number;

  /**
   * Log level for output verbosity.
   * @default LogLevel.Info
   */
  logLevel?: LogLevel;
};

/**
 * Result of fetching a single remote.
 */
export type FetchResult = {
  /** The module name */
  name: string;
  /** The URL it was fetched from */
  url: string;
  /** The local path where the `.d.ts` is cached */
  cachedPath: string;
  /** Whether it was served from cache (true) or freshly fetched (false) */
  fromCache: boolean;
};

/**
 * Configuration as read from the tsconfig.json plugins section.
 */
export type TsRemotePluginConfig = {
  name: 'ts-remote';
  remotes: RemoteMap;
  cacheDir?: string;
  cacheTTL?: number;
};
