import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import { fetchCommand } from '../commands/fetch';

let tmpDir: string;
let server: http.Server | undefined;

function createServer(handler: http.RequestListener): Promise<string> {
  return new Promise((resolve) => {
    server = http.createServer(handler);
    server.listen(0, '127.0.0.1', () => {
      const addr = server!.address() as { port: number };
      resolve(`http://127.0.0.1:${addr.port}`);
    });
  });
}

function writeTsconfig(
  dir: string,
  remotes: Record<string, string>,
  extra?: Record<string, unknown>,
): string {
  const filePath = path.join(dir, 'tsconfig.json');
  fs.writeFileSync(
    filePath,
    JSON.stringify({
      compilerOptions: {
        plugins: [{ name: 'ts-remote', remotes, ...extra }],
      },
    }),
  );
  return filePath;
}

describe('fetchCommand', () => {
  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ts-remote-cli-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    return new Promise<void>((resolve) => {
      if (server) {
        server.close(() => resolve());
        server = undefined;
      } else {
        resolve();
      }
    });
  });

  it('fetches remote types using config from tsconfig.json', async () => {
    const url = await createServer((_req, res) => {
      res.writeHead(200);
      res.end('declare module "my-app" { export const x: number; }');
    });

    const configPath = writeTsconfig(tmpDir, { 'my-app': url });
    const cacheDir = path.join(tmpDir, '.cache');

    await fetchCommand({ config: configPath, 'cache-dir': cacheDir });

    // Verify files were cached
    const files = fs.readdirSync(cacheDir).filter((f) => f.endsWith('.d.ts'));
    assert.equal(files.length, 1);
    assert.ok(files[0].includes('my-app'));
  });

  it('uses --force to bypass cache', async () => {
    let requestCount = 0;
    const url = await createServer((_req, res) => {
      requestCount++;
      res.writeHead(200);
      res.end(`declare module "my-app" { /* v${requestCount} */ }`);
    });

    const configPath = writeTsconfig(tmpDir, { 'my-app': url });
    const cacheDir = path.join(tmpDir, '.cache');

    await fetchCommand({ config: configPath, 'cache-dir': cacheDir });
    assert.equal(requestCount, 1);

    // With --force, cacheTTL=0 means always re-fetch
    await fetchCommand({ config: configPath, 'cache-dir': cacheDir, force: true });
    assert.equal(requestCount, 2);
  });

  it('fetches multiple remotes', async () => {
    const url = await createServer((req, res) => {
      res.writeHead(200);
      res.end(`declare module "${req.url}" {}`);
    });

    const configPath = writeTsconfig(tmpDir, {
      'app-a': `${url}/a`,
      'app-b': `${url}/b`,
    });
    const cacheDir = path.join(tmpDir, '.cache');

    await fetchCommand({ config: configPath, 'cache-dir': cacheDir });

    const files = fs.readdirSync(cacheDir).filter((f) => f.endsWith('.d.ts'));
    assert.equal(files.length, 2);
  });

  it('throws on missing tsconfig', async () => {
    await assert.rejects(
      () => fetchCommand({ config: path.join(tmpDir, 'nonexistent.json') }),
      /Failed to read/,
    );
  });

  it('throws on tsconfig without ts-remote plugin', async () => {
    const filePath = path.join(tmpDir, 'tsconfig.json');
    fs.writeFileSync(filePath, JSON.stringify({ compilerOptions: {} }));

    await assert.rejects(() => fetchCommand({ config: filePath }), /No plugins/);
  });
});
