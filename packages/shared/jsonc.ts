/**
 * Minimal JSONC (JSON with comments) parser, enough for `tsconfig.json`:
 * `//` and `/* *\/` comments and trailing commas are stripped, then the
 * result goes through `JSON.parse`.
 *
 * Replaces `ts.readConfigFile` so the fetcher and CLI have no runtime
 * dependency on the TypeScript Compiler API — which the `typescript`
 * package no longer ships as of 7.0.
 */
export function parseJsonc(text: string): unknown {
  return JSON.parse(stripTrailingCommas(stripComments(stripBom(text))));
}

function stripBom(text: string): string {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

function stripComments(text: string): string {
  let out = '';
  let i = 0;

  while (i < text.length) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '"') {
      // Copy the string literal verbatim, honoring escapes
      let j = i + 1;
      while (j < text.length && text[j] !== '"') {
        if (text[j] === '\\') j++;
        j++;
      }
      out += text.slice(i, j + 1);
      i = j + 1;
      continue;
    }

    if (ch === '/' && next === '/') {
      while (i < text.length && text[i] !== '\n') i++;
      continue;
    }

    if (ch === '/' && next === '*') {
      const end = text.indexOf('*/', i + 2);
      // Keep line breaks so JSON.parse error positions stay meaningful
      const skipped = end === -1 ? text.slice(i) : text.slice(i, end + 2);
      out += skipped.replace(/[^\n]/g, '');
      i = end === -1 ? text.length : end + 2;
      continue;
    }

    out += ch;
    i++;
  }

  return out;
}

function stripTrailingCommas(text: string): string {
  let out = '';
  let i = 0;

  while (i < text.length) {
    const ch = text[i];

    if (ch === '"') {
      let j = i + 1;
      while (j < text.length && text[j] !== '"') {
        if (text[j] === '\\') j++;
        j++;
      }
      out += text.slice(i, j + 1);
      i = j + 1;
      continue;
    }

    if (ch === ',') {
      let j = i + 1;
      while (j < text.length && /\s/.test(text[j])) j++;
      if (text[j] === '}' || text[j] === ']') {
        i++;
        continue;
      }
    }

    out += ch;
    i++;
  }

  return out;
}
