import { describe, it, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import fetchRemotes from '../fetch';
import { LogLevel } from '../../shared/logger';

let server: http.Server | undefined;
let tmpDir: string;

function createServer(handler: http.RequestListener): Promise<string> {
  return new Promise((resolve) => {
    server = http.createServer(handler);
    server.listen(0, '127.0.0.1', () => {
      const addr = server!.address() as { port: number };
      resolve(`http://127.0.0.1:${addr.port}`);
    });
  });
}

describe('fetchRemotes', () => {
  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ts-remote-fetch-'));
  });

  afterEach(() => {
    return new Promise<void>((resolve) => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
      if (server) {
        server.close(() => resolve());
        server = undefined;
      } else {
        resolve();
      }
    });
  });

  it('fetches remote and caches to disk', async () => {
    const url = await createServer((_req, res) => {
      res.writeHead(200);
      res.end('declare module "my-app" { export const version: string; }');
    });

    const results = await fetchRemotes({
      remotes: { 'my-app': url },
      cacheDir: tmpDir,
      logLevel: LogLevel.Silent,
    });

    assert.equal(results.length, 1);
    assert.equal(results[0].name, 'my-app');
    assert.equal(results[0].fromCache, false);
    assert.ok(fs.existsSync(results[0].cachedPath));
    assert.equal(
      fs.readFileSync(results[0].cachedPath, 'utf-8'),
      'declare module "my-app" { export const version: string; }',
    );
  });

  it('serves from cache on second call', async () => {
    let requestCount = 0;
    const url = await createServer((_req, res) => {
      requestCount++;
      res.writeHead(200);
      res.end('declare module "my-app" {}');
    });

    await fetchRemotes({
      remotes: { 'my-app': url },
      cacheDir: tmpDir,
      cacheTTL: Infinity,
      logLevel: LogLevel.Silent,
    });

    const results = await fetchRemotes({
      remotes: { 'my-app': url },
      cacheDir: tmpDir,
      cacheTTL: Infinity,
      logLevel: LogLevel.Silent,
    });

    assert.equal(results[0].fromCache, true);
    assert.equal(requestCount, 1);
  });

  it('re-fetches when cacheTTL is 0 (force)', async () => {
    let requestCount = 0;
    const url = await createServer((_req, res) => {
      requestCount++;
      res.writeHead(200);
      res.end(`version ${requestCount}`);
    });

    await fetchRemotes({
      remotes: { 'my-app': url },
      cacheDir: tmpDir,
      logLevel: LogLevel.Silent,
    });

    const results = await fetchRemotes({
      remotes: { 'my-app': url },
      cacheDir: tmpDir,
      cacheTTL: 0,
      logLevel: LogLevel.Silent,
    });

    assert.equal(results[0].fromCache, false);
    assert.equal(requestCount, 2);
  });

  it('fetches multiple remotes', async () => {
    const url = await createServer((req, res) => {
      res.writeHead(200);
      res.end(`types for ${req.url}`);
    });

    const results = await fetchRemotes({
      remotes: {
        'app-a': `${url}/a`,
        'app-b': `${url}/b`,
      },
      cacheDir: tmpDir,
      logLevel: LogLevel.Silent,
    });

    assert.equal(results.length, 2);
    assert.equal(results[0].name, 'app-a');
    assert.equal(results[1].name, 'app-b');
  });

  it('throws on invalid remotes', async () => {
    await assert.rejects(
      () => fetchRemotes({ remotes: {}, cacheDir: tmpDir, logLevel: LogLevel.Silent }),
      /empty/,
    );
  });

  it('does not retry on 4xx errors', async () => {
    let requestCount = 0;
    const url = await createServer((_req, res) => {
      requestCount++;
      res.writeHead(404);
      res.end();
    });

    await assert.rejects(
      () =>
        fetchRemotes({
          remotes: { 'my-app': url },
          cacheDir: tmpDir,
          retries: 2,
          logLevel: LogLevel.Silent,
        }),
      /404/,
    );

    assert.equal(requestCount, 1);
  });
});
