import type * as TS from 'typescript';
import { BuilderError } from '../shared/errors';

/**
 * TypeScript 6 compatibility package published by the TypeScript team for
 * tools that still need the JavaScript Compiler API after 7.0.
 */
export const FALLBACK_PACKAGE = '@typescript/typescript6';

export type RequireFn = (id: string) => unknown;

/**
 * Whether a loaded module is the classic JavaScript Compiler API the builder
 * is written against. `typescript@7` resolves to a stub that only exposes
 * `version`/`versionMajorMinor`, so the check looks for the functions the
 * builder actually calls.
 */
export function hasCompilerApi(mod: unknown): mod is typeof TS {
  if (typeof mod !== 'object' || mod === null) {
    return false;
  }

  const api = mod as Partial<typeof TS>;

  return (
    typeof api.createProgram === 'function' &&
    typeof api.createSourceFile === 'function' &&
    typeof api.createPrinter === 'function' &&
    typeof api.sys === 'object'
  );
}

/**
 * Resolve the Compiler API for the builder.
 *
 * 1. `typescript` (4.9–6.x) — used as-is.
 * 2. `typescript@7+` ships no Compiler API, so fall back to
 *    `@typescript/typescript6` when it is installed.
 * 3. Otherwise fail with instructions.
 *
 * `requireFn` is injectable for tests.
 */
export function loadTypeScript(requireFn: RequireFn = require): typeof TS {
  let primary: unknown;
  let primaryMissing = false;

  try {
    primary = requireFn('typescript');
  } catch {
    primaryMissing = true;
  }

  if (hasCompilerApi(primary)) {
    return primary;
  }

  try {
    const fallback = requireFn(FALLBACK_PACKAGE);

    if (hasCompilerApi(fallback)) {
      return fallback;
    }
  } catch {
    // fall through to the error below
  }

  if (primaryMissing) {
    throw new BuilderError(
      `Cannot find module 'typescript'. ts-remote/builder needs the TypeScript Compiler API: ` +
        `install typescript@4.9–6.x, or typescript@7 together with ${FALLBACK_PACKAGE}.`,
    );
  }

  const version = readVersion(primary);

  throw new BuilderError(
    `typescript@${version} does not ship the JavaScript Compiler API that ts-remote/builder is ` +
      `built on (TypeScript 7 moved to a native compiler). Install the compatibility package ` +
      `next to it and the builder will pick it up automatically:\n\n` +
      `  npm install -D ${FALLBACK_PACKAGE}\n\n` +
      `The fetcher and CLI keep working on TypeScript 7 without it.`,
  );
}

function readVersion(mod: unknown): string {
  if (typeof mod === 'object' && mod !== null && 'version' in mod) {
    const version = (mod as { version?: unknown }).version;
    if (typeof version === 'string') return version;
  }
  return 'unknown';
}
