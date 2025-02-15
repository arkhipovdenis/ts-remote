export class BuilderError extends Error {
  constructor(message: string, options: ErrorOptions = {}) {
    super(`[ts-remote] ${message}`, options);
  }
}
