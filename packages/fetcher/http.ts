import https from 'node:https';
import http from 'node:http';
import { FetchError, TimeoutError } from '../shared/errors';

export type HttpGetResult = {
  statusCode: number;
  body: string;
  headers: Record<string, string | string[] | undefined>;
};

export type HttpGetOptions = {
  timeout?: number;
  maxRedirects?: number;
};

const DEFAULT_TIMEOUT = 10_000;
const DEFAULT_MAX_REDIRECTS = 5;
const REDIRECT_CODES = new Set([301, 302, 307, 308]);

/**
 * Perform an HTTP(S) GET request.
 *
 * Follows redirects (301/302/307/308) up to `maxRedirects`.
 * Enforces a timeout on the entire request lifecycle.
 */
export function httpGet(url: string, options: HttpGetOptions = {}): Promise<HttpGetResult> {
  const timeout = options.timeout ?? DEFAULT_TIMEOUT;
  const maxRedirects = options.maxRedirects ?? DEFAULT_MAX_REDIRECTS;

  return doRequest(url, timeout, maxRedirects);
}

function doRequest(
  url: string,
  timeout: number,
  remainingRedirects: number,
): Promise<HttpGetResult> {
  return new Promise((resolve, reject) => {
    let parsedUrl: URL;

    try {
      parsedUrl = new URL(url);
    } catch {
      reject(new FetchError(url, undefined, 'Invalid URL'));
      return;
    }

    const client = parsedUrl.protocol === 'https:' ? https : http;

    const req = client.get(url, (res) => {
      const statusCode = res.statusCode ?? 0;

      // Handle redirects
      if (REDIRECT_CODES.has(statusCode)) {
        const location = res.headers.location;

        if (!location) {
          reject(new FetchError(url, statusCode, 'Redirect without Location header'));
          return;
        }

        if (remainingRedirects <= 0) {
          reject(new FetchError(url, statusCode, 'Too many redirects'));
          return;
        }

        // Resolve relative URLs against the current URL
        const redirectUrl = new URL(location, url).href;

        // Consume the response body to free up the socket
        res.resume();

        doRequest(redirectUrl, timeout, remainingRedirects - 1).then(resolve, reject);
        return;
      }

      // Reject on client/server errors
      if (statusCode >= 400) {
        res.resume();
        reject(new FetchError(url, statusCode));
        return;
      }

      // Collect response body
      const chunks: Buffer[] = [];

      res.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        resolve({
          statusCode,
          body: Buffer.concat(chunks).toString('utf-8'),
          headers: res.headers as Record<string, string | string[] | undefined>,
        });
      });

      res.on('error', (err) => {
        reject(new FetchError(url, undefined, err.message));
      });
    });

    req.on('error', (err) => {
      reject(new FetchError(url, undefined, err.message));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new TimeoutError(url, timeout));
    });

    req.setTimeout(timeout);
  });
}
