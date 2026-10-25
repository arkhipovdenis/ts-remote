import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseJsonc } from '../jsonc';

describe('parseJsonc', () => {
  it('parses plain JSON', () => {
    assert.deepEqual(parseJsonc('{"a": [1, "b", null]}'), { a: [1, 'b', null] });
  });

  it('strips line and block comments', () => {
    const text = `{
      // line comment
      "a": 1, /* inline */ "b": "x",
      /* multi
         line */
      "c": true
    }`;
    assert.deepEqual(parseJsonc(text), { a: 1, b: 'x', c: true });
  });

  it('strips trailing commas in objects and arrays', () => {
    assert.deepEqual(parseJsonc('{"a": [1, 2, ], "b": {"c": 1,},}'), { a: [1, 2], b: { c: 1 } });
  });

  it('leaves comment-like and comma sequences inside strings alone', () => {
    const text =
      '{"url": "https://cdn.example.com/types.d.ts", "s": "a, /* b */ // c", "e": "q\\"x"}';
    assert.deepEqual(parseJsonc(text), {
      url: 'https://cdn.example.com/types.d.ts',
      s: 'a, /* b */ // c',
      e: 'q"x',
    });
  });

  it('ignores a leading BOM', () => {
    assert.deepEqual(parseJsonc('﻿{"a": 1}'), { a: 1 });
  });

  it('throws on malformed input', () => {
    assert.throws(() => parseJsonc('{"a": }'));
  });
});
