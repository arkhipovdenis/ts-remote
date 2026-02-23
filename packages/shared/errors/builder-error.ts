import { TsRemoteError } from './ts-remote-error';

/**
 * Base error class for builder-related errors.
 */
export class BuilderError extends TsRemoteError {
  constructor(message: string, details?: unknown) {
    super(message, 'BUILDER_ERROR', details);
  }
}

/**
 * Error thrown when duplicate entry filenames are detected.
 */
export class DuplicateFilenameError extends BuilderError {
  constructor(filename: string) {
    super(`Duplicate entry filename: ${filename}`, { filename });
  }
}

/**
 * Error thrown when duplicate module names are detected.
 */
export class DuplicateModuleError extends BuilderError {
  constructor(moduleName: string) {
    super(`Duplicate module name: ${moduleName}`, { moduleName });
  }
}

/**
 * Error thrown when declaration emission fails.
 */
export class EmitFailedError extends BuilderError {
  constructor(filename: string) {
    super(`Failed to emit declarations for file: ${filename}`, { filename });
  }
}

/**
 * Error thrown when source file cannot be found.
 */
export class SourceFileNotFoundError extends BuilderError {
  constructor(filename: string) {
    super(`Source file not found: ${filename}`, { filename });
  }
}
