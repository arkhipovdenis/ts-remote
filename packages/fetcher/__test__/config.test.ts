import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { readPluginConfig, validateRemotes } from '../config';

function createTempTsconfig(config: object): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ts-remote-test-'));
  const filePath = path.join(dir, 'tsconfig.json');
  fs.writeFileSync(filePath, JSON.stringify(config));
  return filePath;
}

describe('validateRemotes', () => {
  it('accepts valid remotes', () => {
    assert.doesNotThrow(() => {
      validateRemotes({ 'my-app': 'https://cdn.example.com/types.d.ts' });
    });
  });

  it('throws on empty remotes', () => {
    assert.throws(() => validateRemotes({}), /empty/);
  });

  it('throws on invalid URL', () => {
    assert.throws(() => validateRemotes({ app: 'not-a-url' }), /Invalid URL/);
  });

  it('throws on non-http URL', () => {
    assert.throws(() => validateRemotes({ app: 'ftp://example.com/types.d.ts' }), /http/);
  });

  it('accepts http URLs', () => {
    assert.doesNotThrow(() => {
      validateRemotes({ app: 'http://localhost:3000/types.d.ts' });
    });
  });
});

describe('readPluginConfig', () => {
  it('reads valid config from tsconfig.json', () => {
    const filePath = createTempTsconfig({
      compilerOptions: {
        plugins: [
          {
            name: 'ts-remote',
            remotes: { 'my-app': 'https://cdn.example.com/types.d.ts' },
          },
        ],
      },
    });

    const config = readPluginConfig(filePath);
    assert.equal(config.name, 'ts-remote');
    assert.deepStrictEqual(config.remotes, { 'my-app': 'https://cdn.example.com/types.d.ts' });
  });

  it('reads optional cacheDir and cacheTTL', () => {
    const filePath = createTempTsconfig({
      compilerOptions: {
        plugins: [
          {
            name: 'ts-remote',
            remotes: { app: 'https://cdn.example.com/types.d.ts' },
            cacheDir: '.cache',
            cacheTTL: 60000,
          },
        ],
      },
    });

    const config = readPluginConfig(filePath);
    assert.equal(config.cacheDir, '.cache');
    assert.equal(config.cacheTTL, 60000);
  });

  it('throws when no plugins configured', () => {
    const filePath = createTempTsconfig({ compilerOptions: {} });
    assert.throws(() => readPluginConfig(filePath), /No plugins/);
  });

  it('throws when ts-remote plugin not found', () => {
    const filePath = createTempTsconfig({
      compilerOptions: {
        plugins: [{ name: 'other-plugin' }],
      },
    });
    assert.throws(() => readPluginConfig(filePath), /not found/);
  });

  it('throws when remotes field is missing', () => {
    const filePath = createTempTsconfig({
      compilerOptions: {
        plugins: [{ name: 'ts-remote' }],
      },
    });
    assert.throws(() => readPluginConfig(filePath), /missing.*remotes/i);
  });

  it('throws when tsconfig does not exist', () => {
    assert.throws(() => readPluginConfig('/nonexistent/tsconfig.json'), /Failed to read/);
  });
});
