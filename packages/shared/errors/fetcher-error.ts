import { TsRemoteError } from './ts-remote-error';

/**
 * Base error class for fetcher-related errors.
 */
export class FetcherError extends TsRemoteError {
  constructor(message: string, details?: unknown) {
    super(message, 'FETCHER_ERROR', details);
  }
}

/**
 * Error thrown when an HTTP request fails.
 */
export class FetchError extends FetcherError {
  constructor(url: string, statusCode?: number, reason?: string) {
    super(
      statusCode
        ? `HTTP ${statusCode} fetching ${url}${reason ? `: ${reason}` : ''}`
        : `Network error fetching ${url}${reason ? `: ${reason}` : ''}`,
      { url, statusCode },
    );
  }
}

/**
 * Error thrown when cache operations fail.
 */
export class CacheError extends FetcherError {
  constructor(message: string, details?: unknown) {
    super(message, details);
  }
}

/**
 * Error thrown when plugin/fetcher configuration is invalid.
 */
export class ConfigError extends FetcherError {
  constructor(message: string, details?: unknown) {
    super(message, details);
  }
}

/**
 * Error thrown when an HTTP request times out.
 */
export class TimeoutError extends FetcherError {
  constructor(url: string, timeoutMs: number) {
    super(`Request to ${url} timed out after ${timeoutMs}ms`, { url, timeoutMs });
  }
}
