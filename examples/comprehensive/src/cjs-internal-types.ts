/**
 * Internal types used exclusively by cjs-standalone example
 */
export interface ServerConfig {
  hostname: string;
  port: number;
  ssl: boolean;
}

export type ServerStatus = 'running' | 'stopped' | 'error';

export enum LogLevel {
  Debug,
  Info,
  Warn,
  Error,
}
