import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { httpGet } from '../http';

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

afterEach(() => {
  return new Promise<void>((resolve) => {
    if (server) {
      server.close(() => resolve());
      server = undefined;
    } else {
      resolve();
    }
  });
});

describe('httpGet', () => {
  it('fetches a 200 response', async () => {
    const url = await createServer((_req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('declare module "test" {}');
    });

    const result = await httpGet(url);
    assert.equal(result.statusCode, 200);
    assert.equal(result.body, 'declare module "test" {}');
  });

  it('follows redirects', async () => {
    let requestCount = 0;
    const url = await createServer((_req, res) => {
      requestCount++;
      if (requestCount === 1) {
        res.writeHead(302, { Location: '/final' });
        res.end();
      } else {
        res.writeHead(200);
        res.end('redirected content');
      }
    });

    const result = await httpGet(url);
    assert.equal(result.statusCode, 200);
    assert.equal(result.body, 'redirected content');
  });

  it('rejects on 404', async () => {
    const url = await createServer((_req, res) => {
      res.writeHead(404);
      res.end();
    });

    await assert.rejects(
      () => httpGet(url),
      (err: Error) => {
        assert.ok(err.message.includes('404'));
        return true;
      },
    );
  });

  it('rejects on 500', async () => {
    const url = await createServer((_req, res) => {
      res.writeHead(500);
      res.end();
    });

    await assert.rejects(
      () => httpGet(url),
      (err: Error) => {
        assert.ok(err.message.includes('500'));
        return true;
      },
    );
  });

  it('rejects on timeout', async () => {
    const url = await createServer((_req, _res) => {
      // Don't respond — let it timeout
    });

    await assert.rejects(() => httpGet(url, { timeout: 100 }), /timed out/i);
  });

  it('rejects on invalid URL', async () => {
    await assert.rejects(() => httpGet('not-a-url'), /Invalid URL/);
  });

  it('rejects on too many redirects', async () => {
    const url = await createServer((_req, res) => {
      res.writeHead(302, { Location: '/' });
      res.end();
    });

    await assert.rejects(() => httpGet(url, { maxRedirects: 2 }), /redirect/i);
  });
});
