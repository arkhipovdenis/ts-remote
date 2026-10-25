import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import realTs from 'typescript';
import { FALLBACK_PACKAGE, hasCompilerApi, loadTypeScript } from '../load-typescript';

/** What `require('typescript')` resolves to under TypeScript 7. */
const ts7Stub = { version: '7.0.2', versionMajorMinor: '7.0' };

function fakeRequire(modules: Record<string, unknown>) {
  return (id: string) => {
    if (!(id in modules)) {
      const err = new Error(`Cannot find module '${id}'`) as Error & { code: string };
      err.code = 'MODULE_NOT_FOUND';
      throw err;
    }
    return modules[id];
  };
}

describe('hasCompilerApi', () => {
  it('recognises the real Compiler API', () => {
    assert.equal(hasCompilerApi(realTs), true);
  });

  it('rejects the TypeScript 7 stub and non-objects', () => {
    assert.equal(hasCompilerApi(ts7Stub), false);
    assert.equal(hasCompilerApi(undefined), false);
    assert.equal(hasCompilerApi('typescript'), false);
  });
});

describe('loadTypeScript', () => {
  it('returns typescript when it ships the Compiler API', () => {
    const loaded = loadTypeScript(fakeRequire({ typescript: realTs }));
    assert.equal(loaded, realTs);
  });

  it('falls back to @typescript/typescript6 under TypeScript 7', () => {
    const loaded = loadTypeScript(fakeRequire({ typescript: ts7Stub, [FALLBACK_PACKAGE]: realTs }));
    assert.equal(loaded, realTs);
  });

  it('explains how to fix TypeScript 7 without the fallback package', () => {
    assert.throws(
      () => loadTypeScript(fakeRequire({ typescript: ts7Stub })),
      (err: Error) =>
        /typescript@7\.0\.2 does not ship the JavaScript Compiler API/.test(err.message) &&
        err.message.includes(`npm install -D ${FALLBACK_PACKAGE}`),
    );
  });

  it('explains how to fix a missing typescript', () => {
    assert.throws(
      () => loadTypeScript(fakeRequire({})),
      /Cannot find module 'typescript'.*install typescript@4\.9/,
    );
  });

  it('uses the real module resolution by default', () => {
    assert.equal(loadTypeScript(), realTs);
  });
});
