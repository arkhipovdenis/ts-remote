/**
 * Test: CommonJS import patterns (import = require)
 *
 * Covers:
 * 1. import = require with external module (preserved as-is)
 * 2. import = require with internal module (inlined, qualified names resolved)
 * 3. Usage via qualified names: X.Type
 * 4. typeof with qualified names
 */

// External module: import = require (should be preserved)
import events = require('node:events');

// Internal module: import = require (should be inlined)
import types = require('./aliased-types');

// Pattern: external qualified name as type annotation
export const emitter: events.EventEmitter = new events.EventEmitter();

// Pattern: typeof with external qualified name
export type EmitterType = typeof emitter;

// Pattern: internal qualified name as type annotation
export const config: types.OriginalConfig = { host: 'localhost', port: 3000 };

// Pattern: typeof with internal qualified name
export type ConfigType = typeof config;

// Pattern: internal qualified name in type alias
export type AppStatus = types.OriginalStatus;

// Pattern: internal qualified name in function signature
export function createConfig(host: string, port: number): types.OriginalConfig {
  return { host, port };
}

// Pattern: function with both external and internal qualified names
export function createEmitterWithConfig(
  cfg: types.OriginalConfig,
): events.EventEmitter {
  return new events.EventEmitter();
}
