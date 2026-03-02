import path from 'node:path';
import process from 'node:process';
import { FetcherOptions, FetchResult } from './contract-public';
import { CacheManager } from './cache';
import { httpGet } from './http';
import { validateRemotes } from './config';
import { Logger, LogLevel } from '../shared/logger';
import { FetchError } from '../shared/errors';

const DEFAULT_CACHE_DIR = 'node_modules/.ts-remote';
const DEFAULT_CACHE_TTL = 300_000; // 5 minutes
const DEFAULT_RETRIES = 2;
const DEFAULT_TIMEOUT = 10_000; // 10 seconds

/**
 * Fetch remote `.d.ts` files and cache them locally.
 *
 * Downloads declaration files from the configured URLs and stores them
 * in a local cache directory for use by the TS Language Service Plugin
 * or direct consumption.
 *
 * @example
 * ```typescript
 * import fetch from 'ts-remote/fetcher';
 *
 * const results = await fetch({
 *   remotes: {
 *     'my-app': 'https://cdn.example.com/types.d.ts',
 *   },
 * });
 *
 * console.log(results[0].cachedPath); // node_modules/.ts-remote/my-app.d.ts
 * ```
 */
export default async function fetchRemotes(options: FetcherOptions): Promise<FetchResult[]> {
  const {
    remotes,
    cacheDir = path.resolve(process.cwd(), DEFAULT_CACHE_DIR),
    cacheTTL = DEFAULT_CACHE_TTL,
    retries = DEFAULT_RETRIES,
    timeout = DEFAULT_TIMEOUT,
    logLevel = LogLevel.Info,
  } = options;

  validateRemotes(remotes);

  const logger = new Logger(logLevel);
  const cache = new CacheManager(cacheDir, logger);
  const results: FetchResult[] = [];

  for (const [name, url] of Object.entries(remotes)) {
    // Check cache first
    const cached = cache.get(name, cacheTTL);

    if (cached) {
      logger.info(`${name}: using cached version`, { path: cached.filePath });
      results.push({
        name,
        url,
        cachedPath: cached.filePath,
        fromCache: true,
      });
      continue;
    }

    // Fetch with retries
    const body = await fetchWithRetries(url, { retries, timeout, logger, name });

    // Write to cache
    const entry = cache.set(name, body);

    logger.info(`${name}: fetched and cached`, { url, path: entry.filePath });
    results.push({
      name,
      url,
      cachedPath: entry.filePath,
      fromCache: false,
    });
  }

  return results;
}

async function fetchWithRetries(
  url: string,
  options: { retries: number; timeout: number; logger: Logger; name: string },
): Promise<string> {
  const { retries, timeout, logger, name } = options;
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = 500 * Math.pow(2, attempt - 1); // 500ms, 1000ms, ...
        logger.debug(`${name}: retry ${attempt}/${retries} after ${delay}ms`);
        await sleep(delay);
      }

      const result = await httpGet(url, { timeout });
      return result.body;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      // Don't retry on 4xx errors (client errors)
      if (err instanceof FetchError && (err.details as { statusCode?: number })?.statusCode) {
        const statusCode = (err.details as { statusCode: number }).statusCode;
        if (statusCode >= 400 && statusCode < 500) {
          throw err;
        }
      }

      logger.debug(`${name}: attempt ${attempt + 1} failed: ${lastError.message}`);
    }
  }

  throw lastError!;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
