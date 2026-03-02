import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseArgs } from '../index';

describe('parseArgs', () => {
  it('parses command from argv', () => {
    const result = parseArgs(['node', 'ts-remote', 'fetch']);
    assert.equal(result.command, 'fetch');
    assert.deepStrictEqual(result.flags, {});
  });

  it('defaults to help when no command given', () => {
    const result = parseArgs(['node', 'ts-remote']);
    assert.equal(result.command, 'help');
  });

  it('parses --flag value as string', () => {
    const result = parseArgs(['node', 'ts-remote', 'fetch', '--config', './tsconfig.json']);
    assert.equal(result.command, 'fetch');
    assert.equal(result.flags['config'], './tsconfig.json');
  });

  it('parses --flag without value as true', () => {
    const result = parseArgs(['node', 'ts-remote', 'fetch', '--force']);
    assert.equal(result.flags['force'], true);
  });

  it('parses multiple flags', () => {
    const result = parseArgs([
      'node',
      'ts-remote',
      'fetch',
      '--config',
      './tsconfig.json',
      '--cache-dir',
      '.cache',
      '--force',
    ]);
    assert.equal(result.command, 'fetch');
    assert.equal(result.flags['config'], './tsconfig.json');
    assert.equal(result.flags['cache-dir'], '.cache');
    assert.equal(result.flags['force'], true);
  });

  it('treats --flag followed by another --flag as boolean', () => {
    const result = parseArgs(['node', 'ts-remote', 'fetch', '--force', '--verbose']);
    assert.equal(result.flags['force'], true);
    assert.equal(result.flags['verbose'], true);
  });
});
