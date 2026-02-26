/**
 * Test: import { x as y } → export const a: y → export type b = typeof a
 *
 * This file tests that aliased imports are correctly resolved in:
 * 1. Type annotations on exported constants
 * 2. typeof expressions referencing those constants
 * 3. Re-exported aliased types
 */
import { OriginalConfig as RenamedConfig } from './aliased-types';
import { OriginalStatus as Status } from './aliased-types';
import { OriginalLevel as Level } from './aliased-types';

// Pattern: import { x as y } → export const a: y
export const config: RenamedConfig = { host: 'localhost', port: 3000 };

// Pattern: export type b = typeof a (where a uses aliased type)
export type ConfigType = typeof config;

// Pattern: aliased type used directly in export type
export type AppStatus = Status;

// Pattern: aliased enum used as type annotation
export const defaultLevel: Level = 0 as Level;

// Pattern: typeof with aliased enum value
export type LevelType = typeof defaultLevel;

// Pattern: function using aliased types
export function createConfig(host: string, port: number): RenamedConfig {
  return { host, port };
}

// Pattern: generic with aliased type constraint
export function getConfigValue<K extends keyof RenamedConfig>(
  cfg: RenamedConfig,
  key: K,
): RenamedConfig[K] {
  return cfg[key];
}

// Pattern: array of aliased type
export const configs: RenamedConfig[] = [];

// Pattern: re-export with alias
export { OriginalConfig as AliasedExportConfig } from './aliased-types';
export type { OriginalStatus as AliasedExportStatus } from './aliased-types';

// ===== External module aliases =====
import { type Buffer as Buf } from 'node:buffer';
import { EventEmitter as Emitter } from 'node:events';

// Pattern: external aliased type in annotation
export const buf: Buf = Buffer.alloc(0);

// Pattern: typeof with external aliased type
export type BufType = typeof buf;

// Pattern: external aliased class as type annotation
export const emitter: Emitter = new Emitter();

// Pattern: typeof with external aliased class
export type EmitterType = typeof emitter;

// Pattern: function using external aliased type
export function createBuffer(size: number): Buf {
  return Buffer.alloc(size);
}
