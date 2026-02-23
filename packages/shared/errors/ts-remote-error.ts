/**
 * Base error class for all ts-remote errors.
 *
 * Provides structured error information with error codes and optional details.
 */
export abstract class TsRemoteError extends Error {
  /**
   * Creates a new TsRemoteError.
   *
   * @param message - Human-readable error message
   * @param code - Machine-readable error code
   * @param details - Optional additional error details
   */
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: unknown,
  ) {
    super(`[ts-remote:${code}] ${message}`);
    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }
}
