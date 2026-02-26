/**
 * Aliased import types: import { x as y }, export const a: y, export type b = typeof a
 */
export interface OriginalConfig {
  host: string;
  port: number;
}

export type OriginalStatus = 'active' | 'inactive';

export enum OriginalLevel {
  Low,
  Medium,
  High,
}
